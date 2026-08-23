"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Clock,
  BookOpen,
  Layers,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Quote,
  TrendingUp,
} from "lucide-react";
import type { Quiz, ScoringResult } from "../../lib/types";

interface QuizReviewModalProps {
  quiz: Quiz;
  scoringResult: ScoringResult;
  onRetake: () => void;
  onExit: () => void;
}

export function QuizReviewModal({
  quiz,
  scoringResult,
  onRetake,
  onExit,
}: QuizReviewModalProps) {
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  const {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    rawScorePercentage,
    weightedScorePercentage,
    totalTimeSpentSeconds,
    competencyBreakdown,
    questionReviews,
  } = scoringResult;

  const filteredReviews = questionReviews.filter((q) => {
    if (filter === "correct") return q.isCorrect;
    if (filter === "incorrect") return !q.isCorrect;
    return true;
  });

  const minutes = Math.floor(totalTimeSpentSeconds / 60);
  const seconds = totalTimeSpentSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  // Compute overall continuous proficiency rating across all tested competencies
  const compScores = Object.values(competencyBreakdown);
  const avgProficiency =
    compScores.length > 0
      ? Number(
          (
            compScores.reduce((acc, c) => acc + c.assessedProficiencyLevel, 0) /
            compScores.length
          ).toFixed(2)
        )
      : Number((1.0 + (weightedScorePercentage / 100) * 4.0).toFixed(2));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Assessment Completed
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {quiz.title}
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Source Document: {quiz.sourceDocumentName} • {quiz.detectedDomain}
            </p>
          </div>

          {/* Large Score Metric */}
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-amber-400">
                {weightedScorePercentage}%
              </div>
              <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                Bloom-Weighted Score
              </div>
            </div>

            <div className="w-px h-10 bg-white/20" />

            <div className="text-center">
              <div className="text-3xl font-extrabold text-emerald-400">
                {avgProficiency}
                <span className="text-xs text-slate-300 font-normal"> / 5.0</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                Assessed Level
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400">Raw Correct</span>
            <div className="text-lg font-bold text-white">
              {correctCount} / {totalQuestions} ({rawScorePercentage}%)
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400">Incorrect / Skipped</span>
            <div className="text-lg font-bold text-rose-400">
              {incorrectCount} / {unansweredCount}
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400">Time Taken</span>
            <div className="text-lg font-bold text-white flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-400 mr-1" />
              <span>{timeFormatted}</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400">Generator Engine</span>
            <div className="text-xs font-bold text-amber-300 mt-1 truncate">
              {quiz.generatorSource === "GEMINI_AI" ? "Gemini AI" : "Offline Synthesis"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Competency Level Evaluation Breakdown */}
        <div>
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>FRAC Competency Proficiency Mapping</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(competencyBreakdown).map((comp, idx) => {
              const statusColors =
                comp.status === "Proficient"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : comp.status === "Developing"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-rose-50 text-rose-800 border-rose-300";

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-700">
                        {comp.competencyId}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {comp.competencyName}
                      </h4>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${statusColors}`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>
                      Correct: {comp.correctQuestions} / {comp.totalQuestions}
                    </span>
                    <span className="font-semibold text-slate-800">
                      Level: {comp.assessedProficiencyLevel} / 5.0 ({comp.weightedScore}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${comp.weightedScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Pedagogical Review & Citations</span>
            </div>

            <div className="flex space-x-1.5">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  filter === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                All ({questionReviews.length})
              </button>
              <button
                onClick={() => setFilter("correct")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  filter === "correct"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                Correct ({correctCount})
              </button>
              <button
                onClick={() => setFilter("incorrect")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  filter === "incorrect"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                Incorrect / Skipped ({incorrectCount + unansweredCount})
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredReviews.map((rev, idx) => {
              const optionLetters = ["A", "B", "C", "D", "E", "F"];

              return (
                <div
                  key={rev.questionId || idx}
                  className={`p-6 rounded-xl border-2 space-y-4 ${
                    rev.isCorrect
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-rose-200 bg-rose-50/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      {rev.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                      <span className="font-bold text-slate-900 text-sm">
                        Question #{idx + 1}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                        {rev.bloomLevel}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {rev.competencyId}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-slate-900">
                    {rev.question}
                  </h4>

                  {/* Options with correctness highlights */}
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {rev.options.map((optText, optIdx) => {
                      const isUserChoice = rev.userSelectedIndex === optIdx;
                      const isAnswerKey = rev.correctIndex === optIdx;

                      let optStyle = "border-slate-200 bg-white text-slate-700";
                      if (isAnswerKey) {
                        optStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                      } else if (isUserChoice && !rev.isCorrect) {
                        optStyle = "border-rose-500 bg-rose-50 text-rose-900 line-through";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-start space-x-2.5 p-3 rounded-lg border text-sm ${optStyle}`}
                        >
                          <span className="font-bold">{optionLetters[optIdx]}.</span>
                          <span className="flex-grow">{optText}</span>
                          {isAnswerKey && (
                            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                              Correct Key
                            </span>
                          )}
                          {isUserChoice && !isAnswerKey && (
                            <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1.5 shadow-sm">
                    <span className="font-bold text-blue-900 flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Pedagogical Rationale:
                    </span>
                    <p className="leading-relaxed">{rev.explanation}</p>
                  </div>

                  {/* Reference Passage / Verbatim Quote */}
                  {rev.referencePassage && (
                    <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200 text-xs text-blue-950 flex items-start space-x-2">
                      <Quote className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Official Document Excerpt: </span>
                        <span className="italic">{rev.referencePassage}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>

          <button
            onClick={onExit}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>Return to Quiz Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
