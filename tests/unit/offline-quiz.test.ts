import { describe, it, expect } from '../runner';

export interface ExtractedFact {
  type: 'definition' | 'acronym' | 'numerical_threshold';
  term: string;
  definition: string;
  contextSentence: string;
}

export class OfflineFactExtractor {
  private static ACRONYM_REGEX = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,5})\s*\(([A-Z]{2,6})\)|([A-Z]{2,6})\s*\(([^)]+)\)/g;
  private static DEFINITION_REGEX = /([A-Z][a-zA-Z\s]{2,35})\s+(?:is defined as|refers to|means|shall be taken as|denotes)\s+([^.\n;]+[.])/gi;

  public static extractFacts(text: string): ExtractedFact[] {
    const facts: ExtractedFact[] = [];
    let match: RegExpExecArray | null;

    while ((match = this.ACRONYM_REGEX.exec(text)) !== null) {
      const fullTerm = match[1] || match[4];
      const acronym = match[2] || match[3];
      if (fullTerm && acronym && fullTerm.length > 3) {
        facts.push({
          type: 'acronym',
          term: acronym.trim(),
          definition: fullTerm.trim(),
          contextSentence: match[0]
        });
      }
    }

    while ((match = this.DEFINITION_REGEX.exec(text)) !== null) {
      const term = match[1].trim();
      const definition = match[2].trim();
      if (term.length > 2 && definition.length > 10) {
        facts.push({
          type: 'definition',
          term: term,
          definition: definition,
          contextSentence: match[0]
        });
      }
    }

    return facts;
  }
}

export class DistractorSynthesizer {
  private static STATISTICAL_ANTONYM_MAP: Record<string, string[]> = {
    'First Stage Unit (FSU)': ['Second Stage Unit (SSU)', 'Ultimate Stage Unit (USU)', 'Enumeration Block (EB)'],
    'Laspeyres Price Index': ['Paasche Price Index', 'Fisher Ideal Index', 'Tornqvist Index'],
    'Gross Value Added (GVA)': ['Net Value Added (NVA)', 'Gross Domestic Product (GDP)', 'Intermediate Consumption'],
    'Consumer Price Index (CPI)': ['Wholesale Price Index (WPI)', 'Producer Price Index (PPI)', 'GDP Deflator']
  };

  public static generateDistractorsForTerm(term: string): string[] {
    const known = this.STATISTICAL_ANTONYM_MAP[term];
    if (known && known.length >= 3) return known.slice(0, 3);
    return [
      `The supervisory quality indicator for ${term}`,
      `The unweighted variance threshold for ${term}`,
      `The secondary sampling frame for ${term}`
    ];
  }
}

export const BLOOM_WEIGHTS: Record<string, number> = {
  'Remember': 1.0,
  'Understand': 1.25,
  'Apply': 1.5,
  'Analyze': 1.75,
  'Evaluate': 2.0,
  'Create': 2.25
};

export interface SeedQuestion {
  id: string;
  domain: string;
  competencyId: string;
  competencyName: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  bloomLevel: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  referencePassage: string;
  keywords: string[];
}

