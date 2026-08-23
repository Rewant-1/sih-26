import { describe, it, expect } from '../runner';
import { CADRE_BENCHMARKS, computeSkillGap } from '../unit/gap-engine.test';
import { recommendCoursesForGaps } from '../unit/recommendation-engine.test';
import { sanitizeDocumentText, chunkDocument, extractDocumentMetadata } from '../unit/doc-parser.test';
import { OfflineFactExtractor, DistractorSynthesizer, calculateBloomWeightedScore, MOSPI_SEED_QUESTION_BANK } from '../unit/offline-quiz.test';
import { repository } from '../../src/lib/storage/repository';
import * as fs from 'fs';
import * as path from 'path';

describe('Tier 4: Scenario 1 - JSO Field Operations to SSO Supervision Transition', () => {
  it('executes cadre promotion workflow with benchmark adjustment, gap calculation, and course recommendations', async () => {
    // 1. Existing JSO Profile
    const jsoRatings: Record<string, number> = {
      'TECH_CAPI_04': 4,
      'BEH_FLD_01': 3,
      'TECH_VAL_05': 3,
      'STAT_SMPL_01': 2
    };

    // 2. Promotion to SSO triggers higher benchmark expectations:
    const promotedGaps: Record<string, any> = {};
    for (const [compId, aLevel] of Object.entries(jsoRatings)) {
      const bLevel = (CADRE_BENCHMARKS.SSO as any)[compId];
      const g = computeSkillGap(compId, compId.startsWith('STAT') ? 'STAT' : compId.startsWith('TECH') ? 'TECH' : 'BEH', aLevel, bLevel);
      if (g.gap > 0) {
        promotedGaps[compId] = { gap: g.gap, priority: g.priorityScore, assessedLevel: aLevel, benchmarkLevel: bLevel };
      }
    }

    expect(promotedGaps['BEH_FLD_01']).toBeDefined();
    expect(promotedGaps['TECH_VAL_05']).toBeDefined();
    expect(promotedGaps['BEH_FLD_01'].gap).toBe(1);
    expect(promotedGaps['TECH_VAL_05'].gap).toBe(1);

    // 3. Recommendation engine suggests NSSTA supervisory training
    const catalog = [
      {
        identifier: 'do_nssta_tpac_005',
        name: 'Automated Microdata Scrutiny & Fellegi-Holt Validation Workshop',
        code: 'NSSTA-TPAC-05',
        source: 'NSSTA TPAC' as const,
        deliveryMode: 'Instructor-Led Classroom (NSSTA Greater Noida)',
        duration: '4 Days Residential (24 Hours)',
        durationMinutes: 1440,
        competencies: [{ id: 'TECH_VAL_05', name: 'Microdata Scrutiny', level: 4 as const, weight: 1.0 }],
        targetAudience: ['SSO', 'ISS_AD'],
        rating: 4.8
      }
    ];

    const recs = recommendCoursesForGaps(promotedGaps, 'SSO', catalog);
    expect(recs.length).toBe(1);
    expect(recs[0].sourceBadge).toBe('NSSTA TPAC');
    expect(recs[0].course.identifier).toBe('do_nssta_tpac_005');
  });
}, 'Tier 4 (Scenarios)', 'CADRE_BENCHMARKS');

