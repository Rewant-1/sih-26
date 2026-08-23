import { NextRequest, NextResponse } from "next/server";
import { generateQuizWithGemini } from "../../../../lib/ai/gemini-client";
import { repository } from "../../../../lib/storage/repository";
import type { CompetencyDomain, QuizGenerationOptions } from "../../../../lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      content,
      fileName = "MoSPI_Document.txt",
      numQuestions = 5,
      difficulty = "medium",
      targetDomain,
      forceOffline = false,
    } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Document content is required for quiz generation." },
        { status: 400 }
      );
    }

    const options: QuizGenerationOptions = {
      numQuestions: typeof numQuestions === "number" ? numQuestions : 5,
      difficulty,
      targetDomain: targetDomain as CompetencyDomain | undefined,
      forceOffline: Boolean(forceOffline),
    };

    const quiz = await generateQuizWithGemini(content, fileName, options);

    // Persist generated quiz to storage
    await repository.saveQuiz(quiz);

    return NextResponse.json({
      success: true,
      quiz,
      source: quiz.generatorSource,
      message: `Quiz successfully generated with ${quiz.questions.length} questions via ${quiz.generatorSource}`,
    });
  } catch (error: any) {
    console.error("Error in /api/quiz/generate:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
