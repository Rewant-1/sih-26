export type CompetencyDomain =
  | "Statistical Competencies"
  | "Technical Competencies"
  | "Digital Governance & Data Stewardship"
  | "Behavioural & Managerial Competencies";

export type DomainCode = "STAT" | "TECH" | "GOV" | "BEH";

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export type ProficiencyLabel =
  | "Basic"
  | "Novice"
  | "Proficient"
  | "Advanced"
  | "Expert";

export interface RubricDescriptor {
  level: ProficiencyLevel;
  label: ProficiencyLabel;
  description: string;
  behavioralIndicators?: string[];
}

export interface Competency {
  id: string;
  code: string;
  name: string;
  domain: CompetencyDomain;
  domainCode: DomainCode;
  description: string;
  rubrics: RubricDescriptor[];
  officialDivisionFocus?: string[];
}

export type CadreId =
  | "ISS_ASSISTANT_DIRECTOR"
  | "SENIOR_STATISTICAL_OFFICER"
  | "JUNIOR_STATISTICAL_OFFICER";

export interface CadreBenchmark {
  cadreId: CadreId;
  cadreName: string;
  classification: string;
  description: string;
  benchmarks: Record<string, ProficiencyLevel>; // Competency ID -> Level 1..5
  domainWeights: Record<CompetencyDomain, number>;
}

export type GapSeverity = "CRITICAL" | "MODERATE" | "PROFICIENT" | "SURPLUS";

export interface SkillGap {
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  assessedLevel: number;
  benchmarkLevel: number;
  gap: number; // max(0, benchmarkLevel - assessedLevel)
  rawDelta: number; // assessedLevel - benchmarkLevel
  priorityScore: number; // gap * domainWeight * cadreCriticality
  severity: GapSeverity;
  suggestedAction: string;
}

export interface AssessmentResult {
  userId: string;
  cadre: CadreId;
  assessmentDate: string;
  domainScores: Record<CompetencyDomain, number>; // Domain Proficiency Index (0-100%)
  overallCompetencyIndex: number; // Weighted composite 0-100%
  gaps: SkillGap[];
  criticalGapsCount: number;
  moderateGapsCount: number;
  proficientCount: number;
  surplusCount: number;
}
