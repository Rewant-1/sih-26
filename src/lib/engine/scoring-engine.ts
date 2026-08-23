import type {
  BloomLevel,
  CadreId,
  CompetencyDomain,
  CompetencyScore,
  QuestionReviewDetail,
  Quiz,
  QuizAttempt,
  ScoringResult,
} from "../types";

export const BLOOM_WEIGHTS: Record<BloomLevel | string, number> = {
  Remember: 1.0,
  Understand: 1.25,
  Apply: 1.5,
  Analyze: 1.75,
  Evaluate: 2.0,
  Create: 2.25,
};

/**
 * Calculates raw and Bloom-weighted assessment scores.
 */
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

  const rawPercent = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  const weightedPercent = possible > 0 ? (earned / possible) * 100 : 0;
  const proficiency = possible > 0 ? 1.0 + (earned / possible) * 4.0 : 1.0;

  return {
    correctCount,
    totalQuestions: questions.length,
    rawPercent: Number(rawPercent.toFixed(1)),
    weightedPercent: Number(weightedPercent.toFixed(1)),
    proficiency: Number(proficiency.toFixed(2)),
  };
}

/**
 * Evaluates a complete quiz attempt with competency breakdown and pedagogical reviews.
 */
export function evaluateQuizAttempt(
  quiz: Quiz,
  userAnswers: Record<string, number>,
  timeSpentMap: Record<string, number> = {}
): ScoringResult {
  let earnedWeightTotal = 0;
  let possibleWeightTotal = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const competencyMap: Record<
    string,
    {
      competencyId: string;
      competencyName: string;
      domain: CompetencyDomain;
      earnedWeight: number;
      possibleWeight: number;
      totalQuestions: number;
      correctQuestions: number;
    }
  > = {};

  const questionReviews: QuestionReviewDetail[] = [];

  for (const q of quiz.questions) {
    const userSelected = userAnswers[q.id] !== undefined ? userAnswers[q.id] : null;
    const isCorrect = userSelected === q.correctIndex;
    const weight = BLOOM_WEIGHTS[q.bloomLevel] || 1.0;

    possibleWeightTotal += weight;

    if (userSelected === null || userSelected === undefined) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
      earnedWeightTotal += weight;
    } else {
      incorrectCount++;
    }

    // Accumulate competency-level metrics
    const compId = q.competencyId || "STAT_SMPL_01";
    if (!competencyMap[compId]) {
      competencyMap[compId] = {
        competencyId: compId,
        competencyName: q.competencyName || compId,
        domain: quiz.detectedDomain || "Statistical Competencies",
        earnedWeight: 0,
        possibleWeight: 0,
        totalQuestions: 0,
        correctQuestions: 0,
      };
    }

    competencyMap[compId].totalQuestions++;
    competencyMap[compId].possibleWeight += weight;
    if (isCorrect) {
      competencyMap[compId].correctQuestions++;
      competencyMap[compId].earnedWeight += weight;
    }

    questionReviews.push({
      questionId: q.id,
      question: q.question,
      options: q.options,
      userSelectedIndex: userSelected,
      correctIndex: q.correctIndex,
      isCorrect,
      bloomLevel: q.bloomLevel,
      difficulty: q.difficulty,
      competencyId: q.competencyId,
      timeSpentSeconds: timeSpentMap[q.id] || 0,
      explanation: q.explanation,
      referencePassage: q.referencePassage,
    });
  }

  const rawScorePercentage =
    quiz.questions.length > 0
      ? Number(((correctCount / quiz.questions.length) * 100).toFixed(1))
      : 0;

  const weightedScorePercentage =
    possibleWeightTotal > 0
      ? Number(((earnedWeightTotal / possibleWeightTotal) * 100).toFixed(1))
      : 0;

  const totalTimeSpentSeconds = Object.values(timeSpentMap).reduce((a, b) => a + b, 0);
  const averageTimePerQuestionSeconds =
    quiz.questions.length > 0
      ? Math.round(totalTimeSpentSeconds / quiz.questions.length)
      : 0;

  // Build Competency Breakdown
  const competencyBreakdown: Record<string, CompetencyScore> = {};

  for (const [compId, data] of Object.entries(competencyMap)) {
    const compWeighted =
      data.possibleWeight > 0 ? (data.earnedWeight / data.possibleWeight) * 100 : 0;
    const assessedProficiencyLevel =
      data.possibleWeight > 0
        ? Number((1.0 + (data.earnedWeight / data.possibleWeight) * 4.0).toFixed(2))
        : 1.0;

    let status: "Proficient" | "Developing" | "Needs_Training" = "Needs_Training";
    if (assessedProficiencyLevel >= 3.5) {
      status = "Proficient";
    } else if (assessedProficiencyLevel >= 2.5) {
      status = "Developing";
    }

    competencyBreakdown[compId] = {
      competencyId: compId,
      competencyName: data.competencyName,
      domain: data.domain,
      totalQuestions: data.totalQuestions,
      correctQuestions: data.correctQuestions,
      weightedScore: Number(compWeighted.toFixed(1)),
      assessedProficiencyLevel,
      status,
    };
  }

  return {
    totalQuestions: quiz.questions.length,
    correctCount,
    incorrectCount,
    unansweredCount,
    rawScorePercentage,
    weightedScorePercentage,
    totalTimeSpentSeconds,
    averageTimePerQuestionSeconds,
    competencyBreakdown,
    questionReviews,
  };
}

/**
 * Creates and persists a completed QuizAttempt record.
 */
export function createQuizAttempt(
  quiz: Quiz,
  userId: string,
  userCadre: CadreId,
  userAnswers: Record<string, number>,
  markedForReview: Record<string, boolean> = {},
  timeSpentMap: Record<string, number> = {},
  startedAt?: string
): QuizAttempt {
  const scoringResult = evaluateQuizAttempt(quiz, userAnswers, timeSpentMap);
  const completedAt = new Date().toISOString();

  return {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    userId,
    userCadre,
    startedAt: startedAt || new Date(Date.now() - scoringResult.totalTimeSpentSeconds * 1000).toISOString(),
    completedAt,
    timeSpentSeconds: scoringResult.totalTimeSpentSeconds,
    rawScorePercentage: scoringResult.rawScorePercentage,
    weightedScorePercentage: scoringResult.weightedScorePercentage,
    scoringResult,
    userAnswers,
    markedForReview,
  };
}
