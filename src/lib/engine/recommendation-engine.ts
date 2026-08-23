/**
 * MoSPI FRAC Recommendation Engine (R2)
 *
 * Implements multi-factor semantic and rule-based recommendation algorithms
 * mapping official statistical skill gaps to iGOT Karmayogi (Sunbird-CB)
 * and NSSTA TPAC course catalogs.
 *
 * Evaluation Factors:
 * 1. Target Competency Match & Gap Priority Weighting
 * 2. Proficiency Level Alignment (Target Δ = courseLevel - assessedLevel = 1 optimal)
 * 3. Official Cadre Targeting (ISS Assistant Director, SSO, JSO)
 * 4. Course Quality Rating & Source Distribution
 */

import type {
  CadreId,
  CompetencyDomain,
  ProficiencyLevel,
  SkillGap,
  AssessmentResult,
  CadreBenchmark,
} from "../types/frac";
import type {
  SunbirdCBCourse,
  CourseRecommendation,
  CourseFilter,
  MatchedCompetencyDetail,
  CourseSource,
} from "../types/sunbird";
import type { UserProfile } from "../types/user";

export interface GapInfo {
  gap: number;
  priority?: number;
  priorityScore?: number;
  assessedLevel: number;
  benchmarkLevel: number;
  domain?: CompetencyDomain;
  competencyName?: string;
}

/**
 * Normalizes cadre identifiers to handle aliases (e.g., ISS_AD vs ISS_ASSISTANT_DIRECTOR).
 */
export function normalizeCadre(cadre: string | CadreId): string[] {
  const c = String(cadre).trim().toUpperCase();
  if (c === "ISS_AD" || c === "ISS_ASSISTANT_DIRECTOR" || c === "ISS AD") {
    return ["ISS_AD", "ISS_ASSISTANT_DIRECTOR"];
  }
  if (c === "SSO" || c === "SENIOR_STATISTICAL_OFFICER") {
    return ["SSO", "SENIOR_STATISTICAL_OFFICER"];
  }
  if (c === "JSO" || c === "JUNIOR_STATISTICAL_OFFICER") {
    return ["JSO", "JUNIOR_STATISTICAL_OFFICER"];
  }
  return [c];
}

/**
 * Checks if a course target audience includes the given user cadre.
 */
export function isCadreMatch(courseTargetAudience: string[] | CadreId[], userCadre: string | CadreId): boolean {
  if (!courseTargetAudience || courseTargetAudience.length === 0) {
    return false;
  }
  const userCadreVariants = normalizeCadre(userCadre);
  return courseTargetAudience.some((audienceItem) => {
    const audienceVariants = normalizeCadre(audienceItem);
    return userCadreVariants.some((v) => audienceVariants.includes(v));
  });
}

/**
 * Computes level alignment factor between course target level and user's current assessed level.
 *
 * Scoring Multipliers:
 * - Optimal single-step progression (K.level === assessedLevel + 1): 1.30
 * - Valid multi-step closure (assessedLevel < K.level <= benchmarkLevel): 1.10
 * - Over-qualified for cadre benchmark (K.level > benchmarkLevel): 0.75
 * - Below or equal to current assessed level (K.level <= assessedLevel): 0.30
 */
export function computeLevelAlignmentFactor(
  courseLevel: number,
  assessedLevel: number,
  benchmarkLevel: number
): number {
  if (courseLevel === assessedLevel + 1) {
    return 1.30;
  }
  if (courseLevel > assessedLevel && courseLevel <= benchmarkLevel) {
    return 1.10;
  }
  if (courseLevel > benchmarkLevel) {
    return 0.75;
  }
  return 0.30;
}

/**
 * Generates an explainable pedagogical rationale for the course recommendation.
 */
