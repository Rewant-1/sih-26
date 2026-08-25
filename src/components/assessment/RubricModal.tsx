"use client";

import React, { useEffect } from "react";
import type { Competency } from "@/lib/types";
import {
  X,
  BookOpen,
  Award,
  CheckCircle2,
  Target,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142446]/40 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rubric-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#C7C2BA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF9F6] border-b border-[#C7C2BA] text-[#142446] flex items-start justify-between">
          <div className="space-y-2 max-w-[85%]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                {competency.code || competency.id}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-white border border-[#C7C2BA] text-[#475A6F]">
                {competency.domain}
              </span>
              {competency.officialDivisionFocus && competency.officialDivisionFocus.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#475A6F]">
                  <Building2 className="w-3.5 h-3.5 text-[#475A6F]" />
                  <span>Divisions: {competency.officialDivisionFocus.join(", ")}</span>
                </div>
              )}
            </div>
            <h2 id="rubric-modal-title" className="text-xl font-bold text-[#142446] tracking-tight">
              {competency.name}
            </h2>
            <p className="text-sm text-[#475A6F] line-clamp-2 leading-relaxed">
              {competency.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#475A6F] hover:text-[#142446] hover:bg-[#F3E7D1] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 5 Proficiency Levels */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white">
          <div className="flex items-center justify-between pb-2 border-b border-[#C7C2BA]/40 text-xs text-[#475A6F]">
            <span>Official FRAC Behavioral Descriptors (Level 1–5)</span>
            <div className="flex items-center gap-4 font-medium">
              {benchmarkRating && (
                <span className="flex items-center gap-1 text-[#142446]">
                  <Target className="w-3.5 h-3.5 text-[#D8921E]" /> Cadre Target: L{benchmarkRating}
                </span>
              )}
              {currentRating && (
                <span className="flex items-center gap-1 text-[#142446]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#142446]" /> Current: L{currentRating}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {competency.rubrics.map((rubric) => {
              const isCurrent = currentRating === rubric.level;
              const isBenchmark = benchmarkRating === rubric.level;

              return (
                <div
                  key={rubric.level}
                  onClick={() => onSelectRating && onSelectRating(rubric.level)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isCurrent
                      ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                      : isBenchmark
                      ? "border-[#D8921E] bg-[#F3E7D1]/30"
                      : "border-[#C7C2BA]/60 bg-white hover:border-[#C7C2BA] hover:bg-[#FAF9F6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#142446] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {rubric.level}
                      </span>
                      <h3 className="text-sm font-bold text-[#142446]">
                        {rubric.label}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isBenchmark && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8921E] text-white flex items-center gap-1">
                          <Target className="w-3 h-3" /> Cadre Target
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#142446] text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#475A6F] leading-relaxed mb-3">
                    {rubric.description}
                  </p>

                  {rubric.behavioralIndicators && rubric.behavioralIndicators.length > 0 && (
                    <div className="pt-2.5 border-t border-[#C7C2BA]/40 space-y-1">
                      <p className="text-[11px] font-bold text-[#142446]">
                        Observable Behavioral Indicators:
                      </p>
                      <ul className="space-y-1">
                        {rubric.behavioralIndicators.map((indicator, idx) => (
                          <li key={idx} className="text-xs text-[#475A6F] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D8921E] mt-1.5 shrink-0" />
                            <span>{indicator}</span>
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
        <div className="p-4 bg-[#FAF9F6] border-t border-[#C7C2BA] flex items-center justify-between">
          <p className="text-xs text-[#475A6F]">
            Click any level above to set your self-assessed proficiency.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#142446] text-white text-xs font-semibold hover:bg-[#1e3460] transition-colors"
          >
            Close Rubric
          </button>
        </div>
      </div>
    </div>
  );
}