export const MOSPI_SEED_QUESTION_BANK: SeedQuestion[] = [
  {
    id: 'seed-stat-001',
    domain: 'Statistical Competencies',
    competencyId: 'STAT_SMPL_01',
    competencyName: 'Sampling Design & Survey Methodology',
    question: 'In NSS multi-stage stratified sampling design, what is the formula for calculating the sampling multiplier for an FSU when selection is PPSWR?',
    options: [
      'Multiplier = Z / (n * Z_i), where Z is stratum total size and Z_i is FSU size',
      'Multiplier = (n * Z_i) / Z, where Z is stratum total size',
      'Multiplier = N / n, simple inverse of selection probability without size weights',
      'Multiplier = (N * n) / (Z_i * H), accounting for household count H'
    ],
    correctIndex: 0,
    bloomLevel: 'Understand',
    difficulty: 'medium',
    explanation: 'Under Probability Proportional to Size with Replacement (PPSWR), the selection probability of i-th FSU is p_i = Z_i / Z. For n selected FSUs, the design weight/multiplier is 1 / (n * p_i) = Z / (n * Z_i).',
    referencePassage: 'For PPSWR sampling of FSUs, the sampling weight (multiplier) in the estimation formula is given by M_i = Z / (n_s * Z_si).',
    keywords: ['nss', 'sampling', 'multiplier', 'fsu', 'ppswr', 'stratum', 'estimation']
  },
  {
    id: 'seed-stat-002',
    domain: 'Statistical Competencies',
    competencyId: 'STAT_IDX_03',
    competencyName: 'Index Numbers & Price Statistics',
    question: 'Which formula is officially utilized by MoSPI to compute the Consumer Price Index (CPI Base 2012=100) at the subgroup and group levels?',
    options: [
      'Modified Laspeyres price index formula with base-period expenditure weights',
      'Paasche price index formula utilizing current-period consumption quantities',
      'Fisher\'s Ideal Geometric Mean index formula',
      'Carli simple unweighted arithmetic mean of price relatives'
    ],
    correctIndex: 0,
    bloomLevel: 'Remember',
    difficulty: 'easy',
    explanation: 'MoSPI\'s CPI uses the Modified Laspeyres formula, aggregating elementary price relatives with fixed base-period consumption expenditure weights from the Consumer Expenditure Survey (CES 2011-12).',
    referencePassage: 'The all-India and state-level CPI indices are compiled using the Modified Laspeyres Index formula using the weighting diagram derived from the Consumer Expenditure Survey 2011-12.',
    keywords: ['cpi', 'consumer price index', 'laspeyres', 'base year', 'price relatives', 'weights']
  },
  {
    id: 'seed-stat-003',
    domain: 'Statistical Competencies',
    competencyId: 'STAT_NAT_02',
    competencyName: 'National Accounts Statistics & SUT Compilation',
    question: 'Under the SNA 2008 framework adopted in India\'s National Accounts (2011-12 base), how is Gross Value Added (GVA) at Basic Prices derived from GVA at Factor Cost?',
    options: [
      'GVA at Basic Prices = GVA at Factor Cost + (Production Taxes - Production Subsidies)',
      'GVA at Basic Prices = GVA at Factor Cost + (Product Taxes - Product Subsidies)',
      'GVA at Basic Prices = GVA at Factor Cost - Consumption of Fixed Capital (CFC)',
      'GVA at Basic Prices = Gross Output - Intermediate Consumption + Net Import Tariffs'
    ],
    correctIndex: 0,
    bloomLevel: 'Analyze',
    difficulty: 'hard',
    explanation: 'GVA at basic prices includes net production taxes (taxes on production such as land revenue minus subsidies).',
    referencePassage: 'GVA at basic prices = GVA at factor cost + (Production Taxes - Production Subsidies).',
    keywords: ['gva', 'national accounts', 'sna', 'basic price', 'factor cost', 'taxes', 'subsidies']
  },
  {
    id: 'seed-tech-001',
    domain: 'Technical Competencies',
    competencyId: 'TECH_R_01',
    competencyName: 'Statistical Computing with R for Official Stats',
    question: 'When processing large-scale survey unit-level microdata in R, what statistical procedure is mandatory before generating population aggregates?',
    options: [
      'Applying the appropriate survey sample weights (Multipliers) to each unit record',
      'Replacing all missing values with column mean imputation',
      'Normalizing all quantitative variables to a standard normal z-score',
      'Dropping all strata that contain fewer than 5 sample units'
    ],
    correctIndex: 0,
    bloomLevel: 'Apply',
    difficulty: 'medium',
    explanation: 'Survey microdata from complex multi-stage designs are unweighted by default. To obtain unbiased population totals, each record must be multiplied by its assigned multiplier.',
    referencePassage: 'To derive aggregate national estimates from NSS unit-level microdata, the weight variable (multiplier) must be applied to every individual record during tabulation.',
    keywords: ['microdata', 'r', 'python', 'multiplier', 'weights', 'tabulation', 'estimation']
  },
  {
    id: 'seed-gov-001',
    domain: 'Digital Governance & Data Stewardship',
    competencyId: 'GOV_SDMX_06',
    competencyName: 'Statistical Data and Metadata eXchange (SDMX)',
    question: 'Under the Statistical Data and Metadata eXchange (SDMX) framework adopted by MoSPI, what is the purpose of a Data Structure Definition (DSD)?',
    options: [
      'It defines the dimensions, attributes, and measures that structure a multidimensional statistical dataset',
      'It provides the encryption key for transferring classified microdata between departments',
      'It acts as a relational database schema for PostgreSQL servers',
      'It logs the IP address and access credentials of API users'
    ],
    correctIndex: 0,
    bloomLevel: 'Understand',
    difficulty: 'medium',
    explanation: 'In SDMX, a Data Structure Definition (DSD) formalizes how data keys are composed, specifying Dimensions, Attributes, and Measures.',
    referencePassage: 'The SDMX Data Structure Definition (DSD) specifies the concept scheme, code lists, dimensions, and attributes required to interpret statistical time series data.',
    keywords: ['sdmx', 'metadata', 'governance', 'dsd', 'dimensions', 'data stewardship']
  },
  {
    id: 'seed-mgt-001',
    domain: 'Behavioural & Managerial Competencies',
    competencyId: 'BEH_FLD_01',
    competencyName: 'Field Survey Team Management & Supervision',
    question: 'During field survey scrutiny, if an SSO (Senior Statistical Officer) discovers that a household has migrated permanently and cannot be contacted, what is the prescribed protocol?',
    options: [
      'Record the casualty status in the schedule and select a substitute household strictly following the random substitution table in the manual',
      'Arbitrarily replace the household with the immediate neighboring household',
      'Omit the sample record and re-weight the remaining sample households post-facto',
      'Leave the schedule blank and submit it as complete'
    ],
    correctIndex: 0,
    bloomLevel: 'Apply',
    difficulty: 'medium',
    explanation: 'Official survey protocols prohibit informal ad-hoc substitution. If a casualty occurs, it must be officially coded, and substitution must be performed using the predefined alternate random selection sequence.',
    referencePassage: 'In case a selected sample household cannot be canvassed due to permanent migration or refusal, substitution shall be made strictly in order of selection from the standby sample frame.',
    keywords: ['supervision', 'field staff', 'substitution', 'scrutiny', 'casualty', 'sso', 'jso']
  }
];

