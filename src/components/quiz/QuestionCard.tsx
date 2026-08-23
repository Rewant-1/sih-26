"use client";

import React from "react";
import { Flag, Award, BookOpen, Layers, Check } from "lucide-react";
import type { BloomLevel, QuizQuestion } from "../../lib/types";

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedIndex: number | null | undefined;
  isFlagged: boolean;
  onSelectOption: (optionIndex: number) => void;
  onToggleFlag: () => void;
  onClearSelection: () => void;
}

function getBloomBadge(level: BloomLevel | string) {
  switch (level) {
    case "Remember":
      return { label: "Remember (1.0x)", bg: "bg-blue-100 text-blue-800 border-blue-200" };
    case "Understand":
      return { label: "Understand (1.25x)", bg: "bg-cyan-100 text-cyan-800 border-cyan-200" };
    case "Apply":
      return { label: "Apply (1.5x)", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "Analyze":
      return { label: "Analyze (1.75x)", bg: "bg-purple-100 text-purple-800 border-purple-200" };
    case "Evaluate":
      return { label: "Evaluate (2.0x)", bg: "bg-amber-100 text-amber-800 border-amber-200" };
    case "Create":
      return { label: "Create (2.25x)", bg: "bg-rose-100 text-rose-800 border-rose-200" };
    default:
      return { label: level, bg: "bg-slate-100 text-slate-800 border-slate-200" };
  }
}

function getDifficultyBadge(diff: string) {
  switch (diff.toLowerCase()) {
    case "easy":
      return { label: "Easy", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "medium":
      return { label: "Medium", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    case "hard":
      return { label: "Hard", bg: "bg-rose-50 text-rose-700 border-rose-200" };
    default:
      return { label: diff, bg: "bg-slate-50 text-slate-700 border-slate-200" };
  }
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedIndex,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onClearSelection,
}: QuestionCardProps) {
  const bloom = getBloomBadge(question.bloomLevel);
  const diff = getDifficultyBadge(question.difficulty);

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
            Q {questionIndex + 1} of {totalQuestions}
          </span>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bloom.bg}`}
          >
            <Award className="w-3 h-3 mr-1" />
            {bloom.label}
          </span>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${diff.bg}`}
          >
            {diff.label}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleFlag}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isFlagged
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? "fill-current" : ""}`} />
            <span>{isFlagged ? "Flagged for Review" : "Flag for Review"}</span>
          </button>

          {selectedIndex !== null && selectedIndex !== undefined && (
            <button
              onClick={onClearSelection}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Competency Tag */}
      {question.competencyName && (
        <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-500">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>FRAC Competency:</span>
          <span className="font-semibold text-slate-700">
            {question.competencyId ? `${question.competencyId} — ` : ""}
            {question.competencyName}
          </span>
        </div>
      )}

      {/* Question Text */}
      <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
        {question.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 pt-2">
        {question.options.map((optionText, optIdx) => {
          const isSelected = selectedIndex === optIdx;
          const letter = optionLetters[optIdx] || String(optIdx + 1);

          return (
            <div
              key={optIdx}
              onClick={() => onSelectOption(optIdx)}
              className={`group flex items-start space-x-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50/70 shadow-sm text-blue-950 font-medium"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 bg-white text-slate-800"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                }`}
              >
                {isSelected ? <Check className="w-4 h-4" /> : letter}
              </div>

              <div className="text-sm md:text-base pt-0.5 leading-relaxed flex-grow">
                {optionText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
