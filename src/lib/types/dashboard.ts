import type { CadreId, CompetencyDomain, GapSeverity } from "./frac";
import type { CourseSource } from "./sunbird";

export type DivisionCode = "FOD" | "ESD" | "NAD" | "DIID" | "SDRD";

export interface DivisionDeficientCompetency {
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  averageScore: number;
  benchmark: number;
  gap: number;
}

export interface DivisionAggregateMetric {
  divisionCode: DivisionCode;
  divisionName: string;
  totalOfficers: number;
  cadreBreakdown: Record<CadreId, number>;
  domainAverages: Record<CompetencyDomain, number>; // 1.0 to 5.0 scale
  overallProficiency: number; // 0 to 100%
  criticalGapsCount: number;
  topDeficientCompetencies: DivisionDeficientCompetency[];
}

export interface ACBPBatchPlan {
  batchId: string;
  courseId: string;
  courseTitle: string;
  source: CourseSource;
  targetDomain: CompetencyDomain;
  targetCompetencyId: string;
  targetCompetencyName: string;
  cadreTarget: CadreId[];
  recommendedOfficersCount: number;
  targetDivisions: string[];
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  estimatedHours: number;
  scheduleWindow?: string;
}

export interface ACBPPlan {
  year: string; // e.g. "2026-27"
  title: string;
  totalOfficersTargeted: number;
  totalBatches: number;
  batches: ACBPBatchPlan[];
  generatedAt: string;
  summaryByDivision: Record<string, number>;
  summaryByDomain: Record<CompetencyDomain, number>;
}
