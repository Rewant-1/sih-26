import { describe, it, expect } from '../runner';
import {
  calculateSkillGaps,
  computeSkillGap as computeEngineSkillGap,
  DOMAIN_WEIGHTS as ENGINE_DOMAIN_WEIGHTS,
  CADRE_CRITICALITY as ENGINE_CADRE_CRITICALITY,
  getDomainFromCompetencyId,
  getCompetencyName,
} from '../../src/lib/engine/gap-engine';
import type { CadreBenchmark, CadreId } from '../../src/lib/types';
import cadreBenchmarksJson from '../../src/lib/data/cadre-benchmarks.json';

// Re-export constants and helper for other test suites (Tier 1-4)
export const DOMAIN_WEIGHTS: Record<string, number> = {
  'Statistical Competencies': 1.30,
  'Technical Competencies': 1.25,
  'Digital Governance & Data Stewardship': 1.15,
  'Behavioural & Managerial Competencies': 1.00,
  // Short codes
  'STAT': 1.30,
  'TECH': 1.25,
  'GOV': 1.15,
  'BEH': 1.00
};

export const CADRE_CRITICALITY = (benchmarkLevel: number): number => {
  if (benchmarkLevel >= 4) return 1.25;
  if (benchmarkLevel === 3) return 1.00;
  return 0.85;
};

// Benchmark fixtures
export const CADRE_BENCHMARKS = {
  ISS_AD: {
    'STAT_SMPL_01': 4, 'STAT_NAT_02': 4, 'STAT_IDX_03': 4, 'STAT_ASI_04': 4,
    'STAT_PRB_05': 4, 'STAT_TSA_06': 4, 'STAT_DMO_07': 4, 'STAT_ENV_08': 3,
    'TECH_R_01': 4, 'TECH_PY_02': 3, 'TECH_SQL_03': 4, 'TECH_CAPI_04': 3,
    'TECH_VAL_05': 4, 'TECH_SDMX_06': 3, 'TECH_GIS_07': 3,
    'GOV_DQAF_01': 4, 'GOV_SDC_02': 4, 'GOV_META_03': 4, 'GOV_ETH_04': 4,
    'GOV_OGD_05': 4, 'GOV_SEC_06': 4, 'GOV_AUD_07': 4,
    'BEH_FLD_01': 3, 'BEH_STK_02': 4, 'BEH_POL_03': 4, 'BEH_PRJ_04': 3,
    'BEH_COM_05': 4, 'BEH_ETH_06': 5, 'BEH_INQ_07': 4
  },
  SSO: {
    'STAT_SMPL_01': 3, 'STAT_NAT_02': 3, 'STAT_IDX_03': 3, 'STAT_ASI_04': 4,
    'STAT_PRB_05': 3, 'STAT_TSA_06': 2, 'STAT_DMO_07': 3, 'STAT_ENV_08': 2,
    'TECH_R_01': 3, 'TECH_PY_02': 2, 'TECH_SQL_03': 3, 'TECH_CAPI_04': 4,
    'TECH_VAL_05': 4, 'TECH_SDMX_06': 2, 'TECH_GIS_07': 2,
    'GOV_DQAF_01': 4, 'GOV_SDC_02': 3, 'GOV_META_03': 3, 'GOV_ETH_04': 4,
    'GOV_OGD_05': 3, 'GOV_SEC_06': 3, 'GOV_AUD_07': 3,
    'BEH_FLD_01': 4, 'BEH_STK_02': 3, 'BEH_POL_03': 2, 'BEH_PRJ_04': 2,
    'BEH_COM_05': 3, 'BEH_ETH_06': 4, 'BEH_INQ_07': 3
  },
  JSO: {
    'STAT_SMPL_01': 2, 'STAT_NAT_02': 2, 'STAT_IDX_03': 2, 'STAT_ASI_04': 3,
    'STAT_PRB_05': 2, 'STAT_TSA_06': 1, 'STAT_DMO_07': 3, 'STAT_ENV_08': 1,
    'TECH_R_01': 2, 'TECH_PY_02': 1, 'TECH_SQL_03': 2, 'TECH_CAPI_04': 4,
    'TECH_VAL_05': 3, 'TECH_SDMX_06': 1, 'TECH_GIS_07': 2,
    'GOV_DQAF_01': 3, 'GOV_SDC_02': 2, 'GOV_META_03': 2, 'GOV_ETH_04': 3,
    'GOV_OGD_05': 2, 'GOV_SEC_06': 3, 'GOV_AUD_07': 2,
    'BEH_FLD_01': 3, 'BEH_STK_02': 2, 'BEH_POL_03': 1, 'BEH_PRJ_04': 2,
    'BEH_COM_05': 2, 'BEH_ETH_06': 4, 'BEH_INQ_07': 3
  }
};

