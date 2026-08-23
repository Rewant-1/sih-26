"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Flame,
  GraduationCap,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import type { SkillGap, GapSeverity } from "@/lib/types";
import { getDomainBadgeColor } from "@/lib/utils";

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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">
                Prioritized Skill Gap Breakdown
              </CardTitle>
              <Badge variant="navy" size="sm">
                {gaps.length} Competencies
              </Badge>
            </div>
            <CardDescription>
              Transparent delta between Assessed Proficiency and Cadre Benchmark
            </CardDescription>
          </div>

          {/* Quick Count Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter("ALL")}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                filter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({gaps.length})
            </button>
            <button
              onClick={() => setFilter("CRITICAL")}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1 ${
                filter === "CRITICAL"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              <Flame className="h-3 w-3" />
              Critical ({criticalGaps.length})
            </button>
            <button
              onClick={() => setFilter("MODERATE")}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1 ${
                filter === "MODERATE"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              Moderate ({moderateGaps.length})
            </button>
            <button
              onClick={() => setFilter("PROFICIENT")}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1 ${
                filter === "PROFICIENT"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              Strengths ({proficientGaps.length})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {filteredGaps.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm font-medium">No competencies in this category</p>
            <p className="text-xs text-slate-400 mt-1">
              Select another filter or take a new assessment
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredGaps.map((item) => {
              const domainColors = getDomainBadgeColor(item.domain);
              const isCritical = item.severity === "CRITICAL";
              const isModerate = item.severity === "MODERATE";
              const isProficient =
                item.severity === "PROFICIENT" || item.severity === "SURPLUS";

              return (
                <div
                  key={item.competencyId}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCritical
                      ? "border-rose-200 bg-rose-50/40 hover:bg-rose-50/70"
                      : isModerate
                      ? "border-amber-200 bg-amber-50/30 hover:bg-amber-50/60"
                      : "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {item.competencyId}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${domainColors.badge}`}>
                          {item.domain.split(" ")[0]}
                        </span>
                        {isCritical && (
                          <Badge variant="destructive" size="sm">
                            <Flame className="h-3 w-3 mr-0.5" />
                            Critical Deficiency
                          </Badge>
                        )}
                        {isModerate && (
                          <Badge variant="warning" size="sm">
                            Moderate Gap
                          </Badge>
                        )}
                        {isProficient && (
                          <Badge variant="success" size="sm">
                            Benchmark Met
                          </Badge>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                        {item.competencyName}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.suggestedAction}
                      </p>
                    </div>

                    {/* Right side: Level stats & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="font-bold text-slate-900">
                            L{item.assessedLevel}
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-500">
                            Target L{item.benchmarkLevel}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold mt-0.5">
                          {item.gap > 0 ? (
                            <span className="text-rose-600 flex items-center gap-0.5 justify-end">
                              <TrendingDown className="h-3 w-3" />
                              Gap -{item.gap}
                            </span>
                          ) : (
                            <span className="text-emerald-600 flex items-center gap-0.5 justify-end">
                              <TrendingUp className="h-3 w-3" />
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
                            variant={isCritical ? "saffron" : "outline"}
                            className="text-xs h-7 px-2.5 py-0"
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            Find Courses
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Eligible Mentor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Delta Bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-1">
                      <span>Assessed: Level {item.assessedLevel} of 5</span>
                      <span>Target: Level {item.benchmarkLevel} of 5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden relative">
                      {/* Benchmark marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10"
                        style={{ left: `${(item.benchmarkLevel / 5) * 100}%` }}
                        title={`Target: Level ${item.benchmarkLevel}`}
                      />
                      {/* Assessed fill */}
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCritical
                            ? "bg-rose-500"
                            : isModerate
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
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
