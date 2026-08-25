"use client";

import React from "react";
import type { Competency, CompetencyDomain, DomainCode } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  Code2,
  ShieldCheck,
  Users,
  Target,
  Info,
  CheckCircle2,
} from "lucide-react";

interface DomainAccordionProps {
  domain: CompetencyDomain;
  domainCode: DomainCode;
  competencies: Competency[];
  ratings: Record<string, number>;
  benchmarks: Record<string, number>;
  onRatingChange: (competencyId: string, rating: number) => void;
  onViewRubric: (competency: Competency) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const DOMAIN_ICONS: Record<DomainCode, React.ElementType> = {
  STAT: BarChart3,
  TECH: Code2,
  GOV: ShieldCheck,
  BEH: Users,
};

const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Basic",
  2: "Novice",
  3: "Proficient",
  4: "Advanced",
  5: "Expert",
};

export function DomainAccordion({
  domain,
  domainCode,
  competencies,
  ratings,
  benchmarks,
  onRatingChange,
  onViewRubric,
  isExpanded,
  onToggleExpand,
}: DomainAccordionProps) {
  const Icon = DOMAIN_ICONS[domainCode] || BarChart3;

  // Compute domain summary statistics
  const totalCompetencies = competencies.length;
  const ratedCount = competencies.filter(
    (c) => ratings[c.id] !== undefined && ratings[c.id] > 0
  ).length;

  return (
    <div className="rounded-2xl border border-[#C7C2BA] bg-white overflow-hidden shadow-xs">
      {/* Header Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors bg-[#FAF9F6] hover:bg-[#F3E7D1]/30 border-b border-[#C7C2BA]/60"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#142446] text-white">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-white text-[#142446] border border-[#C7C2BA]/60 font-mono">
                {domainCode}
              </span>
              <span className="text-xs text-[#475A6F] font-semibold">
                {ratedCount}/{totalCompetencies} Evaluated
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#142446] mt-0.5">
              {domain}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="w-28 h-2 bg-white border border-[#C7C2BA]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#142446] rounded-full"
                style={{
                  width: `${(ratedCount / (totalCompetencies || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="p-1 rounded-lg bg-white border border-[#C7C2BA]/60 text-[#475A6F]">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4 divide-y divide-[#C7C2BA]/40 bg-white">
          {competencies.map((comp) => {
            const currentRating = ratings[comp.id] ?? 1;
            const targetBenchmark = benchmarks[comp.id] ?? 3;
            const isGap = currentRating < targetBenchmark;
            const isSurplus = currentRating > targetBenchmark;

            return (
              <div key={comp.id} className="pt-4 first:pt-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Competency Info */}
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/60">
                        {comp.code || comp.id}
                      </span>
                      <h4 className="text-sm font-bold text-[#142446]">
                        {comp.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[#475A6F] line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => onViewRubric(comp)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#142446] hover:text-[#D8921E] transition-colors pt-0.5"
                    >
                      <Info className="w-3.5 h-3.5 text-[#D8921E]" />
                      <span>View Rubric & Behavioral Indicators</span>
                    </button>
                  </div>

                  {/* Rating Selector (Level 1–5) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4 shrink-0">
                    {/* Cadre Benchmark Badge */}
                    <div className="flex items-center gap-1 text-xs text-[#475A6F]">
                      <Target className="w-3.5 h-3.5 text-[#D8921E]" />
                      <span>Target: <strong className="text-[#142446]">L{targetBenchmark}</strong></span>
                    </div>

                    {/* Level Buttons 1-5 */}
                    <div className="inline-flex rounded-xl border border-[#C7C2BA] p-1 bg-[#FAF9F6] gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => {
                        const isSelected = currentRating === lvl;
                        const isTarget = targetBenchmark === lvl;

                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => onRatingChange(comp.id, lvl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                              isSelected
                                ? "bg-[#142446] text-white shadow-xs"
                                : isTarget
                                ? "bg-white text-[#142446] border border-[#D8921E] hover:bg-[#F3E7D1]/50"
                                : "bg-white text-[#475A6F] border border-[#C7C2BA]/40 hover:text-[#142446] hover:bg-[#FAF9F6]"
                            }`}
                            title={`Level ${lvl}: ${PROFICIENCY_LABELS[lvl]}`}
                          >
                            <span>L{lvl}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Delta Status Badge */}
                    <div className="min-w-[90px] text-right">
                      {isGap ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                          Gap: {targetBenchmark - currentRating}
                        </span>
                      ) : isSurplus ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                          +{currentRating - targetBenchmark}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                          Met
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