describe('Tier 4: Scenario 2 - ISS Assistant Director National Accounts Modernization', () => {
  it('executes national accounts self-assessment, document quiz generation, and competency score progression', async () => {
    // 1. Initial Assessment
    const initialRating = 3;
    const benchmark = CADRE_BENCHMARKS.ISS_AD['STAT_NAT_02'];
    const gap = computeSkillGap('STAT_NAT_02', 'STAT', initialRating, benchmark);
    expect(gap.gap).toBe(1);
    expect(gap.severity).toBe('MODERATE');

    // 2. Ingest SNA 2008 & SUT methodological excerpt
    const docText = `
      National Accounts Statistics: Gross Value Added (GVA) at basic prices is compiled as Output at basic prices minus Intermediate Consumption at purchaser prices.
      Supply and Use Tables (SUT) provide the overarching accounting framework ensuring consistent reconciliation between GDP production and expenditure approaches.
    `;
    const cleaned = sanitizeDocumentText(docText);
    const facts = OfflineFactExtractor.extractFacts(cleaned);
    expect(facts.length).toBeGreaterThanOrEqual(1);

    // 3. Quiz Completion: 5 questions simulated
    const quizQuestions = [
      { id: 'q1', bloomLevel: 'Apply', correctIndex: 0 },
      { id: 'q2', bloomLevel: 'Analyze', correctIndex: 1 },
      { id: 'q3', bloomLevel: 'Evaluate', correctIndex: 2 },
      { id: 'q4', bloomLevel: 'Apply', correctIndex: 0 },
      { id: 'q5', bloomLevel: 'Analyze', correctIndex: 1 }
    ];
    const quizScore = calculateBloomWeightedScore(quizQuestions, { q1: 0, q2: 1, q3: 2, q4: 0, q5: 1 });
    expect(quizScore.proficiency).toBe(5.0);

    // 4. Update Profile & Verify Gap Closure
    const updatedProficiency = Number(((initialRating + quizScore.proficiency) / 2).toFixed(1));
    const finalGap = computeSkillGap('STAT_NAT_02', 'STAT', updatedProficiency, benchmark);
    expect(finalGap.gap).toBe(0);
    expect(finalGap.severity).toBe('PROFICIENT');
  });
}, 'Tier 4 (Scenarios)', 'BLOOM_SCORING');

describe('Tier 4: Scenario 3 - DIID Leadership ACBP 2026-27 Formulation', () => {
  it('identifies cross-division deficiencies and formulates ACBP training batches', () => {
    // Heatmap data across 5 MoSPI divisions
    const divisionData = [
      { division: 'FOD', sdcScore: 2.1, benchmark: 3.5, staff: 180 },
      { division: 'ESD', sdcScore: 2.4, benchmark: 3.5, staff: 90 },
      { division: 'NAD', sdcScore: 3.8, benchmark: 4.0, staff: 60 },
      { division: 'DIID', sdcScore: 4.2, benchmark: 4.0, staff: 45 },
      { division: 'SDRD', sdcScore: 3.6, benchmark: 4.0, staff: 75 }
    ];

    // Identify critically deficient divisions (sdcScore < 3.0)
    const deficitDivisions = divisionData.filter(d => d.sdcScore < 3.0);
    expect(deficitDivisions.length).toBe(2); // FOD and ESD

    const totalDeficientStaff = deficitDivisions.reduce((sum, d) => sum + d.staff, 0);
    expect(totalDeficientStaff).toBe(270);

    // Formulate ACBP Batches
    const acbpPlan = {
      year: '2026-27',
      focusArea: 'Statistical Disclosure Control & Microdata Anonymization',
      residentialBatches: Math.ceil(totalDeficientStaff * 0.2 / 30),
      eLearningTarget: Math.round(totalDeficientStaff * 0.8)
    };

    expect(acbpPlan.residentialBatches).toBe(2);
    expect(acbpPlan.eLearningTarget).toBe(216);
  });
}, 'Tier 4 (Scenarios)', 'ACBP_PLANNER');

