"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Building2,
  ChevronRight,
  Info,
  Layers,
  Target,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
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
  "Digital Governance & Data Stewardship": "Digital Gov",
  "Behavioural & Managerial Competencies": "Managerial",
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

  // Helper for color coding heat map cell using strict palette
  const getCellColor = (score: number) => {
    if (score < 2.5) {
      return "bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA] font-bold";
    }
    if (score < 3.2) {
      return "bg-[#B7C7D9] text-[#142446] font-bold";
    }
    if (score < 3.8) {
      return "bg-[#475A6F] text-white font-bold";
    }
    return "bg-[#142446] text-white font-bold";
  };

  return (
    <Card className="w-full border-[#C7C2BA] bg-white">
      <CardHeader className="pb-3 border-b border-[#C7C2BA]/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg text-[#142446] font-bold">
                MoSPI Division Competency Heatmap Matrix
              </CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                5 Divisions
              </span>
            </div>
            <CardDescription className="text-xs text-[#475A6F]">
              Aggregate domain proficiency averages across official MoSPI statistical divisions
            </CardDescription>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium bg-[#FAF9F6] p-2 rounded-lg border border-[#C7C2BA]">
            <span className="text-[#475A6F] font-bold">Scale (1-5):</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-[#F3E7D1] border border-[#C7C2BA]" />
              <span className="text-[#142446]">&lt; 2.5 (Priority Gap)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-[#B7C7D9]" />
              <span className="text-[#142446]">2.5 - 3.2</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-[#142446]" />
              <span className="text-[#142446]">&gt; 3.2 (Benchmark)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Interactive Heatmap Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#C7C2BA]">
                <th className="text-left py-3 px-3 font-bold uppercase tracking-wider text-[#475A6F] w-44">
                  Division / Cadre
                </th>
                <th className="text-center py-3 px-2 font-bold uppercase tracking-wider text-[#475A6F]">
                  Officers
                </th>
                {DOMAINS.map((domain) => (
                  <th
                    key={domain}
                    className="text-center py-3 px-2 font-bold text-[#142446] min-w-[110px]"
                  >
                    {DOMAIN_SHORT_NAMES[domain]}
                  </th>
                ))}
                <th className="text-center py-3 px-2 font-bold uppercase tracking-wider text-[#475A6F]">
                  Index
                </th>
                <th className="text-center py-3 px-2 font-bold uppercase tracking-wider text-[#475A6F]">
                  Deficits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7C2BA]/40">
              {divisions.map((div) => {
                const isSelected = div.divisionCode === selectedDivCode;

                return (
                  <tr
                    key={div.divisionCode}
                    onClick={() => {
                      setSelectedDivCode(div.divisionCode);
                      onSelectDivision?.(div);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#FAF9F6] font-medium"
                        : "hover:bg-[#FAF9F6]/60"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                            isSelected
                              ? "bg-[#142446] text-white"
                              : "bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]"
                          }`}
                        >
                          {div.divisionCode}
                        </span>
                        <span className="text-xs font-bold text-[#142446] leading-tight">
                          {div.divisionName}
                        </span>
                      </div>
                    </td>

                    <td className="text-center py-3 px-2 font-mono font-medium text-[#475A6F]">
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
                            className={`mx-auto flex h-8 w-20 items-center justify-center rounded-lg text-xs font-mono transition-transform ${getCellColor(
                              score
                            )} ${
                              hoveredCell?.divisionCode === div.divisionCode &&
                              hoveredCell?.domain === domain
                                ? "ring-2 ring-[#142446]"
                                : ""
                            }`}
                          >
                            {score.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}

                    <td className="text-center py-3 px-2">
                      <span className="inline-flex items-center justify-center font-mono text-xs font-bold px-2 py-1 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                        {div.overallProficiency}%
                      </span>
                    </td>

                    <td className="text-center py-3 px-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 rounded bg-white text-[#142446] border border-[#C7C2BA]">
                        <AlertCircle className="h-3 w-3 text-[#D8921E]" />
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
          <div className="rounded-xl border border-[#C7C2BA] bg-[#FAF9F6] p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#C7C2BA]/40 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#142446]" />
                  <h4 className="text-sm font-bold text-[#142446]">
                    {selectedDivision.divisionName} ({selectedDivision.divisionCode})
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#142446] border border-[#C7C2BA]">
                    {selectedDivision.totalOfficers} Officers Total
                  </span>
                </div>
                <p className="text-xs text-[#475A6F] mt-0.5">
                  Cadre Breakdown: {selectedDivision.cadreBreakdown.ISS_ASSISTANT_DIRECTOR} ISS AD · {selectedDivision.cadreBreakdown.SENIOR_STATISTICAL_OFFICER} SSO · {selectedDivision.cadreBreakdown.JUNIOR_STATISTICAL_OFFICER} JSO
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#475A6F]">Overall Division Index:</span>
                <span className="font-mono text-sm font-bold text-[#142446]">
                  {selectedDivision.overallProficiency}%
                </span>
              </div>
            </div>

            {/* Top Critical Competencies for Selected Division */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[#142446] uppercase tracking-wider">
                Priority Deficiencies in {selectedDivision.divisionCode}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(selectedDivision.topDeficientCompetencies || []).map((comp) => (
                  <div
                    key={comp.competencyId}
                    className="p-3 bg-white rounded-lg border border-[#C7C2BA] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#475A6F]">
                        {comp.competencyId}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                        Gap: -{comp.gap.toFixed(1)}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-[#142446] line-clamp-1">
                      {comp.competencyName}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-[#475A6F] pt-1 border-t border-[#C7C2BA]/30">
                      <span>Assessed: {comp.averageScore.toFixed(1)}</span>
                      <span>Target: {comp.benchmark.toFixed(1)}</span>
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