export function generateRecommendationReason(
  course: SunbirdCBCourse,
  matchedCompetencies: MatchedCompetencyDetail[],
  cadreMatches: boolean,
  userCadre: string
): string {
  const primary = matchedCompetencies[0];
  const sourceLabel = course.source === "NSSTA TPAC" ? "NSSTA residential programme" : "iGOT Karmayogi micro-course";
  
  if (matchedCompetencies.length > 1) {
    const names = matchedCompetencies.map((m) => m.competencyName).join(" & ");
    return `Multi-competency ${sourceLabel} closing gaps in ${names}. Level ${primary.courseTargetLevel} delivery provides structured capability building${cadreMatches ? ` tailored for ${userCadre} cadre` : ""}.`;
  }

  const isOptimalStep = primary.courseTargetLevel === primary.userCurrentLevel + 1;
  if (isOptimalStep) {
    return `Optimal single-step progression (+1 Level) to advance ${primary.competencyName} from Level ${primary.userCurrentLevel} to Level ${primary.courseTargetLevel}${cadreMatches ? ` for ${userCadre} officials` : ""}.`;
  }

  if (primary.courseTargetLevel >= primary.benchmarkLevel) {
    return `Full benchmark closure course (${primary.courseTargetLevel}/${primary.benchmarkLevel}) in ${primary.competencyName} via ${course.organisation}.`;
  }

  return `Targeted ${sourceLabel} addressing skill gap in ${primary.competencyName} with practical applied modules.`;
}

/**
 * Core Recommendation Algorithm:
 * Maps evaluated skill gaps to prioritized courses across iGOT and NSSTA catalogs.
 *
 * Supports flexible parameter signatures:
 * - recommendCoursesForGaps(userGaps, userCadre, courseCatalog)
 * - recommendCoursesForGaps(gaps, courseCatalog, userCadre)
 */
export function recommendCoursesForGaps(
  gapsInput: SkillGap[] | Record<string, GapInfo> | AssessmentResult | undefined | null,
  arg2: string | SunbirdCBCourse[],
  arg3?: SunbirdCBCourse[] | string
): CourseRecommendation[] {
  if (!gapsInput) {
    return [];
  }

  // Resolve argument polymorphism
  let courseCatalog: SunbirdCBCourse[] = [];
  let userCadre: string = "ISS_AD";

  if (Array.isArray(arg2)) {
    courseCatalog = arg2;
    userCadre = typeof arg3 === "string" ? arg3 : "ISS_AD";
  } else {
    userCadre = typeof arg2 === "string" ? arg2 : "ISS_AD";
    courseCatalog = Array.isArray(arg3) ? arg3 : [];
  }

  if (!courseCatalog || courseCatalog.length === 0) {
    return [];
  }

  // Normalize gaps to Record<string, GapInfo>
  const gapMap: Record<string, GapInfo> = {};

  if (Array.isArray(gapsInput)) {
    for (const g of gapsInput) {
      if (g && g.gap > 0) {
        gapMap[g.competencyId] = {
          gap: g.gap,
          priority: g.priorityScore ?? g.gap,
          priorityScore: g.priorityScore ?? g.gap,
          assessedLevel: g.assessedLevel,
          benchmarkLevel: g.benchmarkLevel,
          domain: g.domain,
          competencyName: g.competencyName,
        };
      }
    }
  } else if ("gaps" in gapsInput && Array.isArray((gapsInput as AssessmentResult).gaps)) {
    for (const g of (gapsInput as AssessmentResult).gaps) {
      if (g && g.gap > 0) {
        gapMap[g.competencyId] = {
          gap: g.gap,
          priority: g.priorityScore ?? g.gap,
          priorityScore: g.priorityScore ?? g.gap,
          assessedLevel: g.assessedLevel,
          benchmarkLevel: g.benchmarkLevel,
          domain: g.domain,
          competencyName: g.competencyName,
        };
      }
    }
  } else if (typeof gapsInput === "object") {
    for (const [compId, info] of Object.entries(gapsInput as Record<string, any>)) {
      if (info && (info.gap > 0 || (info.benchmarkLevel > info.assessedLevel))) {
        const gapVal = info.gap ?? Math.max(0, (info.benchmarkLevel || 0) - (info.assessedLevel || 0));
        gapMap[compId] = {
          gap: gapVal,
          priority: info.priority ?? info.priorityScore ?? gapVal,
          priorityScore: info.priorityScore ?? info.priority ?? gapVal,
          assessedLevel: info.assessedLevel ?? 1,
          benchmarkLevel: info.benchmarkLevel ?? 4,
          domain: info.domain,
          competencyName: info.competencyName,
        };
      }
    }
  }

  // If no active gaps exist, return empty array
  if (Object.keys(gapMap).length === 0) {
    return [];
  }

  const candidateMatches: CourseRecommendation[] = [];

  for (const course of courseCatalog) {
    const matchedCompetencies: MatchedCompetencyDetail[] = [];
    let totalRelevanceScore = 0.0;

    for (const compMap of course.competencies) {
      if (gapMap[compMap.id] && gapMap[compMap.id].gap > 0) {
        const gapInfo = gapMap[compMap.id];
        const alignmentFactor = computeLevelAlignmentFactor(
          compMap.level,
          gapInfo.assessedLevel,
          gapInfo.benchmarkLevel
        );

        const priorityVal = gapInfo.priority ?? gapInfo.priorityScore ?? 1.0;
        const weightVal = compMap.weight ?? 1.0;
        const matchScore = priorityVal * weightVal * alignmentFactor;
        totalRelevanceScore += matchScore;

        const gapCovered = Math.min(
          gapInfo.gap,
          Math.max(0, compMap.level - gapInfo.assessedLevel)
        );

        matchedCompetencies.push({
          competencyId: compMap.id,
          competencyName: compMap.name || gapInfo.competencyName || compMap.id,
          courseTargetLevel: compMap.level,
          userCurrentLevel: gapInfo.assessedLevel,
          benchmarkLevel: gapInfo.benchmarkLevel,
          gapCovered,
        });
      }
    }

    if (matchedCompetencies.length > 0) {
      const cadreMatch = isCadreMatch(course.targetAudience, userCadre);
      const cadreMultiplier = cadreMatch ? 1.20 : 0.85;
      const ratingMultiplier = 1.0 + ((course.rating || 3.0) - 3.0) * 0.05;
      const finalScore = totalRelevanceScore * cadreMultiplier * ratingMultiplier;
      const normalizedScore = Math.min(100.0, Number((finalScore * 18.5).toFixed(1)));

      const primaryComp = matchedCompetencies[0];
      const effortHours = course.durationMinutes
        ? Math.round(course.durationMinutes / 60)
        : parseInt(course.duration, 10) || 10;

      const reason = generateRecommendationReason(
        course,
        matchedCompetencies,
        cadreMatch,
        userCadre
      );

      candidateMatches.push({
        course,
        targetCompetencyId: primaryComp.competencyId,
        targetCompetencyName: primaryComp.competencyName,
        relevanceScore: normalizedScore,
        recommendationScore: normalizedScore,
        cadreMatch,
        estimatedEffortHours: effortHours,
        sourceBadge: course.source as CourseSource,
        recommendationReason: reason,
        matchedCompetencies,
        primaryCompetencyCovered: primaryComp.competencyName,
        deliveryMode: course.deliveryMode,
        estimatedDuration: course.duration,
      });
    }
  }

  // Sort descending by recommendationScore / relevanceScore
  return candidateMatches.sort(
    (a, b) => (b.recommendationScore ?? b.relevanceScore) - (a.recommendationScore ?? a.relevanceScore)
  );
}