export function calculateBloomWeightedScore(
  questions: Array<{ id: string; bloomLevel: string; correctIndex: number }>,
  answers: Record<string, number>
) {
  let earned = 0;
  let possible = 0;
  let correctCount = 0;

  for (const q of questions) {
    const weight = BLOOM_WEIGHTS[q.bloomLevel] || 1.0;
    possible += weight;
    if (answers[q.id] === q.correctIndex) {
      earned += weight;
      correctCount++;
    }
  }

  const rawPercent = (correctCount / questions.length) * 100;
  const weightedPercent = (earned / (possible || 1)) * 100;
  const proficiency = 1.0 + (earned / (possible || 1)) * 4.0;

  return {
    correctCount,
    totalQuestions: questions.length,
    rawPercent: Number(rawPercent.toFixed(1)),
    weightedPercent: Number(weightedPercent.toFixed(1)),
    proficiency: Number(proficiency.toFixed(2))
  };
}

describe('Offline Quiz Fallback & Scoring Engine (Unit)', () => {
  it('extracts acronyms and full statistical forms deterministically', () => {
    const text = 'In rural surveys, the First Stage Unit (FSU) and Ultimate Stage Unit (USU) are enumerated.';
    const facts = OfflineFactExtractor.extractFacts(text);
    
    const fsuFact = facts.find(f => f.term === 'FSU');
    expect(fsuFact).toBeDefined();
    expect(fsuFact?.definition).toBe('First Stage Unit');
  });

  it('synthesizes plausible statistical distractors without hallucinating nonsense', () => {
    const distractors = DistractorSynthesizer.generateDistractorsForTerm('Laspeyres Price Index');
    expect(distractors).toHaveLength(3);
    expect(distractors).toContain('Paasche Price Index');
    expect(distractors).toContain('Fisher Ideal Index');
  });

  it('computes 100% score and 5.0 proficiency when all questions are answered correctly', () => {
    const sampleQuestions = [
      { id: 'q1', bloomLevel: 'Remember', correctIndex: 0 },
      { id: 'q2', bloomLevel: 'Apply', correctIndex: 1 },
      { id: 'q3', bloomLevel: 'Analyze', correctIndex: 2 }
    ];
    const answers = { q1: 0, q2: 1, q3: 2 };

    const score = calculateBloomWeightedScore(sampleQuestions, answers);
    expect(score.correctCount).toBe(3);
    expect(score.rawPercent).toBe(100.0);
    expect(score.weightedPercent).toBe(100.0);
    expect(score.proficiency).toBe(5.0);
  });

  it('computes 0% score and 1.0 baseline proficiency when zero questions are correct', () => {
    const sampleQuestions = [
      { id: 'q1', bloomLevel: 'Remember', correctIndex: 0 },
      { id: 'q2', bloomLevel: 'Apply', correctIndex: 1 }
    ];
    const answers = { q1: 3, q2: 0 };

    const score = calculateBloomWeightedScore(sampleQuestions, answers);
    expect(score.correctCount).toBe(0);
    expect(score.rawPercent).toBe(0.0);
    expect(score.proficiency).toBe(1.0);
  });

  it('gives higher score weight to higher-order Bloom levels (e.g. Analyze vs Remember)', () => {
    const qRemember = { id: 'qR', bloomLevel: 'Remember', correctIndex: 0 };
    const qAnalyze = { id: 'qA', bloomLevel: 'Analyze', correctIndex: 1 };
    const questions = [qRemember, qAnalyze];

    const score1 = calculateBloomWeightedScore(questions, { qR: 0, qA: 0 });
    const score2 = calculateBloomWeightedScore(questions, { qR: 1, qA: 1 });

    expect(score1.rawPercent).toBe(50.0);
    expect(score2.rawPercent).toBe(50.0);
    expect(score2.weightedPercent).toBeGreaterThan(score1.weightedPercent);
    expect(score2.proficiency).toBeGreaterThan(score1.proficiency);
  });
}, 'Unit', 'OFFLINE_FALLBACK');
