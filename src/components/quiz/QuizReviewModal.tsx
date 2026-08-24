"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import type { Quiz, ScoringResult } from "@/lib/types";

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
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const {
    rawScorePercentage,
    weightedScorePercentage,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalTimeSpentSeconds,
    competencyBreakdown,
    questionReviews,
  } = scoringResult;

  const filteredReviews = questionReviews.filter((rev) => {
    if (filter === "correct") return rev.isCorrect;
    if (filter === "incorrect") return !rev.isCorrect;
    return true;
  });

  const minutes = Math.floor(totalTimeSpentSeconds / 60);
  const seconds = totalTimeSpentSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;

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
    <div className="bg-white rounded-2xl shadow-md border border-[#C7C2BA] overflow-hidden max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Summary (Light Theme) */}
      <div className="bg-[#FAF9F6] border-b border-[#C7C2BA] p-6 text-[#142446]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#142446] border border-[#C7C2BA] mb-2">
              <FileCheck2 className="w-3.5 h-3.5 mr-1 text-[#D8921E]" />
              Assessment Completed
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#142446]">
              {quiz.title}
            </h2>
            <p className="text-[#475A6F] text-xs sm:text-sm mt-1">
              Source Document: {quiz.sourceDocumentName} · {quiz.detectedDomain}
            </p>
          </div>

          {/* Large Score Metric */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-[#C7C2BA]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#142446]">
                {weightedScorePercentage}%
              </div>
              <div className="text-[10px] text-[#475A6F] font-bold uppercase tracking-wider">
                Bloom-Weighted Score
              </div>
            </div>

            <div className="w-px h-10 bg-[#C7C2BA]/60" />

            <div className="text-center">
              <div className="text-3xl font-bold text-[#142446]">
                {avgProficiency}
                <span className="text-xs text-[#475A6F] font-normal"> / 5.0</span>
              </div>
              <div className="text-[10px] text-[#475A6F] font-bold uppercase tracking-wider">
                Assessed Level
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#C7C2BA]/40">
          <div className="bg-white p-3 rounded-lg border border-[#C7C2BA]">
            <span className="text-xs text-[#475A6F]">Raw Correct</span>
            <div className="text-base font-bold text-[#142446]">
              {correctCount} / {totalQuestions} ({rawScorePercentage}%)
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-[#C7C2BA]">
            <span className="text-xs text-[#475A6F]">Incorrect / Skipped</span>
            <div className="text-base font-bold text-[#142446]">
              {incorrectCount} / {unansweredCount}
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-[#C7C2BA]">
            <span className="text-xs text-[#475A6F]">Time Taken</span>
            <div className="text-base font-bold text-[#142446] flex items-center space-x-1">
              <Clock className="w-4 h-4 text-[#D8921E] mr-1" />
              <span>{timeFormatted}</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-[#C7C2BA]">
            <span className="text-xs text-[#475A6F]">Generator Engine</span>
            <div className="text-xs font-bold text-[#142446] mt-1 truncate">
              {quiz.generatorSource === "GEMINI_AI" ? "Gemini AI" : "Offline Synthesis"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Competency Level Evaluation Breakdown */}
        <div>
          <div className="flex items-center space-x-2 text-[#142446] font-bold text-base mb-4">
            <TrendingUp className="w-4 h-4 text-[#D8921E]" />
            <span>FRAC Competency Proficiency Mapping</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(competencyBreakdown).map((comp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#C7C2BA] bg-[#FAF9F6] space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#475A6F]">
                      {comp.competencyId}
                    </span>
                    <h4 className="font-bold text-[#142446] text-sm">
                      {comp.competencyName}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-white text-[#142446] border border-[#C7C2BA]">
                    {comp.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#475A6F] pt-1">
                  <span>
                    Correct: {comp.correctQuestions} / {comp.totalQuestions}
                  </span>
                  <span className="font-semibold text-[#142446]">
                    Level: {comp.assessedProficiencyLevel} / 5.0 ({comp.weightedScore}%)
                  </span>
                </div>

                <div className="w-full bg-white border border-[#C7C2BA]/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#142446] h-full rounded-full"
                    style={{ width: `${comp.weightedScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-2 border-b border-[#C7C2BA]">
            <div className="flex items-center space-x-2 text-[#142446] font-bold text-base">
              <BookOpen className="w-4 h-4 text-[#D8921E]" />
              <span>Pedagogical Review & Citations</span>
            </div>

            <div className="flex space-x-1.5">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  filter === "all"
                    ? "bg-[#142446] text-white border-[#142446]"
                    : "bg-white text-[#475A6F] border-[#C7C2BA] hover:bg-[#FAF9F6]"
                }`}
              >
                All ({questionReviews.length})
              </button>
              <button
                onClick={() => setFilter("correct")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  filter === "correct"
                    ? "bg-[#142446] text-white border-[#142446]"
                    : "bg-white text-[#475A6F] border-[#C7C2BA] hover:bg-[#FAF9F6]"
                }`}
              >
                Correct ({correctCount})
              </button>
              <button
                onClick={() => setFilter("incorrect")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  filter === "incorrect"
                    ? "bg-[#142446] text-white border-[#142446]"
                    : "bg-white text-[#475A6F] border-[#C7C2BA] hover:bg-[#FAF9F6]"
                }`}
              >
                Incorrect / Skipped ({incorrectCount + unansweredCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((rev, idx) => {
              const optionLetters = ["A", "B", "C", "D", "E", "F"];

              return (
                <div
                  key={rev.questionId}
                  className={`p-5 rounded-xl border transition-colors ${
                    rev.isCorrect
                      ? "border-[#C7C2BA] bg-white"
                      : "border-[#C7C2BA] bg-[#FAF9F6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#142446] text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#475A6F]">
                        Bloom: {rev.bloomLevel} · Difficulty: {rev.difficulty}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        rev.isCorrect
                          ? "bg-[#F3E7D1] text-[#142446] border-[#C7C2BA]"
                          : "bg-white text-[#142446] border-[#C7C2BA]"
                      }`}
                    >
                      {rev.isCorrect ? "Correct" : "Incorrect / Needs Review"}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#142446] mb-3">
                    {rev.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {rev.options.map((opt, oIdx) => {
                      const isUserChoice = rev.userSelectedIndex === oIdx;
                      const isCorrectChoice = rev.correctIndex === oIdx;

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-xs font-medium ${
                            isCorrectChoice
                              ? "bg-[#F3E7D1] border-[#C7C2BA] text-[#142446]"
                              : isUserChoice
                              ? "bg-white border-[#142446] text-[#142446]"
                              : "bg-white border-[#C7C2BA]/60 text-[#475A6F]"
                          }`}
                        >
                          <span className="font-bold mr-1.5">{optionLetters[oIdx]}.</span>
                          <span>{opt}</span>
                          {isCorrectChoice && (
                            <span className="ml-1 text-[10px] font-bold text-[#142446]">
                              (Correct)
                            </span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="ml-1 text-[10px] font-bold text-[#142446]">
                              (Your Answer)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-2 border-t border-[#C7C2BA]/40">
                    <button
                      onClick={() => toggleExplanation(rev.questionId)}
                      className="text-xs font-bold text-[#142446] hover:text-[#D8921E] flex items-center space-x-1"
                    >
                      <span>
                        {expandedExplanations[rev.questionId]
                          ? "Hide Explanation & Source"
                          : "View Official Explanation & Reference"}
                      </span>
                      {expandedExplanations[rev.questionId] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {expandedExplanations[rev.questionId] && (
                      <div className="mt-2.5 p-3 rounded-lg bg-white border border-[#C7C2BA] space-y-1.5 text-xs text-[#475A6F]">
                        <p className="font-medium text-[#142446]">
                          {rev.explanation}
                        </p>
                        {rev.referencePassage && (
                          <div className="pt-1 border-t border-[#C7C2BA]/40 font-mono text-[11px] text-[#475A6F]">
                            Source Excerpt: &ldquo;{rev.referencePassage}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-6 border-t border-[#C7C2BA] flex items-center justify-between">
          <button
            onClick={onRetake}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-[#C7C2BA] bg-white text-[#142446] text-xs font-semibold hover:bg-[#FAF9F6]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>

          <button
            onClick={onExit}
            className="px-6 py-2.5 rounded-lg bg-[#142446] hover:bg-[#1e3460] text-white text-xs font-bold"
          >
            Done / Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
}
