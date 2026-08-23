import React from "react";
import { notFound } from "next/navigation";
import { repository } from "../../../lib/storage/repository";
import { QuizRunner } from "../../../components/quiz/QuizRunner";
import { BookOpen, ArrowLeft } from "lucide-react";

interface QuizRunnerPageProps {
  params: {
    id: string;
  };
}

export default async function QuizRunnerPage({ params }: QuizRunnerPageProps) {
  const { id } = params;
  const quiz = await repository.getQuizById(id);

  if (!quiz) {
    return (
      <main className="min-h-screen bg-slate-100/70 py-12 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Quiz Not Found</h2>
          <p className="text-sm text-slate-600">
            The assessment ID <code className="text-rose-600 font-mono">{id}</code> could not be
            found in the repository.
          </p>
          <div className="pt-2">
            <a
              href="/quiz-studio"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Quiz Studio</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <a
            href="/quiz-studio"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Quiz Studio</span>
          </a>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
            Session ID: {id}
          </span>
        </div>

        {/* Quiz Runner */}
        <QuizRunner
          quiz={quiz}
          userId="usr-jso-rajesh"
          userCadre="JUNIOR_STATISTICAL_OFFICER"
        />
      </div>
    </main>
  );
}
