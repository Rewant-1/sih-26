"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SkillGap, GapSeverity } from "@/lib/types";

interface SkillGapCardProps {
  gaps: SkillGap[];
  userId?: string;
}

export function SkillGapCard({ gaps, userId = "usr-jso-rajesh" }: SkillGapCardProps) {
  const [filter, setFilter] = useState<"ALL" | GapSeverity>("ALL");

  const criticalGaps = gaps.filter((g) => g.severity === "CRITICAL");
  const moderateGaps = gaps.filter((g) => g.severity === "MODERATE");
  const proficientGaps = gaps.filter(
    (g) => g.severity === "PROFICIENT" || g.severity === "SURPLUS"
  );

  const filteredGaps =
    filter === "ALL"
      ? gaps
      : gaps.filter((g) => {
          if (filter === "PROFICIENT") {
            return g.severity === "PROFICIENT" || g.severity === "SURPLUS";
          }
          return g.severity === filter;
        });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="pb-3 border-b border-[#C7C2BA]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg text-[#142446] font-bold">
              Prioritized Skill Gap Breakdown
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#142446] text-white">
              {gaps.length} Skills
            </span>
          </div>
          <p className="text-xs text-[#475A6F] mt-0.5">
            Transparent delta between Assessed Proficiency and Cadre Benchmark
          </p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("ALL")}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
              filter === "ALL"
                ? "bg-[#142446] text-white shadow-xs"
                : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/60 hover:text-[#142446]"
            }`}
          >
            All ({gaps.length})
          </button>
          <button
            onClick={() => setFilter("CRITICAL")}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
              filter === "CRITICAL"
                ? "bg-[#142446] text-white shadow-xs"
                : "bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]/60 hover:text-[#142446]"
            }`}
          >
            Critical ({criticalGaps.length})
          </button>
          <button
            onClick={() => setFilter("MODERATE")}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
              filter === "MODERATE"
                ? "bg-[#142446] text-white shadow-xs"
                : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/60 hover:text-[#142446]"
            }`}
          >
            Moderate ({moderateGaps.length})
          </button>
          <button
            onClick={() => setFilter("PROFICIENT")}
            className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
              filter === "PROFICIENT"
                ? "bg-[#142446] text-white shadow-xs"
                : "bg-[#FAF9F6] text-[#166534] border border-[#C7C2BA]/60 hover:text-[#166534]"
            }`}
          >
            Met ({proficientGaps.length})
          </button>
        </div>
      </div>

      {/* List Items (Clean open rows) */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {filteredGaps.length === 0 ? (
          <div className="text-center py-8 text-[#475A6F] bg-[#FAF9F6] rounded-xl border border-dashed border-[#C7C2BA]">
            <p className="text-sm font-medium">No competencies in this category</p>
          </div>
        ) : (
          filteredGaps.map((item) => {
            const isCritical = item.severity === "CRITICAL";
            const isProficient =
              item.severity === "PROFICIENT" || item.severity === "SURPLUS";

            return (
              <div
                key={item.competencyId}
                className="p-4 rounded-xl border border-[#C7C2BA]/60 bg-white hover:border-[#142446]/40 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-[#475A6F]">
                        {item.competencyId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]/60">
                        {item.domain.split(" ")[0]}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isCritical
                            ? "bg-[#142446] text-white"
                            : isProficient
                            ? "bg-[#E8F5E9] text-[#166534] border border-[#2E7D32]/40"
                            : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/60"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#142446]">
                      {item.competencyName}
                    </h4>
                    <p className="text-xs text-[#475A6F] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-[#142446]">
                      L{item.assessedLevel} / Target L{item.benchmarkLevel}
                    </div>
                    <div className="text-[11px] font-semibold mt-0.5">
                      {item.gap > 0 ? (
                        <span className="text-[#142446]">Gap: -{item.gap} Level{item.gap > 1 ? "s" : ""}</span>
                      ) : (
                        <span className="text-[#166534]">Benchmark Met ✓</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar and Course Action */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#C7C2BA]/30">
                  <div className="flex-1 max-w-xs flex items-center gap-2 text-[10px] text-[#475A6F]">
                    <span>L1</span>
                    <div className="flex-1 h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#C7C2BA]/40">
                      <div
                        className={`h-full ${
                          isProficient
                            ? "bg-[#2E7D32]"
                            : "bg-[#142446]"
                        }`}
                        style={{ width: `${(item.assessedLevel / 5) * 100}%` }}
                      />
                    </div>
                    <span>L5</span>
                  </div>

                  {item.gap > 0 && (
                    <Link
                      href={`/catalog?user=${userId}&q=${encodeURIComponent(item.competencyName.split(" ")[0])}`}
                      className="text-xs font-bold text-[#142446] hover:text-[#475A6F] transition-colors shrink-0"
                    >
                      Find Courses →
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
