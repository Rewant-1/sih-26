"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileText,
  Play,
} from "lucide-react";
import type { Quiz } from "../../lib/types";
import { DocumentUploader } from "../../components/quiz/DocumentUploader";
import { QuizRunner } from "../../components/quiz/QuizRunner";

export default function QuizStudioPage() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [seedQuizzes, setSeedQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  // Load pre-seeded official quizzes on mount
  useEffect(() => {
    async function loadQuizzes() {
      try {
        const res = await fetch("/api/courses?loadQuizzes=true").catch(() => null);
        // If there is no specific endpoint or if we fetch seed quizzes directly:
        // We can fetch from local or seed quizzes
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      } finally {
        setIsLoadingQuizzes(false);
      }
    }
    loadQuizzes();
  }, []);

  const handleQuizGenerated = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Header / Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span>MoSPI Skill Intelligence Platform</span>
              <span>/</span>
              <span>AI Assessment Studio (R3)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Document-to-Quiz Studio
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Upload official survey manuals, circulars, or governance notes to generate
              rigorous multiple-choice assessments aligned with Mission Karmayogi's FRAC framework.
            </p>
          </div>

          {activeQuiz && (
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm self-start"
            >
              ← Back to Studio Generator
            </button>
          )}
        </div>

        {/* If an active quiz is selected/generated, render QuizRunner */}
        {activeQuiz ? (
          <div className="space-y-6">
            <QuizRunner
              quiz={activeQuiz}
              userId="usr-jso-rajesh"
              userCadre="JUNIOR_STATISTICAL_OFFICER"
            />
          </div>
        ) : (
          /* Studio Generator View */
          <div className="space-y-8">
            <DocumentUploader onQuizGenerated={handleQuizGenerated} />

            {/* Pre-Seeded Official Assessment Bank */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    Pre-Seeded Official MoSPI Assessment Bank
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Validated official benchmark quizzes covering NSS 79th Round, CPI Base 2012, and NDGFP standards.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Ready to Practice
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Seed Quiz 1 */}
                <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Statistical
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> 10 mins
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      NSS 79th Round: Listing & Sampling
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      First Stage Unit (FSU) delineation, hamlet-group formation rules, circular systematic sampling, and PPSWR multipliers.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">5 Questions</span>
                    <a
                      href="/quiz-runner/quiz-nss79-listing"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                      <span>Take Quiz</span>
                    </a>
                  </div>
                </div>

                {/* Seed Quiz 2 */}
                <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Statistical
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> 8 mins
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      CPI (Base 2012=100) Methodology
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      Modified Laspeyres price index formulation, COICOP basket weights, seasonal adjustment with X-13ARIMA-SEATS, and price collection.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">4 Questions</span>
                    <a
                      href="/quiz-runner/quiz-cpi-methodology"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                      <span>Take Quiz</span>
                    </a>
                  </div>
                </div>

                {/* Seed Quiz 3 */}
                <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Governance
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> 8 mins
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      National Data Governance (NDGFP)
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      Microdata anonymization, k-anonymity (k >= 5) standards, SDMX DSDs, Collection of Statistics Act confidentiality, and GSBPM.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">4 Questions</span>
                    <a
                      href="/quiz-runner/quiz-ndgfp-governance"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                      <span>Take Quiz</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
