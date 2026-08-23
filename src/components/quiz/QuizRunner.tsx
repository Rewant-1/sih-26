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
  Sparkles,
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

      // Accumulate time spent on current question
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

  const handleToggleFlag = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestionId]: !prev[currentQuestionId],
    }));
  };

  const handleClearSelection = () => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestionId];
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Call submit API
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          userId,
          userCadre,
          answers: userAnswers,
          timeSpentMap,
          markedForReview,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.scoringResult) {
          setScoringResult(data.scoringResult);
          if (onFinish) onFinish(data.scoringResult);
          setIsSubmitting(false);
          return;
        }
      }

      // Local fallback evaluation
      const localResult = evaluateQuizAttempt(quiz, userAnswers, timeSpentMap);
      setScoringResult(localResult);
      if (onFinish) onFinish(localResult);
    } catch (err) {
      console.error("Submission failed, evaluating locally:", err);
      const localResult = evaluateQuizAttempt(quiz, userAnswers, timeSpentMap);
      setScoringResult(localResult);
      if (onFinish) onFinish(localResult);
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>{quiz.detectedDomain}</span>
              <span>•</span>
              <span>{quiz.generatorSource === "GEMINI_AI" ? "Gemini AI" : "Offline Synthesis"}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{quiz.title}</h1>
          </div>

          {/* Timer Display */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono font-bold text-lg transition-colors ${
              isTimeCritical
                ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <Clock className="w-5 h-5 text-slate-500" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Progress Bar & Stat Indicator */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>
              Progress: {answeredCount} of {totalCount} answered ({progressPercent}%)
            </span>
            <span className="text-amber-600 font-bold">
              {Object.values(markedForReview).filter(Boolean).length} flagged
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Submit Quiz</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === totalCount - 1}
            className="flex items-center space-x-1 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Question Index Grid */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Question Navigator
          </div>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = markedForReview[q.id];

              let btnClasses = "border-slate-200 bg-white text-slate-700 hover:border-slate-300";
              if (isCurrent) {
                btnClasses = "border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-300";
              } else if (isFlagged) {
                btnClasses = "border-amber-400 bg-amber-50 text-amber-900 font-bold";
              } else if (isAnswered) {
                btnClasses = "border-emerald-400 bg-emerald-50 text-emerald-900 font-medium";
              }

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all relative flex items-center justify-center ${btnClasses}`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Confirm Submission</h3>
            </div>

            <p className="text-sm text-slate-600">
              You have answered <strong className="text-slate-900">{answeredCount}</strong> out of{" "}
              <strong className="text-slate-900">{totalCount}</strong> questions.
              {answeredCount < totalCount && (
                <span className="block text-rose-600 mt-1 font-medium">
                  Warning: {totalCount - answeredCount} questions are still unanswered.
                </span>
              )}
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold"
              >
                Continue Assessment
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-md"
              >
                {isSubmitting ? "Scoring..." : "Yes, Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
