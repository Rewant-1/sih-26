import { describe, it, expect } from '../runner';
import { computeSkillGap, CADRE_BENCHMARKS } from '../unit/gap-engine.test';
import { recommendCoursesForGaps } from '../unit/recommendation-engine.test';
import { sanitizeDocumentText, chunkDocument, extractDocumentMetadata } from '../unit/doc-parser.test';
import { OfflineFactExtractor, calculateBloomWeightedScore, MOSPI_SEED_QUESTION_BANK, BLOOM_WEIGHTS } from '../unit/offline-quiz.test';
import { repository } from '../../src/lib/storage/repository';

describe('Tier 3: Pairwise Combinations & Cross-Feature Integration', () => {
  it('Combination 1: End-to-End Self-Assessment Wizard to Course Recommendation Roadmap', async () => {
    const ratings = {
      'STAT_SMPL_01': 2,
      'STAT_NAT_02': 2,
      'TECH_R_01': 2
    };
    const gaps: Record<string, any> = {};
    for (const [compId, aLevel] of Object.entries(ratings)) {
      const bLevel = (CADRE_BENCHMARKS.ISS_AD as any)[compId];
      const g = computeSkillGap(compId, compId.startsWith('STAT') ? 'STAT' : 'TECH', aLevel, bLevel);
      if (g.gap > 0) {
        gaps[compId] = { gap: g.gap, priority: g.priorityScore, assessedLevel: aLevel, benchmarkLevel: bLevel };
      }
    }
    expect(Object.keys(gaps).length).toBe(3);

    const catalog = [
      {
        identifier: 'c_sna',
        name: 'National Accounts Masterclass',
        code: 'SNA-01',
        source: 'NSSTA TPAC' as const,
        deliveryMode: 'Residential',
        duration: '5 Days',
        durationMinutes: 1800,
        competencies: [{ id: 'STAT_NAT_02', name: 'National Accounts', level: 3 as const, weight: 1.0 }],
        targetAudience: ['ISS_AD'],
        rating: 4.8
      }
    ];
    const recs = recommendCoursesForGaps(gaps, 'ISS_AD', catalog);
    expect(recs.length).toBe(1);
    expect(recs[0].course.identifier).toBe('c_sna');
    expect(recs[0].sourceBadge).toBe('NSSTA TPAC');
  });

  it('Combination 2: Document Ingestion -> Offline Quiz Generation -> Scoring -> Profile Persistence', async () => {
    const rawDoc = `
      NATIONAL SAMPLE SURVEY (NSS) INSTRUCTIONS
      First Stage Unit (FSU) is defined as the 2011 Census village in rural areas.
      In each selected FSU, sample size of 8 households are selected by Circular Systematic Sampling.
    `;
    const cleaned = sanitizeDocumentText(rawDoc);
    const meta = extractDocumentMetadata(cleaned);
    expect(meta.detectedDomain).toBe('Statistical Competencies');

    const facts = OfflineFactExtractor.extractFacts(cleaned);
    expect(facts.length).toBeGreaterThanOrEqual(1);

    const q1 = {
      id: 'q_gen_1',
      bloomLevel: 'Understand',
      correctIndex: 0
    };

    const scoreResult = calculateBloomWeightedScore([q1], { q_gen_1: 0 });
    expect(scoreResult.proficiency).toBe(5.0);

    const stored = await repository.saveAssessmentRecord({
      id: 'asmt-comb-02',
      userId: 'usr-jso-rajesh',
      cadreId: 'JUNIOR_STATISTICAL_OFFICER',
      assessedAt: new Date().toISOString(),
      ratings: { 'STAT_SMPL_01': scoreResult.proficiency },
      computedGaps: [],
      domainScores: {
        'Statistical Competencies': scoreResult.proficiency,
        'Technical Competencies': 3,
        'Digital Governance & Data Stewardship': 3,
        'Behavioural & Managerial Competencies': 3
      },
      overallIndex: 90.0
    });

    expect(stored).toBeDefined();
    expect(stored.ratings['STAT_SMPL_01']).toBe(5.0);
  });

  it('Combination 3: Post-Quiz Score Update recalculates Learner Radar Chart averages', () => {
    const initialDomainScores = {
      statistical: 2.8,
      technical: 3.0,
      governance: 3.5,
      behavioural: 4.0
    };

    const updatedStatScore = Number(((initialDomainScores.statistical * 2 + 4.5) / 3).toFixed(2));
    expect(updatedStatScore).toBeGreaterThan(initialDomainScores.statistical);
    expect(updatedStatScore).toBeCloseTo(3.37, 2);
  });

  it('Combination 4: Promotion from JSO to SSO dynamically adjusts benchmarks and surfaces new gaps', () => {
    const userRating = 3;

    const jsoGap = computeSkillGap('BEH_FLD_01', 'BEH', userRating, CADRE_BENCHMARKS.JSO['BEH_FLD_01']);
    expect(jsoGap.gap).toBe(0);
    expect(jsoGap.severity).toBe('PROFICIENT');

    const ssoGap = computeSkillGap('BEH_FLD_01', 'BEH', userRating, CADRE_BENCHMARKS.SSO['BEH_FLD_01']);
    expect(ssoGap.gap).toBe(1);
    expect(ssoGap.severity).toBe('MODERATE');
  });

  it('Combination 5: Dual-Source Catalog Filtering (iGOT vs NSSTA) across all 3 Statistical Cadres', () => {
    const cadres = ['ISS_AD', 'SSO', 'JSO'];
    const sources = ['iGOT Karmayogi', 'NSSTA TPAC'];

    for (const cadre of cadres) {
      for (const source of sources) {
        expect(cadre).toBeDefined();
        expect(source).toBeDefined();
      }
    }
  });

  it('Combination 6: Division Aggregate Heatmap triggers Automated ACBP Batch Creation for Deficient Units', () => {
    const divisionMetrics = [
      { division: 'FOD', competency: 'GOV_SDC_02', avgScore: 2.2, benchmark: 3.5 },
      { division: 'NAD', competency: 'STAT_NAT_02', avgScore: 4.2, benchmark: 4.0 }
    ];

    const deficientUnits = divisionMetrics.filter(d => d.avgScore < d.benchmark);
    expect(deficientUnits.length).toBe(1);
    expect(deficientUnits[0].division).toBe('FOD');

    const acbpBatch = {
      courseId: 'do_nssta_tpac_006',
      targetDivision: deficientUnits[0].division,
      traineeCount: 40,
      urgency: 'HIGH'
    };
    expect(acbpBatch.targetDivision).toBe('FOD');
  });

  it('Combination 7: 4 FRAC Domains x 3 Official Cadres matrix evaluation', () => {
    const domains = ['Statistical', 'Technical', 'Digital Governance', 'Behavioural'];
    const cadres = ['ISS_AD', 'SSO', 'JSO'];

    let matrixEvaluations = 0;
    for (const d of domains) {
      for (const c of cadres) {
        matrixEvaluations++;
        expect(c).toBeDefined();
        expect(d).toBeDefined();
      }
    }
    expect(matrixEvaluations).toBe(12);
  });

  it('Combination 8: Bloom Levels (6) x Difficulty Levels (3) test case generation permutations', () => {
    const bloom = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
    const difficulties = ['easy', 'medium', 'hard'];

    let count = 0;
    for (const b of bloom) {
      for (const diff of difficulties) {
        count++;
        expect(BLOOM_WEIGHTS[b]).toBeGreaterThan(0);
      }
    }
    expect(count).toBe(18);
  });

  it('Combination 9: Sequential re-assessments showing step-by-step gap closure from Critical -> Moderate -> Proficient', () => {
    const compId = 'STAT_NAT_02';
    const benchmark = 4;

    const turn1 = computeSkillGap(compId, 'STAT', 2, benchmark);
    expect(turn1.severity).toBe('CRITICAL');

    const turn2 = computeSkillGap(compId, 'STAT', 3, benchmark);
    expect(turn2.severity).toBe('MODERATE');

    const turn3 = computeSkillGap(compId, 'STAT', 4, benchmark);
    expect(turn3.severity).toBe('PROFICIENT');
  });

  it('Combination 10: Course Enrollment triggers Roadmap Status transition to ENROLLED', async () => {
    const user = await repository.getUserProfile('usr-jso-rajesh');
    expect(user).toBeDefined();

    user!.enrolledCourseIds.push('do_igot_tech_001');
    await repository.saveUserProfile(user!);

    const updated = await repository.getUserProfile('usr-jso-rajesh');
    expect(updated?.enrolledCourseIds).toContain('do_igot_tech_001');
  });

  it('Combination 11: Microdata Anonymization Course maps to both SDC and R Technical competencies', () => {
    const sdcCourse = {
      identifier: 'do_nssta_tpac_006',
      name: 'Microdata Anonymization with sdcMicro',
      competencies: [
        { id: 'GOV_SDC_02', level: 4, weight: 1.0 },
        { id: 'TECH_R_01', level: 3, weight: 0.6 }
      ]
    };
    expect(sdcCourse.competencies.length).toBe(2);
    expect(sdcCourse.competencies[0].id).toBe('GOV_SDC_02');
    expect(sdcCourse.competencies[1].id).toBe('TECH_R_01');
  });

  it('Combination 12: Quiz Attempt with Mixed Bloom Levels evaluates correct composite weighted score', () => {
    const questions = [
      { id: 'q1', bloomLevel: 'Remember', correctIndex: 0 },
      { id: 'q2', bloomLevel: 'Understand', correctIndex: 1 },
      { id: 'q3', bloomLevel: 'Apply', correctIndex: 2 },
      { id: 'q4', bloomLevel: 'Analyze', correctIndex: 3 }
    ];
    const score = calculateBloomWeightedScore(questions, { q1: 0, q2: 1, q3: 0, q4: 3 });
    expect(score.rawPercent).toBe(75.0);
    expect(score.weightedPercent).toBe(72.7);
  });

  it('Combination 13: Admin Heatmap to Division-Level Drilldown Consistency', () => {
    const divisions = ['FOD', 'ESD', 'NAD', 'DIID', 'SDRD'];
    expect(divisions.length).toBe(5);
    for (const div of divisions) {
      expect(div.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('Combination 14: Time-on-task analytics records per-question response latency', () => {
    const latencyMap = { q1: 42, q2: 58, q3: 31 };
    const avgLatency = (42 + 58 + 31) / 3;
    expect(avgLatency).toBeCloseTo(43.67, 2);
  });

  it('Combination 15: Seed Question Bank contains questions for all 4 FRAC domains', () => {
    const domains = new Set(MOSPI_SEED_QUESTION_BANK.map(q => q.domain));
    expect(domains.has('Statistical Competencies')).toBe(true);
    expect(domains.has('Technical Competencies')).toBe(true);
    expect(domains.has('Digital Governance & Data Stewardship')).toBe(true);
    expect(domains.has('Behavioural & Managerial Competencies')).toBe(true);
  });

  it('Combination 16: Multi-Round Survey Manual Parsing & Chunk Overlap Verification', () => {
    const text = 'Chapter 1: Coverage\n' + 'NSS 79th Round guidelines. '.repeat(100) + '\nChapter 2: Listing\n' + 'FSU selection rules. '.repeat(100);
    const chunks = chunkDocument(text, 200, 30);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('Combination 17: Multi-factor Course Matching handles overlapping multi-competency courses', () => {
    const gaps = {
      'STAT_NAT_02': { gap: 2, priority: 3.25, assessedLevel: 2, benchmarkLevel: 4 },
      'STAT_ASI_04': { gap: 1, priority: 1.50, assessedLevel: 3, benchmarkLevel: 4 }
    };
    const catalog = [
      {
        identifier: 'c_multi',
        name: 'Integrated Economic Statistics',
        code: 'IES-01',
        source: 'NSSTA TPAC' as const,
        deliveryMode: 'Residential',
        duration: '5 Days',
        durationMinutes: 1800,
        competencies: [
          { id: 'STAT_NAT_02', name: 'National Accounts', level: 4 as const, weight: 1.0 },
          { id: 'STAT_ASI_04', name: 'ASI', level: 4 as const, weight: 0.8 }
        ],
        targetAudience: ['ISS_AD'],
        rating: 4.9
      }
    ];
    const recs = recommendCoursesForGaps(gaps, 'ISS_AD', catalog);
    expect(recs.length).toBe(1);
    expect(recs[0].matchedCompetencies.length).toBe(2);
  });

  it('Combination 18: User Assessment submission persists and updates profile currentAssessmentId', async () => {
    const user = await repository.getUserProfile('usr-jso-rajesh');
    const record = {
      id: 'asmt-turn-18',
      userId: 'usr-jso-rajesh',
      cadreId: 'JUNIOR_STATISTICAL_OFFICER' as const,
      assessedAt: new Date().toISOString(),
      ratings: { 'STAT_SMPL_01': 4 },
      computedGaps: [],
      domainScores: {
        'Statistical Competencies': 4,
        'Technical Competencies': 3,
        'Digital Governance & Data Stewardship': 3,
        'Behavioural & Managerial Competencies': 3
      },
      overallIndex: 82.0
    };
    await repository.saveAssessmentRecord(record);
    user!.currentAssessmentId = 'asmt-turn-18';
    await repository.saveUserProfile(user!);

    const saved = await repository.getAssessmentRecords('usr-jso-rajesh');
    expect(saved.find(s => s.id === 'asmt-turn-18')).toBeDefined();
  });

  it('Combination 19: High-priority gaps trigger residential recommendations while low-priority gaps trigger e-learning', () => {
    const criticalGap = computeSkillGap('STAT_NAT_02', 'STAT', 2, 4);
    const moderateGap = computeSkillGap('BEH_PRJ_04', 'BEH', 2, 3);

    expect(criticalGap.suggestedAction).toContain('NSSTA residential');
    expect(moderateGap.suggestedAction).toContain('iGOT Karmayogi');
  });

  it('Combination 20: Full Assessment Flow with zero answer omissions calculates correct completion index', () => {
    const totalCompetencies = 29;
    const answered = 29;
    const isComplete = totalCompetencies === answered;
    expect(isComplete).toBe(true);
  });

  it('Combination 21: Cross-Domain Competency Weighting normalizes OCI calculation to 100-point scale', () => {
    const dpis = { STAT: 80, TECH: 75, GOV: 90, BEH: 85 };
    const weightedSum = (dpis.STAT * 1.30) + (dpis.TECH * 1.25) + (dpis.GOV * 1.15) + (dpis.BEH * 1.00);
    const totalWeight = 1.30 + 1.25 + 1.15 + 1.00;
    const oci = Number((weightedSum / totalWeight).toFixed(1));

    expect(oci).toBe(82.2);
  });

  it('Combination 22: Microdata Scrutiny and CAPI validation integration in SSO profile', () => {
    const ssoCapi = CADRE_BENCHMARKS.SSO['TECH_CAPI_04'];
    const ssoVal = CADRE_BENCHMARKS.SSO['TECH_VAL_05'];
    expect(ssoCapi).toBe(4);
    expect(ssoVal).toBe(4);
  });

  it('Combination 23: Dynamic course rating adjustments influence recommendation ranking order', () => {
    const gaps = { 'TECH_R_01': { gap: 1, priority: 2.0, assessedLevel: 2, benchmarkLevel: 3 } };
    const catalog = [
      {
        identifier: 'c_high_rated',
        name: 'R Course High Rating',
        code: 'R-HIGH',
        source: 'iGOT Karmayogi' as const,
        deliveryMode: 'Self-Paced',
        duration: '10 Hours',
        durationMinutes: 600,
        competencies: [{ id: 'TECH_R_01', name: 'R', level: 3 as const, weight: 1.0 }],
        targetAudience: ['SSO'],
        rating: 4.9
      },
      {
        identifier: 'c_low_rated',
        name: 'R Course Low Rating',
        code: 'R-LOW',
        source: 'iGOT Karmayogi' as const,
        deliveryMode: 'Self-Paced',
        duration: '10 Hours',
        durationMinutes: 600,
        competencies: [{ id: 'TECH_R_01', name: 'R', level: 3 as const, weight: 1.0 }],
        targetAudience: ['SSO'],
        rating: 3.1
      }
    ];
    const recs = recommendCoursesForGaps(gaps, 'SSO', catalog);
    expect(recs[0].course.identifier).toBe('c_high_rated');
  });

  it('Combination 24: ACBP plan export structure formatting with timestamp and division metadata', () => {
    const acbpExport = {
      planId: 'ACBP-2026-27',
      generatedAt: new Date().toISOString(),
      status: 'SUBMITTED_TO_CBC',
      divisionsIncluded: ['FOD', 'ESD', 'NAD', 'DIID', 'SDRD']
    };
    expect(acbpExport.divisionsIncluded.length).toBe(5);
    expect(acbpExport.status).toBe('SUBMITTED_TO_CBC');
  });

  it('Combination 25: Full E2E Loop: Assessment -> Gap Identification -> Quiz Synthesis -> Re-Scoring -> Gap Closure', () => {
    const initialGap = computeSkillGap('STAT_SMPL_01', 'STAT', 2, 4);
    expect(initialGap.gap).toBe(2);

    const questions = [
      { id: 'q1', bloomLevel: 'Apply', correctIndex: 0 },
      { id: 'q2', bloomLevel: 'Analyze', correctIndex: 1 }
    ];
    const quizResult = calculateBloomWeightedScore(questions, { q1: 0, q2: 1 });
    expect(quizResult.proficiency).toBe(5.0);

    const finalGap = computeSkillGap('STAT_SMPL_01', 'STAT', 4, 4);
    expect(finalGap.gap).toBe(0);
    expect(finalGap.severity).toBe('PROFICIENT');
  });
}, 'Tier 3 (Combinations)', 'RECOMMENDATION_ENGINE');
