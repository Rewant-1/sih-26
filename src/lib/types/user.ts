import type { AssessmentResult, CadreId } from "./frac";

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  cadre: CadreId;
  division: string;
  email: string;
  avatarUrl?: string;
  lastAssessmentDate?: string;
  currentAssessmentId?: string;
  assessedRatings?: Record<string, number>; // Competency ID -> Level 1..5
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  quizHistoryIds?: string[];
}

export interface AssessmentRecord {
  assessmentId: string;
  userId: string;
  cadre: CadreId;
  division: string;
  timestamp: string;
  ratings: Record<string, number>; // Raw ratings per competency
  result: AssessmentResult;
}
