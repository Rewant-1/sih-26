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
