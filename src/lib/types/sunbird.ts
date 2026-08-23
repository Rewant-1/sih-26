import type { CadreId, CompetencyDomain, ProficiencyLevel } from "./frac";

export type CourseSource = "iGOT Karmayogi" | "NSSTA TPAC";

export type DeliveryMode =
  | "Self-Paced e-Learning"
  | "Blended"
  | "Instructor-Led Classroom (NSSTA Greater Noida)"
  | "Virtual Synchronous Workshop";

export interface CompetencyMapping {
  id: string; // e.g. "STAT_NAT_02"
  name: string; // e.g. "National Accounts Statistics & SUT Compilation"
  competencyArea: CompetencyDomain;
  level: ProficiencyLevel; // Level delivered upon course completion
  weight: number; // Relevance weight 0.1 - 1.0
}

export interface CourseModule {
  moduleId: string;
  title: string;
  durationMinutes: number;
  learningOutcomes: string[];
}

export interface NSSTATPACMetadata {
  calendarYear: string; // e.g. "2026-27"
  batchSchedule: string; // e.g. "May 18-22, 2026"
  venue: string; // e.g. "NSSTA Campus, Greater Noida, UP"
  courseDirector: string; // e.g. "Additional Director General, NSSTA"
  nominationDeadline: string; // e.g. "2026-04-30"
  targetParticipantsLimit: number;
}

export interface SunbirdCBCourse {
  identifier: string; // e.g. "do_igot_stat_001", "do_nssta_tpac_2026_01"
  name: string; // Official Course Title
  code: string; // Unique Course Code
  description: string;
  framework: string; // "MoSPI-FRAC-2026"
  organisation: string; // "National Statistical Systems Training Academy (NSSTA)", "iGOT Karmayogi Bharat", etc.
  source: CourseSource;
  deliveryMode: DeliveryMode;
  duration: string; // e.g. "12 Hours", "5 Days Residential"
  durationMinutes: number;
  competencies: CompetencyMapping[];
  learningOutcomes: string[];
  targetAudience: CadreId[];
  prerequisites?: string[];
  modules?: CourseModule[];
  rating: number; // 1.0 to 5.0
  enrolledCount: number;
  certificationAvailable: boolean;
  thumbnailUrl?: string;
  tpacMetadata?: NSSTATPACMetadata; // Populated for NSSTA TPAC courses
}

export interface CourseFilter {
  domain?: CompetencyDomain;
  source?: CourseSource;
  cadre?: CadreId;
  search?: string;
  level?: ProficiencyLevel;
  competencyId?: string;
}

export interface MatchedCompetencyDetail {
  competencyId: string;
  competencyName: string;
  courseTargetLevel: number;
  userCurrentLevel: number;
  benchmarkLevel: number;
  gapCovered: number;
}

export interface CourseRecommendation {
  course: SunbirdCBCourse;
  targetCompetencyId: string;
  targetCompetencyName: string;
  relevanceScore: number; // 0-100
  cadreMatch: boolean;
  estimatedEffortHours: number;
  sourceBadge: CourseSource;
  recommendationReason: string;
  matchedCompetencies?: MatchedCompetencyDetail[];
  recommendationScore?: number;
  primaryCompetencyCovered?: string;
  deliveryMode?: string;
  estimatedDuration?: string;
}
