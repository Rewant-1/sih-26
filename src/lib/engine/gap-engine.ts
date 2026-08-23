import type {
  CompetencyDomain,
  DomainCode,
  CadreId,
  CadreBenchmark,
  SkillGap,
  AssessmentResult,
  GapSeverity,
} from "../types/frac";
import taxonomyData from "../data/frac-taxonomy.json";

// Domain weights specified in MoSPI FRAC specification
export const DOMAIN_WEIGHTS: Record<string, number> = {
  "Statistical Competencies": 1.30,
  "Technical Competencies": 1.25,
  "Digital Governance & Data Stewardship": 1.15,
  "Behavioural & Managerial Competencies": 1.00,
  // Short codes
  STAT: 1.30,
  TECH: 1.25,
  GOV: 1.15,
  BEH: 1.00,
};

// Domain Code to Full Domain Name Mapping
export const DOMAIN_MAP: Record<DomainCode | string, CompetencyDomain> = {
  STAT: "Statistical Competencies",
  TECH: "Technical Competencies",
  GOV: "Digital Governance & Data Stewardship",
  BEH: "Behavioural & Managerial Competencies",
  "Statistical Competencies": "Statistical Competencies",
  "Technical Competencies": "Technical Competencies",
  "Digital Governance & Data Stewardship": "Digital Governance & Data Stewardship",
  "Behavioural & Managerial Competencies": "Behavioural & Managerial Competencies",
};

// Cadre Criticality Multiplier based on Benchmark Level
export const CADRE_CRITICALITY = (benchmarkLevel: number): number => {
  if (benchmarkLevel >= 4) return 1.25;
  if (benchmarkLevel === 3) return 1.00;
  return 0.85;
};

// Map of competency ID to metadata for fast lookup
export const COMPETENCY_METADATA: Record<
  string,
  { name: string; domain: CompetencyDomain; domainCode: DomainCode }
> = {};

for (const comp of taxonomyData) {
  COMPETENCY_METADATA[comp.id] = {
    name: comp.name,
    domain: comp.domain as CompetencyDomain,
    domainCode: comp.domainCode as DomainCode,
  };
}

/**
 * Resolve domain from competency ID prefix or metadata
 */
export function getDomainFromCompetencyId(competencyId: string): CompetencyDomain {
  if (COMPETENCY_METADATA[competencyId]) {
    return COMPETENCY_METADATA[competencyId].domain;
  }
  if (competencyId.startsWith("STAT")) return "Statistical Competencies";
  if (competencyId.startsWith("TECH")) return "Technical Competencies";
  if (competencyId.startsWith("GOV")) return "Digital Governance & Data Stewardship";
  return "Behavioural & Managerial Competencies";
}

/**
 * Resolve competency title from ID
 */
export function getCompetencyName(competencyId: string): string {
  if (COMPETENCY_METADATA[competencyId]) {
    return COMPETENCY_METADATA[competencyId].name;
  }
  return competencyId;
}

/**
 * Compute skill gap for an individual competency
 */
export function computeSkillGap(
  competencyId: string,
  domain: string,
  assessedLevel: number,
  benchmarkLevel: number,
  competencyName?: string
): SkillGap {
  // Clamping input ratings to valid range
  const clampedAssessed = Math.max(1, Math.min(5, Math.round(assessedLevel || 1)));
  const clampedBenchmark = Math.max(1, Math.min(5, Math.round(benchmarkLevel || 1)));

  const rawDelta = clampedAssessed - clampedBenchmark;
  const gap = Math.max(0, clampedBenchmark - clampedAssessed);
  const domainWeight = DOMAIN_WEIGHTS[domain] || 1.0;
  const cadreCrit = CADRE_CRITICALITY(clampedBenchmark);
  const priorityScore = Number((gap * domainWeight * cadreCrit).toFixed(3));

  let severity: GapSeverity;
  if (gap >= 2 || priorityScore >= 2.50) {
    severity = "CRITICAL";
  } else if (gap === 1) {
    severity = "MODERATE";
  } else if (gap === 0 && rawDelta === 0) {
    severity = "PROFICIENT";
  } else {
    severity = "SURPLUS";
  }

  let suggestedAction: string;
  if (severity === "CRITICAL") {
    suggestedAction = "Mandatory enrollment in NSSTA residential workshop / iGOT priority course";
  } else if (severity === "MODERATE") {
    suggestedAction = "Recommended self-paced learning via iGOT Karmayogi module";
  } else if (severity === "PROFICIENT") {
    suggestedAction = "Maintain proficiency via peer mentoring and knowledge sharing";
  } else {
    suggestedAction = "Eligible for master trainer nomination / advanced peer mentorship";
  }

  const fullDomain = DOMAIN_MAP[domain] || getDomainFromCompetencyId(competencyId);
  const name = competencyName || getCompetencyName(competencyId);

  return {
    competencyId,
    competencyName: name,
    domain: fullDomain,
    assessedLevel: clampedAssessed,
    benchmarkLevel: clampedBenchmark,
    gap,
    rawDelta,
    priorityScore,
    severity,
    suggestedAction,
  };
}

