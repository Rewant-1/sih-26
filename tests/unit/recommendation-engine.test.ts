import { describe, it, expect } from '../runner';
import {
  recommendCoursesForGaps,
  computeLevelAlignmentFactor,
  isCadreMatch,
  normalizeCadre,
  filterCourseCatalog,
  type GapInfo,
} from '../../src/lib/engine/recommendation-engine';
import type { SunbirdCBCourse, CourseRecommendation } from '../../src/lib/types/sunbird';

// Re-export for downstream test imports (Tier 1-4)
export {
  recommendCoursesForGaps,
  computeLevelAlignmentFactor,
  isCadreMatch,
  normalizeCadre,
  filterCourseCatalog,
};
export type { GapInfo, CourseRecommendation, SunbirdCBCourse };

// Sample Course Catalog Fixture
export const MOCK_COURSES: SunbirdCBCourse[] = [
  {
    identifier: 'do_igot_stat_001',
    name: 'Foundations of National Accounts Statistics (SNA 2008)',
    code: 'IGOT-STAT-01',
    description: 'Comprehensive self-paced e-learning on System of National Accounts (SNA 2008) principles.',
    framework: 'MoSPI-FRAC-2026',
    organisation: 'iGOT Karmayogi Bharat',
    source: 'iGOT Karmayogi',
    deliveryMode: 'Self-Paced e-Learning',
    duration: '12 Hours',
    durationMinutes: 720,
    enrolledCount: 1420,
    certificationAvailable: true,
    learningOutcomes: ['Understand SNA 2008 identities', 'Calculate GVA'],
    competencies: [
      { id: 'STAT_NAT_02', name: 'National Accounts Statistics & SUT', competencyArea: 'Statistical Competencies', level: 3, weight: 0.9 },
      { id: 'STAT_SMPL_01', name: 'Sampling Design & Survey Methodology', competencyArea: 'Statistical Competencies', level: 2, weight: 0.5 }
    ],
    targetAudience: ['ISS_AD', 'SSO', 'JSO'],
    rating: 4.6
  },
  {
    identifier: 'do_nssta_tpac_001',
    name: 'Advanced National Accounts & Supply-Use Tables (SUT) Masterclass',
    code: 'NSSTA-TPAC-01',
    description: 'Intensive 5-day residential programme on advanced SNA 2008 compilation.',
    framework: 'MoSPI-FRAC-2026',
    organisation: 'National Statistical Systems Training Academy (NSSTA)',
    source: 'NSSTA TPAC',
    deliveryMode: 'Instructor-Led Classroom (NSSTA Greater Noida)',
    duration: '5 Days Residential (30 Hours)',
    durationMinutes: 1800,
    enrolledCount: 120,
    certificationAvailable: true,
    learningOutcomes: ['Construct balanced SUT tables', 'Implement double deflation'],
    competencies: [
      { id: 'STAT_NAT_02', name: 'National Accounts Statistics & SUT', competencyArea: 'Statistical Competencies', level: 4, weight: 1.0 },
      { id: 'STAT_ASI_04', name: 'Industrial & Enterprise Statistics', competencyArea: 'Statistical Competencies', level: 4, weight: 0.7 }
    ],
    targetAudience: ['ISS_AD'],
    rating: 4.9,
    tpacMetadata: {
      calendarYear: '2026-27',
      batchSchedule: 'May 18-22, 2026',
      venue: 'NSSTA Campus, Greater Noida, UP',
      courseDirector: 'Additional Director General, NSSTA',
      nominationDeadline: '2026-04-30',
      targetParticipantsLimit: 35
    }
  },
  {
    identifier: 'do_igot_tech_001',
    name: 'R for Official Statistics: Survey Data Wrangling & Weighted Analysis',
    code: 'IGOT-TECH-01',
    description: 'Applied statistical computing using R and the survey package.',
    framework: 'MoSPI-FRAC-2026',
    organisation: 'iGOT Karmayogi Bharat',
    source: 'iGOT Karmayogi',
    deliveryMode: 'Self-Paced e-Learning',
    duration: '20 Hours',
    durationMinutes: 1200,
    enrolledCount: 2100,
    certificationAvailable: true,
    learningOutcomes: ['Data wrangling with tidyverse', 'Survey design weighting'],
    competencies: [
      { id: 'TECH_R_01', name: 'Statistical Computing with R', competencyArea: 'Technical Competencies', level: 3, weight: 1.0 }
    ],
    targetAudience: ['ISS_AD', 'SSO', 'JSO'],
    rating: 4.8
  },
  {
    identifier: 'do_nssta_tpac_006',
    name: 'Microdata Anonymization & Statistical Disclosure Control (SDC) with sdcMicro',
    code: 'NSSTA-TPAC-06',
    description: 'Technical workshop on disclosure risk assessment and perturbation techniques.',
    framework: 'MoSPI-FRAC-2026',
    organisation: 'National Statistical Systems Training Academy (NSSTA)',
    source: 'NSSTA TPAC',
    deliveryMode: 'Virtual Synchronous Workshop',
    duration: '3 Days Residential (18 Hours)',
    durationMinutes: 1080,
    enrolledCount: 95,
    certificationAvailable: true,
    learningOutcomes: ['Calculate k-anonymity', 'Apply top coding and swapping'],
    competencies: [
      { id: 'GOV_SDC_02', name: 'Statistical Disclosure Control & Anonymization', competencyArea: 'Digital Governance & Data Stewardship', level: 4, weight: 1.0 },
      { id: 'TECH_R_01', name: 'Statistical Computing with R', competencyArea: 'Technical Competencies', level: 3, weight: 0.6 }
    ],
    targetAudience: ['ISS_AD', 'SSO'],
    rating: 4.7,
    tpacMetadata: {
      calendarYear: '2026-27',
      batchSchedule: 'July 14-16, 2026',
      venue: 'Virtual Classroom / NSSTA Greater Noida',
      courseDirector: 'Deputy Director General, DIID & NSSTA',
      nominationDeadline: '2026-06-30',
      targetParticipantsLimit: 50
    }
  }
];

