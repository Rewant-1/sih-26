"use client";

import React, { useEffect } from "react";
import type { Competency, RubricDescriptor } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  X,
  BookOpen,
  Award,
  CheckCircle2,
  Target,
  Sparkles,
  Building2,
} from "lucide-react";

interface RubricModalProps {
  competency: Competency | null;
  currentRating?: number;
  benchmarkRating?: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectRating?: (level: number) => void;
}

export function RubricModal({
  competency,
  currentRating,
  benchmarkRating,
  isOpen,
  onClose,
  onSelectRating,
}: RubricModalProps) {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !competency) return null;

  const levelColors: Record<number, { border: string; bg: string; text: string }> = {
    1: { border: "border-slate-300", bg: "bg-slate-50", text: "text-slate-700" },
    2: { border: "border-blue-300", bg: "bg-blue-50/50", text: "text-blue-700" },
    3: { border: "border-emerald-300", bg: "bg-emerald-50/50", text: "text-emerald-700" },
    4: { border: "border-amber-300", bg: "bg-amber-50/50", text: "text-amber-700" },
    5: { border: "border-purple-300", bg: "bg-purple-50/50", text: "text-purple-700" },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rubric-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-start justify-between">
          <div className="space-y-2 max-w-[85%]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {competency.code || competency.id}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-200">
                {competency.domain}
              </span>
              {competency.officialDivisionFocus && competency.officialDivisionFocus.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Divisions: {competency.officialDivisionFocus.join(", ")}</span>
                </div>
              )}
            </div>
            <h2 id="rubric-modal-title" className="text-xl font-bold text-white tracking-tight">
              {competency.name}
            </h2>
            <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {competency.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Rubric Levels 1 to 5 */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Official FRAC Proficiency Scale (Levels 1-5)</span>
            <div className="flex items-center gap-4">
              {benchmarkRating && (
                <span className="flex items-center gap-1 text-amber-600 font-medium normal-case">
                  <Target className="w-3.5 h-3.5" /> Target: Level {benchmarkRating}
                </span>
              )}
              {currentRating && (
                <span className="flex items-center gap-1 text-indigo-600 font-medium normal-case">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Current: Level {currentRating}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {competency.rubrics.map((rubric: RubricDescriptor) => {
              const isCurrent = currentRating === rubric.level;
              const isBenchmark = benchmarkRating === rubric.level;
              const col = levelColors[rubric.level] || levelColors[1];

              return (
                <div
                  key={rubric.level}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm"
                      : isBenchmark
                      ? "border-amber-400 bg-amber-50/30"
                      : `bg-white ${col.border} hover:border-slate-400`
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isCurrent
                            ? "bg-indigo-600 text-white"
                            : isBenchmark
                            ? "bg-amber-500 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {rubric.level}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          Level {rubric.level}: {rubric.label}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Your Selected Rating
                            </span>
                          )}
                          {isBenchmark && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Target className="w-3 h-3" /> Cadre Target Benchmark
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>

                    {onSelectRating && (
                      <Button
                        size="sm"
                        variant={isCurrent ? "primary" : "outline"}
                        onClick={() => {
                          onSelectRating(rubric.level);
                        }}
                        className="text-xs h-8 px-3"
                      >
                        {isCurrent ? "Selected" : `Set Level ${rubric.level}`}
                      </Button>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-700 leading-relaxed pl-9">
                    {rubric.description}
                  </p>

                  {rubric.behavioralIndicators && rubric.behavioralIndicators.length > 0 && (
                    <div className="mt-3 pl-9 pt-2 border-t border-slate-200/60">
                      <span className="text-xs font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Behavioral Indicators:
                      </span>
                      <ul className="space-y-1">
                        {rubric.behavioralIndicators.map((ind, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-600 flex items-start gap-1.5"
                          >
                            <span className="text-slate-400 mt-1">•</span>
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Mission Karmayogi FRAC Competency Taxonomy (MoSPI/CBC)</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