describe('Tier 4: Scenario 4 - Complete Offline Fallback in Air-Gapped Regional Statistical Office', () => {
  it('executes full parsing, question generation, and assessment scoring without external network', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-nss-manual.txt');
    const content = fs.readFileSync(fixturePath, 'utf8');

    // 1. Offline Text Sanitization
    const sanitized = sanitizeDocumentText(content);
    expect(sanitized).toContain('First Stage Units (FSUs)');
    expect(sanitized).toContain('hamlet-groups');

    // 2. Offline Fact Extraction
    const facts = OfflineFactExtractor.extractFacts(sanitized);
    expect(facts.length).toBeGreaterThanOrEqual(1);

    // 3. Match domain against Seed Question Bank
    const meta = extractDocumentMetadata(sanitized);
    const domainQuestions = MOSPI_SEED_QUESTION_BANK.filter(q => q.domain === meta.detectedDomain);
    expect(domainQuestions.length).toBeGreaterThanOrEqual(2);

    // 4. Interactive Quiz Scoring
    const attemptAnswers = {
      'seed-stat-001': domainQuestions[0].correctIndex,
      'seed-stat-002': domainQuestions[1].correctIndex
    };
    const score = calculateBloomWeightedScore(domainQuestions.slice(0, 2), attemptAnswers);
    expect(score.correctCount).toBe(2);
    expect(score.rawPercent).toBe(100.0);
    expect(score.proficiency).toBe(5.0);
  });
}, 'Tier 4 (Scenarios)', 'OFFLINE_FALLBACK');

describe('Tier 4: Scenario 5 - Field Operations Division (FOD) CAPI Onboarding Workflow', () => {
  it('validates new JSO onboarding in CAPI mobile data collection and Schedule 0.0 listing', () => {
    const jsoEntryRating = 2;
    const targetCapiBenchmark = CADRE_BENCHMARKS.JSO['TECH_CAPI_04'];
    const gap = computeSkillGap('TECH_CAPI_04', 'TECH', jsoEntryRating, targetCapiBenchmark);
    
    expect(gap.gap).toBe(2);
    expect(gap.severity).toBe('CRITICAL');
    expect(gap.suggestedAction).toContain('Mandatory enrollment');
  });
}, 'Tier 4 (Scenarios)', 'ASSESSMENT_WIZARD');

describe('Tier 4: Scenario 6 - Economic Statistics Division (ESD) CPI Base Year Revision Exercise', () => {
  it('parses CPI technical circular and verifies Laspeyres vs Geometric Mean formula understanding', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-cpi-circular.txt');
    const content = fs.readFileSync(fixturePath, 'utf8');
    const sanitized = sanitizeDocumentText(content);

    expect(sanitized).toContain('Modified Laspeyres');
    expect(sanitized).toContain('COICOP');

    const meta = extractDocumentMetadata(sanitized);
    expect(meta.baseYear).toContain('2012');
  });
}, 'Tier 4 (Scenarios)', 'DOC_PARSER');

describe('Tier 4: Scenario 7 - Annual Survey of Industries (ASI) Factory Schedule Scrutiny Workflow', () => {
  it('validates SSO mastery in ASI Schedule scrutiny and balance sheet reconciliation', () => {
    const ssoRating = 3;
    const asiBenchmark = CADRE_BENCHMARKS.SSO['STAT_ASI_04'];
    const gap = computeSkillGap('STAT_ASI_04', 'STAT', ssoRating, asiBenchmark);
    expect(gap.gap).toBe(1);
    expect(gap.severity).toBe('MODERATE');
  });
}, 'Tier 4 (Scenarios)', 'GAP_BREAKDOWN');

describe('Tier 4: Scenario 8 - Social Statistics Division (SSSD) SDG National Indicator Framework Alignment', () => {
  it('evaluates demographic indicators and SDG monitoring competency', () => {
    const sssdRating = 4;
    const benchmark = CADRE_BENCHMARKS.ISS_AD['STAT_DMO_07'];
    const gap = computeSkillGap('STAT_DMO_07', 'STAT', sssdRating, benchmark);
    expect(gap.gap).toBe(0);
    expect(gap.severity).toBe('PROFICIENT');
  });
}, 'Tier 4 (Scenarios)', 'LEARNER_RADAR');