export function computeSkillGap(
  competencyId: string,
  domain: string,
  assessedLevel: number,
  benchmarkLevel: number
) {
  const delta = assessedLevel - benchmarkLevel;
  const gap = Math.max(0, benchmarkLevel - assessedLevel);
  const domainWeight = DOMAIN_WEIGHTS[domain] || 1.0;
  const cadreCrit = CADRE_CRITICALITY(benchmarkLevel);
  const priorityScore = Number((gap * domainWeight * cadreCrit).toFixed(3));

  let severity: 'CRITICAL' | 'MODERATE' | 'PROFICIENT' | 'SURPLUS';
  if (gap >= 2 || priorityScore >= 2.50) {
    severity = 'CRITICAL';
  } else if (gap === 1) {
    severity = 'MODERATE';
  } else if (gap === 0 && delta === 0) {
    severity = 'PROFICIENT';
  } else {
    severity = 'SURPLUS';
  }

  let suggestedAction = 'Maintain proficiency via peer mentoring and knowledge sharing';
  if (severity === 'CRITICAL') {
    suggestedAction = 'Mandatory enrollment in NSSTA residential workshop / iGOT priority course';
  } else if (severity === 'MODERATE') {
    suggestedAction = 'Recommended self-paced learning via iGOT Karmayogi module';
  }

  return {
    competencyId,
    assessedLevel,
    benchmarkLevel,
    delta,
    gap,
    priorityScore,
    severity,
    suggestedAction
  };
}