/**
 * Filter and search helper for courses.
 */
export function filterCourseCatalog(
  courses: SunbirdCBCourse[],
  filters: CourseFilter
): SunbirdCBCourse[] {
  let result = [...courses];

  if (filters.source && filters.source !== ("All" as any)) {
    result = result.filter((c) => c.source === filters.source);
  }

  if (filters.cadre && filters.cadre !== ("All" as any)) {
    result = result.filter((c) => isCadreMatch(c.targetAudience, filters.cadre!));
  }

  if (filters.domain && filters.domain !== ("All" as any)) {
    result = result.filter((c) =>
      c.competencies.some((cmp) => cmp.competencyArea === filters.domain)
    );
  }

  if (filters.competencyId) {
    result = result.filter((c) =>
      c.competencies.some((cmp) => cmp.id === filters.competencyId)
    );
  }

  if (filters.level) {
    result = result.filter((c) =>
      c.competencies.some((cmp) => cmp.level >= filters.level!)
    );
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter((c) => {
      const matchTitle = c.name?.toLowerCase().includes(q);
      const matchCode = c.code?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      const matchOrg = c.organisation?.toLowerCase().includes(q);
      const matchCompetencies = c.competencies?.some(
        (cmp) => cmp.name?.toLowerCase().includes(q) || cmp.id?.toLowerCase().includes(q)
      );
      const matchOutcomes = c.learningOutcomes?.some((o) => o?.toLowerCase().includes(q));
      return matchTitle || matchCode || matchDesc || matchOrg || matchCompetencies || matchOutcomes;
    });
  }

  return result;
}
