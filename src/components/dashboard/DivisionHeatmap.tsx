"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  Flame,
  Info,
  Layers,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { DivisionAggregateMetric, CompetencyDomain } from "@/lib/types";

interface DivisionHeatmapProps {
  divisions: DivisionAggregateMetric[];
  onSelectDivision?: (division: DivisionAggregateMetric) => void;
}

const DOMAINS: CompetencyDomain[] = [
  "Statistical Competencies",
  "Technical Competencies",
  "Digital Governance & Data Stewardship",
  "Behavioural & Managerial Competencies",
];

const DOMAIN_SHORT_NAMES: Record<CompetencyDomain, string> = {
  "Statistical Competencies": "Statistical",
  "Technical Competencies": "Technical",
  "Digital Governance & Data Stewardship": "Digital Gov & SDC",
  "Behavioural & Managerial Competencies": "Behavioural",
};

export function DivisionHeatmap({
  divisions,
  onSelectDivision,
}: DivisionHeatmapProps) {
  const [selectedDivCode, setSelectedDivCode] = useState<string>("FOD");
  const [hoveredCell, setHoveredCell] = useState<{
    divisionCode: string;
    domain: CompetencyDomain;
    score: number;
  } | null>(null);

  const selectedDivision =
    divisions.find((d) => d.divisionCode === selectedDivCode) || divisions[0];

  // Helper for color coding heat map cell
  const getCellColor = (score: number) => {
    if (score < 2.5) {
      return "bg-rose-500 text-white hover:bg-rose-600 ring-rose-400";
    }
    if (score < 3.2) {
      return "bg-amber-400 text-slate-950 hover:bg-amber-500 ring-amber-300";
    }
    if (score < 3.8) {
      return "bg-emerald-500 text-white hover:bg-emerald-600 ring-emerald-400";
    }
    return "bg-emerald-700 text-white hover:bg-emerald-800 ring-emerald-500";
  };

  const getCellBgLight = (score: number) => {
    if (score < 2.5) return "bg-rose-50 text-rose-800 border-rose-200";
    if (score < 3.2) return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">
                MoSPI Division Competency Heatmap Matrix
              </CardTitle>
              <Badge variant="navy" size="sm">
                5 Divisions
              </Badge>
            </div>
            <CardDescription>
              Aggregate domain proficiency averages across official MoSPI statistical divisions
            </CardDescription>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-2 text-[11px] font-medium bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold">Scale (1-5):</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-rose-500" />
              <span>&lt; 2.5 (Critical)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-amber-400" />
              <span>2.5 - 3.2 (Moderate)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-emerald-600" />
              <span>&gt; 3.2 (Proficient)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Interactive Heatmap Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-44">
                  Division / Cadre
                </th>
                <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Officers
                </th>
                {DOMAINS.map((domain) => (
                  <th
                    key={domain}
                    className="text-center py-3 px-2 text-xs font-bold text-slate-700 min-w-[120px]"
                  >
                    {DOMAIN_SHORT_NAMES[domain]}
                  </th>
                ))}
                <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Index
                </th>
                <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Deficits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {divisions.map((div) => {
                const isSelected = div.divisionCode === selectedDivCode;

                return (
                  <tr
                    key={div.divisionCode}
                    onClick={() => {
                      setSelectedDivCode(div.divisionCode);
                      onSelectDivision?.(div);
                    }}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-100/90 font-medium"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                            isSelected
                              ? "bg-[#000080] text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {div.divisionCode}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-900 leading-tight">
                            {div.divisionName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="text-center py-3 px-2 text-xs font-mono font-medium text-slate-600">
                      {div.totalOfficers.toLocaleString()}
                    </td>

                    {DOMAINS.map((domain) => {
                      const score = div.domainAverages[domain] || 0;
                      return (
                        <td key={domain} className="py-2.5 px-2 text-center">
                          <div
                            onMouseEnter={() =>
                              setHoveredCell({
                                divisionCode: div.divisionCode,
                                domain,
                                score,
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`mx-auto flex h-9 w-24 items-center justify-center rounded-lg text-xs font-mono font-bold transition-transform shadow-xs ${getCellColor(
                              score
                            )} ${
                              hoveredCell?.divisionCode === div.divisionCode &&
                              hoveredCell?.domain === domain
                                ? "scale-105 ring-2"
                                : ""
                            }`}
                          >
                            {score.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}

                    <td className="text-center py-3 px-2">
                      <span className="inline-flex items-center justify-center font-mono text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                        {div.overallProficiency}%
                      </span>
                    </td>

                    <td className="text-center py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 rounded-md ${
                          div.criticalGapsCount > 50
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        <Flame className="h-3 w-3" />
                        {div.criticalGapsCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Division Deep Dive Drawer / Panel */}
        {selectedDivision && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#000080]" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedDivision.divisionName} ({selectedDivision.divisionCode})
                  </h4>
                  <Badge variant="navy" size="sm">
                    {selectedDivision.totalOfficers} Officers Total
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cadre Breakdown: {selectedDivision.cadreBreakdown.ISS_ASSISTANT_DIRECTOR} ISS AD •{" "}
                  {selectedDivision.cadreBreakdown.SENIOR_STATISTICAL_OFFICER} SSO •{" "}
                  {selectedDivision.cadreBreakdown.JUNIOR_STATISTICAL_OFFICER} JSO
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Overall Proficiency:</span>
                <span className="text-sm font-mono font-bold text-[#000080]">
                  {selectedDivision.overallProficiency}%
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top Priority Deficiencies in {selectedDivision.divisionCode}
                </span>
                <span className="text-[11px] text-slate-400">
                  Recommended for ACBP 2026-27 Allocation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedDivision.topDeficientCompetencies.map((def, idx) => (
                  <div
                    key={def.competencyId}
                    className="rounded-lg border border-slate-200 bg-white p-3 space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{idx + 1} {def.competencyId}
                      </span>
                      <Badge variant="destructive" size="sm">
                        Gap: -{def.gap.toFixed(2)}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {def.competencyName}
                    </p>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-1">
                      <span>Avg Score: {def.averageScore.toFixed(2)}</span>
                      <span>Target: {def.benchmark.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