/**
 * Deterministic FRAC Skill Gap Calculation Engine
 * Compares assessed ratings against cadre benchmarks across all 29 official competencies.
 */
export function calculateSkillGaps(
  assessedRatings: Record<string, number>,
  cadre: CadreId,
  benchmarks: CadreBenchmark,
  userId: string = "user-current"
): AssessmentResult {
  const benchmarkMap = benchmarks.benchmarks || {};
  const gaps: SkillGap[] = [];

  const domainTotals: Record<
    CompetencyDomain,
    { assessedSum: number; benchmarkSum: number }
  > = {
    "Statistical Competencies": { assessedSum: 0, benchmarkSum: 0 },
    "Technical Competencies": { assessedSum: 0, benchmarkSum: 0 },
    "Digital Governance & Data Stewardship": { assessedSum: 0, benchmarkSum: 0 },
    "Behavioural & Managerial Competencies": { assessedSum: 0, benchmarkSum: 0 },
  };

  // Evaluate every competency present in benchmark or taxonomy
  const allCompetencyIds = Array.from(
    new Set([...Object.keys(benchmarkMap), ...taxonomyData.map((t) => t.id)])
  );

  for (const compId of allCompetencyIds) {
    const bLevel = benchmarkMap[compId] || 3;
    const aLevel = assessedRatings[compId] ?? 1;
    const meta = COMPETENCY_METADATA[compId];
    const domain = meta ? meta.domain : getDomainFromCompetencyId(compId);
    const domainCode = meta ? meta.domainCode : compId.substring(0, 4);

    const gapResult = computeSkillGap(
      compId,
      domainCode,
      aLevel,
      bLevel,
      meta?.name
    );
    gaps.push(gapResult);

    // Accumulate domain totals
    if (domainTotals[domain]) {
      domainTotals[domain].assessedSum += gapResult.assessedLevel;
      domainTotals[domain].benchmarkSum += gapResult.benchmarkLevel;
    }
  }

  // Calculate Domain-Level Proficiency Index (DPI) for each domain
  const domainScores: Record<CompetencyDomain, number> = {
    "Statistical Competencies": 0,
    "Technical Competencies": 0,
    "Digital Governance & Data Stewardship": 0,
    "Behavioural & Managerial Competencies": 0,
  };

  const domainWeights: Record<CompetencyDomain, number> = {
    "Statistical Competencies": benchmarks.domainWeights?.["Statistical Competencies"] ?? 1.30,
    "Technical Competencies": benchmarks.domainWeights?.["Technical Competencies"] ?? 1.25,
    "Digital Governance & Data Stewardship": benchmarks.domainWeights?.["Digital Governance & Data Stewardship"] ?? 1.15,
    "Behavioural & Managerial Competencies": benchmarks.domainWeights?.["Behavioural & Managerial Competencies"] ?? 1.00,
  };

  let weightedDpiSum = 0;
  let totalWeights = 0;

  for (const [dom, totals] of Object.entries(domainTotals)) {
    const domainKey = dom as CompetencyDomain;
    const dpi =
      totals.benchmarkSum > 0
        ? Number(((totals.assessedSum / totals.benchmarkSum) * 100).toFixed(2))
        : 100;
    domainScores[domainKey] = dpi;

    const w = domainWeights[domainKey] || 1.0;
    weightedDpiSum += dpi * w;
    totalWeights += w;
  }

  const overallCompetencyIndex =
    totalWeights > 0
      ? Number((weightedDpiSum / totalWeights).toFixed(2))
      : 100;

  // Sort gaps by priority score descending, then gap descending
  gaps.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    return b.gap - a.gap;
  });

  const criticalGapsCount = gaps.filter((g) => g.severity === "CRITICAL").length;
  const moderateGapsCount = gaps.filter((g) => g.severity === "MODERATE").length;
  const proficientCount = gaps.filter((g) => g.severity === "PROFICIENT").length;
  const surplusCount = gaps.filter((g) => g.severity === "SURPLUS").length;

  return {
    userId,
    cadre,
    assessmentDate: new Date().toISOString(),
    domainScores,
    overallCompetencyIndex,
    gaps,
    criticalGapsCount,
    moderateGapsCount,
    proficientCount,
    surplusCount,
  };
}