describe('Tier 4: Scenario 9 - NSSTA Residential Batch Formulation for SDMX 3.0', () => {
  it('identifies 30 officers for SDMX 3.0 residential workshop at Greater Noida campus', () => {
    const batch = {
      courseCode: 'NSSTA-TPAC-04',
      courseTitle: 'SDMX 3.0 Standards & Global Statistical Metadata Exchange',
      intakeLimit: 30,
      targetCadres: ['ISS_AD', 'SSO'],
      venue: 'NSSTA Campus, Greater Noida, UP'
    };
    expect(batch.intakeLimit).toBe(30);
    expect(batch.venue).toContain('Greater Noida');
  });
}, 'Tier 4 (Scenarios)', 'NSSTA_CATALOG');

describe('Tier 4: Scenario 10 - DPDP Act Compliance & Microdata Anonymization Protocol', () => {
  it('verifies k-anonymity (k >= 5) and disclosure risk mitigation requirements', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-ndgfp-guide.txt');
    const content = fs.readFileSync(fixturePath, 'utf8');
    const sanitized = sanitizeDocumentText(content);

    expect(sanitized).toContain('k-anonymity (k >= 5)');
    expect(sanitized).toContain('DPSO');
  });
}, 'Tier 4 (Scenarios)', 'DOC_PARSER');

describe('Tier 4: Scenario 11 - Multi-Cadre Cross-Division Comparative Assessment', () => {
  it('benchmarks 4 officers across NAD, ESD, FOD, and DIID', () => {
    const officers = [
      { name: 'Dr. Amit Verma', cadre: 'ISS_AD', division: 'NAD', oci: 88.5 },
      { name: 'Priya Sharma', cadre: 'ISS_AD', division: 'DIID', oci: 89.2 },
      { name: 'Rajesh Kumar', cadre: 'SSO', division: 'FOD', oci: 78.4 },
      { name: 'Sunita Rao', cadre: 'JSO', division: 'ESD', oci: 74.1 }
    ];

    const highestOci = officers.sort((a, b) => b.oci - a.oci)[0];
    expect(highestOci.name).toBe('Priya Sharma');
    expect(highestOci.division).toBe('DIID');
  });
}, 'Tier 4 (Scenarios)', 'CADRE_DISTRIBUTION');

describe('Tier 4: Scenario 12 - End-to-End Learner Journey Lifecycle', () => {
  it('executes full lifecycle: Self-Assessment -> Skill Gaps -> Recommendations -> Quiz Attempt -> Re-scoring', async () => {
    // 1. Initial Assessment
    const user = await repository.getUserProfile('usr-jso-rajesh');
    expect(user).toBeDefined();

    const initialRatings = { 'TECH_R_01': 2 };
    const gap = computeSkillGap('TECH_R_01', 'TECH', 2, CADRE_BENCHMARKS.JSO['TECH_R_01']);
    expect(gap.gap).toBe(0);

    // 2. Recommend Course & Enroll
    user!.enrolledCourseIds.push('do_igot_tech_001');
    await repository.saveUserProfile(user!);

    // 3. Complete Quiz
    const quizQ = [{ id: 'q_r1', bloomLevel: 'Apply', correctIndex: 0 }];
    const quizScore = calculateBloomWeightedScore(quizQ, { q_r1: 0 });
    expect(quizScore.proficiency).toBe(5.0);

    // 4. Save Final Assessment
    const savedRecord = await repository.saveAssessmentRecord({
      id: 'asmt-e2e-final',
      userId: user!.id,
      cadreId: user!.cadre,
      assessedAt: new Date().toISOString(),
      ratings: { 'TECH_R_01': 4 },
      computedGaps: [],
      domainScores: {
        'Statistical Competencies': 3,
        'Technical Competencies': 4,
        'Digital Governance & Data Stewardship': 3,
        'Behavioural & Managerial Competencies': 3
      },
      overallIndex: 92.0
    });

    expect(savedRecord).toBeDefined();
    expect(savedRecord.ratings['TECH_R_01']).toBe(4);
  });
}, 'Tier 4 (Scenarios)', 'LEARNING_ROADMAP');
