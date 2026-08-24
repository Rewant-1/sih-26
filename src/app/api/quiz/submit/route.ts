import { NextRequest, NextResponse } from "next/server";
import { repository } from "../../../../lib/storage/repository";
import { createQuizAttempt, evaluateQuizAttempt } from "../../../../lib/engine/scoring-engine";
import type { CadreId } from "../../../../lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      quizId,
      userId = "usr-jso-rajesh",
      userCadre = "JUNIOR_STATISTICAL_OFFICER" as CadreId,
      answers = {},
      timeSpentMap = {},
      markedForReview = {},
      startedAt,
    } = body;

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "quizId is required." },
        { status: 400 }
      );
    }

    const quiz = await repository.getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: `Quiz not found with ID: ${quizId}` },
        { status: 404 }
      );
    }

    const attempt = createQuizAttempt(
      quiz,
      userId,
      userCadre,
      answers,
      markedForReview,
      timeSpentMap,
      startedAt
    );

    if (repository.saveQuizAttempt) {
      await repository.saveQuizAttempt(attempt);
    }

    // Closed-loop: update user competency profile with quiz-derived proficiency
    if (attempt.scoringResult?.competencyBreakdown) {
      const user = await repository.getUserProfile(userId);
      if (user) {
        const ratings = { ...(user.assessedRatings || {}) };
        for (const [compId, score] of Object.entries(attempt.scoringResult.competencyBreakdown)) {
          const quizLevel = Math.round(score.assessedProficiencyLevel);
          const existing = ratings[compId] ?? 0;
          // Weighted blend: 40% quiz evidence + 60% prior self-assessment (or quiz-only if no prior)
          ratings[compId] = existing > 0
            ? Math.round((existing * 0.6 + quizLevel * 0.4) * 10) / 10
            : quizLevel;
        }
        user.assessedRatings = ratings;
        if (!user.quizHistoryIds) user.quizHistoryIds = [];
        user.quizHistoryIds.push(attempt.id);
        await repository.saveUserProfile(user);
      }
    }

    return NextResponse.json({
      success: true,
      attempt,
      scoringResult: attempt.scoringResult,
    });
  } catch (error: any) {
    console.error("Error in /api/quiz/submit:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit quiz attempt." },
      { status: 500 }
    );
  }
}