describe('Recommendation Engine (Unit)', () => {
  it('recommends courses that target identified skill gaps with G_i > 0', () => {
    const userGaps: Record<string, GapInfo> = {
      'STAT_NAT_02': { gap: 2, priority: 3.25, assessedLevel: 2, benchmarkLevel: 4 }
    };

    const recs = recommendCoursesForGaps(userGaps, 'ISS_AD', MOCK_COURSES);
    expect(recs.length).toBe(2); // Both SNA courses match STAT_NAT_02
    expect(recs[0].matchedCompetencies![0].competencyId).toBe('STAT_NAT_02');
  });

  it('assigns higher level alignment factor (1.30) to optimal single-step progression (Level Assessed + 1)', () => {
    // Assessed = 2, Target Course Level 3 (Optimal +1 step)
    const userGaps: Record<string, GapInfo> = {
      'STAT_NAT_02': { gap: 2, priority: 3.0, assessedLevel: 2, benchmarkLevel: 4 }
    };

    const recs = recommendCoursesForGaps(userGaps, 'ISS_AD', MOCK_COURSES);
    const igotCourse = recs.find(r => r.course.identifier === 'do_igot_stat_001');
    expect(igotCourse).toBeDefined();
    // do_igot_stat_001 has level 3 for assessed level 2 -> optimal step
    expect(igotCourse!.matchedCompetencies![0].courseTargetLevel).toBe(3);
    expect(computeLevelAlignmentFactor(3, 2, 4)).toBe(1.30);
  });

  it('computes correct alignment factors for multi-step closure, over-qualified, and below levels', () => {
    // Multi-step closure (e.g. course level 4 for assessed level 2 when benchmark is 4)
    expect(computeLevelAlignmentFactor(4, 2, 4)).toBe(1.10);
    // Over-qualified (course level 5 when benchmark is 4)
    expect(computeLevelAlignmentFactor(5, 2, 4)).toBe(0.75);
    // Below or equal to current assessed level (course level 2 when assessed is 2)
    expect(computeLevelAlignmentFactor(2, 2, 4)).toBe(0.30);
    expect(computeLevelAlignmentFactor(1, 2, 4)).toBe(0.30);
  });

  it('applies cadre fit multiplier 1.20 when user cadre matches target audience', () => {
    const userGaps: Record<string, GapInfo> = {
      'TECH_R_01': { gap: 1, priority: 1.56, assessedLevel: 2, benchmarkLevel: 3 }
    };

    // User is SSO -> matches targetAudience ['ISS_AD', 'SSO', 'JSO']
    const recsSSO = recommendCoursesForGaps(userGaps, 'SSO', MOCK_COURSES);
    const ssoScore = recsSSO.find(r => r.course.identifier === 'do_igot_tech_001')!.recommendationScore;

    // User is UNKNOWN -> 0.85 multiplier
    const recsUnknown = recommendCoursesForGaps(userGaps, 'UNKNOWN_CADRE', MOCK_COURSES);
    const unkScore = recsUnknown.find(r => r.course.identifier === 'do_igot_tech_001')!.recommendationScore;

    expect(ssoScore!).toBeGreaterThan(unkScore!);
  });

  it('correctly maps source badges (iGOT Karmayogi vs NSSTA TPAC)', () => {
    const userGaps: Record<string, GapInfo> = {
      'STAT_NAT_02': { gap: 2, priority: 3.25, assessedLevel: 2, benchmarkLevel: 4 }
    };

    const recs = recommendCoursesForGaps(userGaps, 'ISS_AD', MOCK_COURSES);
    const igotRec = recs.find(r => r.course.source === 'iGOT Karmayogi');
    const nsstaRec = recs.find(r => r.course.source === 'NSSTA TPAC');

    expect(igotRec?.sourceBadge).toBe('iGOT Karmayogi');
    expect(nsstaRec?.sourceBadge).toBe('NSSTA TPAC');
    expect(nsstaRec?.course.tpacMetadata?.venue).toContain('Greater Noida');
  });

  it('ranks higher-priority gaps and higher-rated courses first in output list', () => {
    const userGaps: Record<string, GapInfo> = {
      'STAT_NAT_02': { gap: 2, priority: 4.0, assessedLevel: 2, benchmarkLevel: 4 },
      'TECH_R_01': { gap: 1, priority: 1.2, assessedLevel: 2, benchmarkLevel: 3 }
    };

    const recs = recommendCoursesForGaps(userGaps, 'ISS_AD', MOCK_COURSES);
    expect(recs.length).toBeGreaterThan(1);
    // Highest score should be at index 0
    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].recommendationScore!).toBeGreaterThanOrEqual(recs[i + 1].recommendationScore!);
    }
  });

  it('returns empty recommendation array when user has zero skill gaps', () => {
    const userGaps: Record<string, GapInfo> = {};
    const recs = recommendCoursesForGaps(userGaps, 'ISS_AD', MOCK_COURSES);
    expect(recs.length).toBe(0);
  });

  it('generates rich explainable recommendation reasons', () => {
    const userGaps: Record<string, GapInfo> = {
      'STAT_NAT_02': { gap: 2, priority: 3.25, assessedLevel: 2, benchmarkLevel: 4 }
    };

    const recs = recommendCoursesForGaps(userGaps, 'ISS_AD', MOCK_COURSES);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].recommendationReason).toBeDefined();
    expect(recs[0].recommendationReason.length).toBeGreaterThan(15);
  });

  it('filters course catalog by domain, source, cadre, and search string', () => {
    const igotOnly = filterCourseCatalog(MOCK_COURSES, { source: 'iGOT Karmayogi' });
    expect(igotOnly.every(c => c.source === 'iGOT Karmayogi')).toBe(true);

    const rCourses = filterCourseCatalog(MOCK_COURSES, { search: 'R for Official' });
    expect(rCourses.length).toBe(1);
    expect(rCourses[0].identifier).toBe('do_igot_tech_001');

    const issCourses = filterCourseCatalog(MOCK_COURSES, { cadre: 'ISS_AD' });
    expect(issCourses.length).toBe(4);
  });
}, 'Unit', 'RECOMMENDATION_ENGINE');