describe('FRAC Skill Gap Calculation Engine (Unit)', () => {
  it('calculates exact positive delta when assessed level exceeds benchmark (Surplus)', () => {
    const res = computeEngineSkillGap('TECH_R_01', 'TECH', 5, 3);
    expect(res.rawDelta).toBe(2);
    expect(res.gap).toBe(0);
    expect(res.priorityScore).toBe(0);
    expect(res.severity).toBe('SURPLUS');
  });

  it('calculates exact zero delta and zero gap when assessed level meets benchmark (Proficient)', () => {
    const res = computeEngineSkillGap('STAT_NAT_02', 'STAT', 4, 4);
    expect(res.rawDelta).toBe(0);
    expect(res.gap).toBe(0);
    expect(res.priorityScore).toBe(0);
    expect(res.severity).toBe('PROFICIENT');
  });

  it('calculates 1-level gap with Moderate severity when priority score < 2.50', () => {
    const res = computeEngineSkillGap('BEH_POL_03', 'BEH', 3, 4);
    expect(res.gap).toBe(1);
    expect(res.priorityScore).toBe(1.25);
    expect(res.severity).toBe('MODERATE');
    expect(res.suggestedAction).toContain('Recommended self-paced learning');
  });

  it('calculates 2-level gap with Critical severity regardless of priority score', () => {
    const res = computeEngineSkillGap('STAT_SMPL_01', 'STAT', 2, 4);
    expect(res.gap).toBe(2);
    expect(res.priorityScore).toBe(3.25);
    expect(res.severity).toBe('CRITICAL');
    expect(res.suggestedAction).toContain('Mandatory enrollment in NSSTA');
  });

  it('applies statistical domain weight of 1.30 correctly', () => {
    const res = computeEngineSkillGap('STAT_IDX_03', 'STAT', 2, 3);
    expect(res.priorityScore).toBe(1.3);
  });

  it('applies technical domain weight of 1.25 correctly', () => {
    const res = computeEngineSkillGap('TECH_VAL_05', 'TECH', 3, 4);
    expect(res.priorityScore).toBe(1.563);
  });

  it('applies digital governance domain weight of 1.15 correctly', () => {
    const res = computeEngineSkillGap('GOV_SDC_02', 'GOV', 3, 4);
    expect(res.priorityScore).toBe(1.438);
  });

  it('applies cadre criticality multiplier 0.85 for low-benchmark skills (Benchmark <= 2)', () => {
    const res = computeEngineSkillGap('BEH_PRJ_04', 'BEH', 1, 2);
    expect(res.priorityScore).toBe(0.85);
  });

  it('applies cadre criticality multiplier 1.00 for benchmark level 3', () => {
    const crit = ENGINE_CADRE_CRITICALITY(3);
    expect(crit).toBe(1.0);
  });

  it('applies cadre criticality multiplier 1.25 for benchmark level >= 4', () => {
    const crit = ENGINE_CADRE_CRITICALITY(4);
    const crit5 = ENGINE_CADRE_CRITICALITY(5);
    expect(crit).toBe(1.25);
    expect(crit5).toBe(1.25);
  });

  it('evaluates complete 29-competency gap profile for ISS Assistant Director', () => {
    const assessedRatings: Record<string, number> = {
      'STAT_SMPL_01': 3, 'STAT_NAT_02': 2, 'STAT_IDX_03': 4, 'STAT_ASI_04': 4,
      'STAT_PRB_05': 3, 'STAT_TSA_06': 3, 'STAT_DMO_07': 4, 'STAT_ENV_08': 3,
      'TECH_R_01': 2, 'TECH_PY_02': 3, 'TECH_SQL_03': 3, 'TECH_CAPI_04': 3,
      'TECH_VAL_05': 3, 'TECH_SDMX_06': 2, 'TECH_GIS_07': 3,
      'GOV_DQAF_01': 4, 'GOV_SDC_02': 2, 'GOV_META_03': 3, 'GOV_ETH_04': 4,
      'GOV_OGD_05': 4, 'GOV_SEC_06': 4, 'GOV_AUD_07': 3,
      'BEH_FLD_01': 3, 'BEH_STK_02': 4, 'BEH_POL_03': 3, 'BEH_PRJ_04': 3,
      'BEH_COM_05': 3, 'BEH_ETH_06': 4, 'BEH_INQ_07': 4
    };

    const benchmarkObj = cadreBenchmarksJson.ISS_ASSISTANT_DIRECTOR as unknown as CadreBenchmark;
    const result = calculateSkillGaps(assessedRatings, 'ISS_ASSISTANT_DIRECTOR', benchmarkObj, 'test-user');

    expect(result.gaps.length).toBe(29);
    expect(result.criticalGapsCount).toBeGreaterThanOrEqual(3);
    expect(result.overallCompetencyIndex).toBeGreaterThan(0);
    expect(result.overallCompetencyIndex).toBeLessThanOrEqual(100);
  });

  it('computes 100% OCI and zero gaps for perfect scores (assessed = 5 across all skills)', () => {
    const perfectRatings: Record<string, number> = {};
    const benchmarkObj = cadreBenchmarksJson.ISS_ASSISTANT_DIRECTOR as unknown as CadreBenchmark;
    for (const compId of Object.keys(benchmarkObj.benchmarks)) {
      perfectRatings[compId] = 5;
    }

    const result = calculateSkillGaps(perfectRatings, 'ISS_ASSISTANT_DIRECTOR', benchmarkObj, 'perfect-user');

    expect(result.criticalGapsCount).toBe(0);
    expect(result.moderateGapsCount).toBe(0);
    expect(result.surplusCount).toBeGreaterThan(0);
    expect(result.overallCompetencyIndex).toBeGreaterThanOrEqual(100);
  });

  it('computes maximum critical gaps for beginner scores (assessed = 1 across all skills)', () => {
    const minRatings: Record<string, number> = {};
    const benchmarkObj = cadreBenchmarksJson.ISS_ASSISTANT_DIRECTOR as unknown as CadreBenchmark;
    for (const compId of Object.keys(benchmarkObj.benchmarks)) {
      minRatings[compId] = 1;
    }

    const result = calculateSkillGaps(minRatings, 'ISS_ASSISTANT_DIRECTOR', benchmarkObj, 'beginner-user');

    expect(result.criticalGapsCount).toBeGreaterThan(15);
    expect(result.overallCompetencyIndex).toBeLessThan(50);
  });

  it('computes Senior Statistical Officer (SSO) gaps correctly', () => {
    const ssoRatings = {
      'TECH_CAPI_04': 4, // Target: 4 -> Met
      'STAT_ASI_04': 4,  // Target: 4 -> Met
      'STAT_SMPL_01': 2, // Target: 3 -> Gap 1
      'BEH_FLD_01': 2,   // Target: 4 -> Gap 2 (Critical)
    };

    const benchmarkObj = cadreBenchmarksJson.SENIOR_STATISTICAL_OFFICER as unknown as CadreBenchmark;
    const result = calculateSkillGaps(ssoRatings, 'SENIOR_STATISTICAL_OFFICER', benchmarkObj, 'sso-user');

    const capiGap = result.gaps.find(g => g.competencyId === 'TECH_CAPI_04');
    expect(capiGap?.severity).toBe('PROFICIENT');

    const fldGap = result.gaps.find(g => g.competencyId === 'BEH_FLD_01');
    expect(fldGap?.severity).toBe('CRITICAL');
  });

  it('computes Junior Statistical Officer (JSO) gaps correctly', () => {
    const jsoRatings = {
      'TECH_CAPI_04': 4, // Target: 4 -> Met
      'STAT_SMPL_01': 1, // Target: 2 -> Gap 1
      'BEH_FLD_01': 3,   // Target: 3 -> Met
    };

    const benchmarkObj = cadreBenchmarksJson.JUNIOR_STATISTICAL_OFFICER as unknown as CadreBenchmark;
    const result = calculateSkillGaps(jsoRatings, 'JUNIOR_STATISTICAL_OFFICER', benchmarkObj, 'jso-user');

    expect(result.cadre).toBe('JUNIOR_STATISTICAL_OFFICER');
    expect(result.domainScores['Statistical Competencies']).toBeDefined();
    expect(result.domainScores['Technical Competencies']).toBeDefined();
  });

  it('resolves domain from competency ID prefix correctly', () => {
    expect(getDomainFromCompetencyId('STAT_SMPL_01')).toBe('Statistical Competencies');
    expect(getDomainFromCompetencyId('TECH_R_01')).toBe('Technical Competencies');
    expect(getDomainFromCompetencyId('GOV_DQAF_01')).toBe('Digital Governance & Data Stewardship');
    expect(getDomainFromCompetencyId('BEH_FLD_01')).toBe('Behavioural & Managerial Competencies');
  });

  it('resolves competency name from ID correctly', () => {
    const name = getCompetencyName('STAT_SMPL_01');
    expect(name).toBe('Sampling Design & Survey Methodology');
  });
}, 'Unit', 'GAP_CALCULATION');
