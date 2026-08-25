"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Flag,
  AlertCircle,
  Award,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import type { Quiz, ScoringResult } from "../../lib/types";
import { QuestionCard } from "./QuestionCard";
import { QuizReviewModal } from "./QuizReviewModal";
import { evaluateQuizAttempt } from "../../lib/engine/scoring-engine";

interface QuizRunnerProps {
  quiz: Quiz;
  userId?: string;
  userCadre?: string;
  onFinish?: (scoringResult: ScoringResult) => void;
}

export function QuizRunner({
  quiz,
  userId = "usr-jso-rajesh",
  userCadre = "JUNIOR_STATISTICAL_OFFICER",
  onFinish,
}: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(
    Math.max(120, (quiz.timeLimitMinutes || 10) * 60)
  );
  const [timeSpentMap, setTimeSpentMap] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestionId = quiz.questions[currentIndex]?.id || `q-${currentIndex}`;

  // Real-time countdown timer & per-question time tracking
  useEffect(() => {
    if (scoringResult) return; // Stopped if quiz is completed

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // Increment time spent on active question
      setTimeSpentMap((prev) => ({
        ...prev,
        [currentQuestionId]: (prev[currentQuestionId] || 0) + 1,
      }));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionId, scoringResult]);

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: optionIndex,
    }));
  };

  const handleClearSelection = () => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestionId];
      return next;
    });
  };

  const handleToggleFlag = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestionId]: !prev[currentQuestionId],
    }));
  };

  const handleAutoSubmit = async () => {
    await performSubmission();
  };

  const performSubmission = async () => {
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalAllocatedSecs = (quiz.timeLimitMinutes || 10) * 60;
    const timeTaken = Math.max(1, totalAllocatedSecs - timeRemaining);

    try {
      const evalResult = evaluateQuizAttempt(
        quiz,
        userAnswers,
        timeSpentMap
      );

      // Attempt to save to API
      try {
        await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            quizId: quiz.id,
            userCadre,
            answers: userAnswers,
            timeSpentMap,
            timeTakenSeconds: timeTaken,
            scoringResult: evalResult,
          }),
        });
      } catch (err) {
        console.warn("Could not save to submission backend API:", err);
      }

      setScoringResult(evalResult);
      if (onFinish) onFinish(evalResult);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemaining(Math.max(120, (quiz.timeLimitMinutes || 10) * 60));
    setTimeSpentMap({});
    setCurrentIndex(0);
    setScoringResult(null);
  };

  // If completed, render review modal
  if (scoringResult) {
    return (
      <QuizReviewModal
        quiz={quiz}
        scoringResult={scoringResult}
        onRetake={handleRetake}
        onExit={() => {
          window.location.href = "/quiz-studio";
        }}
      />
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = quiz.questions.length;
  const progressPercent = Math.round((answeredCount / totalCount) * 100);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const isTimeCritical = timeRemaining < 120; // less than 2 mins

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card with Timer and Progress */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#C7C2BA] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#475A6F] uppercase tracking-wider mb-1">
              <span>{quiz.detectedDomain}</span>
              <span>·</span>
              <span>{quiz.generatorSource === "GEMINI_AI" ? "Gemini AI" : "Offline Synthesis"}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#142446]">{quiz.title}</h1>
          </div>

          {/* Timer Display */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono font-bold text-lg transition-colors ${
              isTimeCritical
                ? "bg-[#FAF9F6] border-[#D8921E] text-[#D8921E]"
                : "bg-[#FAF9F6] border-[#C7C2BA] text-[#142446]"
            }`}
          >
            <Clock className="w-5 h-5 text-[#475A6F]" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Progress Bar & Stat Indicator */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-[#475A6F]">
            <span>
              Progress: {answeredCount} of {totalCount} answered ({progressPercent}%)
            </span>
            <span className="text-[#142446] font-bold">
              {Object.values(markedForReview).filter(Boolean).length} flagged
            </span>
          </div>

          <div className="w-full bg-[#FAF9F6] border border-[#C7C2BA]/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#142446] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card Component */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={totalCount}
          selectedIndex={userAnswers[currentQuestion.id]}
          isFlagged={Boolean(markedForReview[currentQuestion.id])}
          onSelectOption={handleSelectOption}
          onToggleFlag={handleToggleFlag}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Bottom Navigation & Question Grid Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#C7C2BA] p-6 space-y-4">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-[#C7C2BA] bg-white text-[#142446] text-xs font-bold hover:bg-[#FAF9F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < totalCount - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
              className="flex items-center space-x-1.5 px-6 py-2 rounded-lg bg-[#142446] text-white text-xs font-bold hover:bg-[#1e3460] transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center space-x-1.5 px-6 py-2 rounded-lg bg-[#D8921E] text-white text-xs font-bold hover:bg-[#c27f14] shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Assessment</span>
            </button>
          )}
        </div>

        {/* Question Palette / Bubble Jump Strip */}
        <div className="pt-4 border-t border-[#C7C2BA]/40">
          <div className="flex items-center justify-between text-xs text-[#475A6F] mb-3">
            <span className="font-bold text-[#142446]">Question Navigator:</span>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#142446]" />
                <span>Answered</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8921E]" />
                <span>Flagged</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FAF9F6] border border-[#C7C2BA]" />
                <span>Unvisited</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = Boolean(markedForReview[q.id]);
              const isCurrent = currentIndex === idx;

              let style = "bg-white text-[#475A6F] border-[#C7C2BA] hover:bg-[#FAF9F6]";
              if (isFlagged) {
                style = "bg-[#D8921E] text-white border-[#D8921E] font-bold";
              } else if (isAnswered) {
                style = "bg-[#142446] text-white border-[#142446] font-bold";
              }

              if (isCurrent) {
                style += " ring-2 ring-[#142446] ring-offset-1 font-bold";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#142446]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#C7C2BA] space-y-4">
            <div className="flex items-center space-x-3 text-[#142446]">
              <AlertCircle className="w-6 h-6 text-[#D8921E]" />
              <h3 className="text-lg font-bold">Ready to Submit?</h3>
            </div>

            <p className="text-xs text-[#475A6F] leading-relaxed">
              You have answered <span className="font-bold text-[#142446]">{answeredCount}</span> of{" "}
              <span className="font-bold text-[#142446]">{totalCount}</span> questions.{" "}
              {totalCount - answeredCount > 0 && (
                <span className="text-[#D8921E] font-semibold">
                  You have {totalCount - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-[#C7C2BA] text-[#142446] text-xs font-semibold hover:bg-[#FAF9F6]"
              >
                Return to Quiz
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  performSubmission();
                }}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#142446] hover:bg-[#1e3460] text-white text-xs font-bold shadow-xs"
              >
                {isSubmitting ? "Scoring..." : "Yes, Submit Final Answers"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
