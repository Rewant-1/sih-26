"use client";

import React from "react";
import type { Competency, CompetencyDomain, DomainCode } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  AlertTriangle,
  Sparkles,
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

const DOMAIN_ACCENT_COLORS: Record<
  DomainCode,
  { bg: string; border: string; text: string; badge: string; iconBg: string }
> = {
  STAT: {
    bg: "bg-blue-50/40",
    border: "border-blue-200",
    text: "text-blue-900",
    badge: "bg-blue-100 text-blue-800",
    iconBg: "bg-blue-600 text-white",
  },
  TECH: {
    bg: "bg-emerald-50/40",
    border: "border-emerald-200",
    text: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-800",
    iconBg: "bg-emerald-600 text-white",
  },
  GOV: {
    bg: "bg-amber-50/40",
    border: "border-amber-200",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-800",
    iconBg: "bg-amber-600 text-white",
  },
  BEH: {
    bg: "bg-purple-50/40",
    border: "border-purple-200",
    text: "text-purple-900",
    badge: "bg-purple-100 text-purple-800",
    iconBg: "bg-purple-600 text-white",
  },
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
  const colors = DOMAIN_ACCENT_COLORS[domainCode] || DOMAIN_ACCENT_COLORS.STAT;

  // Compute domain summary statistics
  const totalCompetencies = competencies.length;
  const ratedCount = competencies.filter(
    (c) => ratings[c.id] !== undefined && ratings[c.id] > 0
  ).length;

  let assessedSum = 0;
  let benchmarkSum = 0;
  let criticalGaps = 0;
  let moderateGaps = 0;

  for (const c of competencies) {
    const a = ratings[c.id] || 1;
    const b = benchmarks[c.id] || 3;
    assessedSum += a;
    benchmarkSum += b;
    const gap = Math.max(0, b - a);
    if (gap >= 2) criticalGaps++;
    else if (gap === 1) moderateGaps++;
  }

  const dpi =
    benchmarkSum > 0
      ? Number(((assessedSum / benchmarkSum) * 100).toFixed(1))
      : 100;

  return (
    <div className={`rounded-2xl border ${colors.border} bg-white shadow-sm overflow-hidden transition-all duration-200 mb-4`}>
      {/* Domain Header Header Toggle */}
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full p-5 text-left flex items-center justify-between transition-colors ${
          isExpanded ? colors.bg : "hover:bg-slate-50"
        }`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${colors.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${colors.badge}`}>
                {domainCode}
              </span>
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {domain}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>{totalCompetencies} Competencies</span>
              <span>•</span>
              <span className={ratedCount === totalCompetencies ? "text-emerald-600 font-semibold" : ""}>
                {ratedCount}/{totalCompetencies} Evaluated
              </span>
              <span>•</span>
              <span>
                Avg Assessed: {(assessedSum / (totalCompetencies || 1)).toFixed(1)} / Target: {(benchmarkSum / (totalCompetencies || 1)).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          {/* Domain Proficiency Index Badge */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium">Domain Index</span>
            <span
              className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                dpi >= 100
                  ? "bg-emerald-100 text-emerald-800"
                  : dpi >= 80
                  ? "bg-blue-100 text-blue-800"
                  : dpi >= 60
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {dpi}%
            </span>
          </div>

          {/* Quick Gaps indicator */}
          {(criticalGaps > 0 || moderateGaps > 0) && (
            <div className="hidden md:flex items-center gap-1.5">
              {criticalGaps > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {criticalGaps} Critical
                </span>
              )}
              {moderateGaps > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  {moderateGaps} Moderate
                </span>
              )}
            </div>
          )}

          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Accordion Content: Competency Cards */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-4">
          {competencies.map((comp) => {
            const assessed = ratings[comp.id] || 1;
            const benchmark = benchmarks[comp.id] || 3;
            const delta = assessed - benchmark;
            const gap = Math.max(0, benchmark - assessed);

            return (
              <div
                key={comp.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                {/* Competency Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {comp.code || comp.id}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {comp.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {comp.description}
                    </p>
                  </div>

                  {/* Actions & Live Gap Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Gap Badge */}
                    {delta > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        +{delta} Surplus
                      </span>
                    )}
                    {delta === 0 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Target Met (L{benchmark})
                      </span>
                    )}
                    {gap === 1 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        -1 Moderate Gap
                      </span>
                    )}
                    {gap >= 2 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        -{gap} Critical Gap
                      </span>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRubric(comp)}
                      className="text-xs h-8 gap-1 text-slate-700 hover:text-indigo-600"
                    >
                      <Info className="w-3.5 h-3.5" />
                      View Rubrics
                    </Button>
                  </div>
                </div>

                {/* Rating Selector Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      Select Your Assessed Proficiency:
                      <span className="text-indigo-600 font-bold">
                        Level {assessed} — {PROFICIENCY_LABELS[assessed]}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Target className="w-3.5 h-3.5" />
                      Cadre Benchmark: Level {benchmark} ({PROFICIENCY_LABELS[benchmark]})
                    </span>
                  </div>

                  {/* 1-5 Segmented Buttons */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isSelected = assessed === lvl;
                      const isBenchmark = benchmark === lvl;

                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => onRatingChange(comp.id, lvl)}
                          className={`relative p-2.5 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20"
                              : isBenchmark
                              ? "bg-amber-50/50 border-amber-300 text-slate-800 hover:border-amber-400 hover:bg-amber-100/40"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {/* Cadre Benchmark Indicator Tag */}
                          {isBenchmark && (
                            <span
                              className={`absolute -top-2 px-1.5 py-0.2 rounded text-[9px] font-bold tracking-tight shadow-xs ${
                                isSelected
                                  ? "bg-amber-400 text-slate-900"
                                  : "bg-amber-500 text-white"
                              }`}
                            >
                              TARGET
                            </span>
                          )}

                          <span className="text-sm font-bold">{lvl}</span>
                          <span
                            className={`text-[10px] font-medium truncate max-w-full ${
                              isSelected ? "text-indigo-100" : "text-slate-500"
                            }`}
                          >
                            {PROFICIENCY_LABELS[lvl]}
                          </span>
                        </button>
                      );
                    })}
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
