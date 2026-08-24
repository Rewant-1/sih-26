"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
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
    <Card className="w-full border-[#C7C2BA] bg-white">
      <CardHeader className="pb-3 border-b border-[#C7C2BA]/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg text-[#142446] font-bold">
                Prioritized Skill Gap Breakdown
              </CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                {gaps.length} Competencies
              </span>
            </div>
            <CardDescription className="text-xs text-[#475A6F]">
              Transparent delta between Assessed Proficiency and Cadre Benchmark
            </CardDescription>
          </div>

          {/* Quick Count Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter("ALL")}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filter === "ALL"
                  ? "bg-[#142446] text-white"
                  : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA] hover:bg-white"
              }`}
            >
              All ({gaps.length})
            </button>
            <button
              onClick={() => setFilter("CRITICAL")}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filter === "CRITICAL"
                  ? "bg-[#142446] text-white"
                  : "bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA] hover:bg-white"
              }`}
            >
              <AlertCircle className="h-3 w-3 text-[#D8921E]" />
              Critical ({criticalGaps.length})
            </button>
            <button
              onClick={() => setFilter("MODERATE")}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filter === "MODERATE"
                  ? "bg-[#142446] text-white"
                  : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA] hover:bg-white"
              }`}
            >
              Moderate ({moderateGaps.length})
            </button>
            <button
              onClick={() => setFilter("PROFICIENT")}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filter === "PROFICIENT"
                  ? "bg-[#142446] text-white"
                  : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA] hover:bg-white"
              }`}
            >
              Strengths ({proficientGaps.length})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {filteredGaps.length === 0 ? (
          <div className="text-center py-8 text-[#475A6F] bg-[#FAF9F6] rounded-xl border border-dashed border-[#C7C2BA]">
            <p className="text-sm font-medium">No competencies in this category</p>
            <p className="text-xs text-[#475A6F] mt-1">
              Select another filter or take a new assessment
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredGaps.map((item) => {
              const isCritical = item.severity === "CRITICAL";
              const isModerate = item.severity === "MODERATE";
              const isProficient =
                item.severity === "PROFICIENT" || item.severity === "SURPLUS";

              return (
                <div
                  key={item.competencyId}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isCritical
                      ? "border-[#C7C2BA] bg-[#FAF9F6]"
                      : isModerate
                      ? "border-[#C7C2BA] bg-[#FAF9F6]"
                      : "border-[#C7C2BA] bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#475A6F] bg-white px-1.5 py-0.5 rounded border border-[#C7C2BA]">
                          {item.competencyId}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white text-[#142446] border border-[#C7C2BA]">
                          {item.domain.split(" ")[0]}
                        </span>
                        {isCritical && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                            Priority Gap
                          </span>
                        )}
                        {isModerate && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]">
                            Moderate Gap
                          </span>
                        )}
                        {isProficient && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#142446] border border-[#C7C2BA]">
                            Benchmark Met
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-[#142446] leading-snug">
                        {item.competencyName}
                      </h4>

                      <p className="text-xs text-[#475A6F] leading-relaxed">
                        {item.suggestedAction}
                      </p>
                    </div>

                    {/* Right side: Level stats & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#C7C2BA]/40">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="font-bold text-[#142446]">
                            L{item.assessedLevel}
                          </span>
                          <span className="text-[#C7C2BA]">/</span>
                          <span className="text-[#475A6F]">
                            Target L{item.benchmarkLevel}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold mt-0.5">
                          {item.gap > 0 ? (
                            <span className="text-[#142446] flex items-center gap-0.5 justify-end">
                              <TrendingDown className="h-3 w-3 text-[#D8921E]" />
                              Gap -{item.gap}
                            </span>
                          ) : (
                            <span className="text-[#142446] flex items-center gap-0.5 justify-end">
                              <TrendingUp className="h-3 w-3 text-[#142446]" />
                              +{Math.abs(item.rawDelta)} Surplus
                            </span>
                          )}
                        </div>
                      </div>

                      {item.gap > 0 ? (
                        <Link
                          href={`/catalog?competencyId=${item.competencyId}&user=${userId}`}
                        >
                          <Button
                            size="sm"
                            className="text-xs h-7 px-2.5 py-0 bg-[#142446] hover:bg-[#1e3460] text-white font-bold"
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            Find Courses
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[11px] font-bold text-[#142446] bg-[#F3E7D1] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#C7C2BA]">
                          <Award className="h-3 w-3" />
                          Mentor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Delta Bar */}
                  <div className="mt-2.5 pt-2 border-t border-[#C7C2BA]/40">
                    <div className="flex justify-between items-center text-[10px] text-[#475A6F] font-mono mb-1">
                      <span>Assessed: Level {item.assessedLevel} of 5</span>
                      <span>Target: Level {item.benchmarkLevel} of 5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#FAF9F6] border border-[#C7C2BA]/60 overflow-hidden relative">
                      {/* Benchmark marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-[#142446] z-10"
                        style={{ left: `${(item.benchmarkLevel / 5) * 100}%` }}
                        title={`Target: Level ${item.benchmarkLevel}`}
                      />
                      {/* Assessed fill */}
                      <div
                        className="h-full bg-[#D8921E]"
                        style={{ width: `${(item.assessedLevel / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
