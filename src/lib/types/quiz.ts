import type { CadreId, CompetencyDomain } from "./frac";

export type BloomLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type GeneratorSource = "GEMINI_AI" | "OFFLINE_FALLBACK" | "HYBRID";

export type DocumentType = "PDF" | "DOCX" | "TEXT_PASTE";

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string] | string[];
  correctIndex: number; // 0..3
  bloomLevel: BloomLevel;
  difficulty: QuestionDifficulty;
  competencyId: string;
  competencyName: string;
  explanation: string;
  referencePassage: string;
  keywords?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  sourceDocumentName: string;
  sourceDocumentType: DocumentType;
  detectedDomain: CompetencyDomain;
  generatorSource: GeneratorSource;
  createdAt: string; // ISO 8601
  totalQuestions: number;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface QuestionReviewDetail {
  questionId: string;
  question: string;
  options: string[];
  userSelectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  bloomLevel: BloomLevel;
  difficulty: QuestionDifficulty;
  competencyId: string;
  timeSpentSeconds: number;
  explanation: string;
  referencePassage: string;
}

export interface CompetencyScore {
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  totalQuestions: number;
  correctQuestions: number;
  weightedScore: number; // 0-100%
  assessedProficiencyLevel: number; // 1.0 to 5.0 continuous scale
  status: "Proficient" | "Developing" | "Needs_Training";
}

export interface ScoringResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  rawScorePercentage: number;
  weightedScorePercentage: number;
  totalTimeSpentSeconds: number;
  averageTimePerQuestionSeconds: number;
  competencyBreakdown: Record<string, CompetencyScore>;
  questionReviews: QuestionReviewDetail[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userCadre: CadreId;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
  rawScorePercentage: number;
  weightedScorePercentage: number;
  scoringResult: ScoringResult;
  userAnswers: Record<string, number>; // questionId -> selectedIndex
  markedForReview: Record<string, boolean>; // questionId -> boolean
}

export interface QuizGenerationOptions {
  numQuestions?: number;
  difficulty?: "all" | QuestionDifficulty;
  targetDomain?: CompetencyDomain;
  forceOffline?: boolean;
}
