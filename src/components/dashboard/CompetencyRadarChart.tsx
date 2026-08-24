"use client";

import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface RadarDataPoint {
  subject: string;
  assessed: number;
  benchmark: number;
  fullMark: number;
  domain?: string;
}

interface CompetencyRadarChartProps {
  domainData: RadarDataPoint[];
  detailedData?: RadarDataPoint[];
  officerName?: string;
  cadreName?: string;
}

export function CompetencyRadarChart({
  domainData,
  detailedData,
  officerName = "Officer",
  cadreName = "Target Cadre",
}: CompetencyRadarChartProps) {
  const [viewMode, setViewMode] = useState<"domain" | "detailed">("domain");

  const currentData =
    viewMode === "detailed" && detailedData && detailedData.length > 0
      ? detailedData
      : domainData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const assessed = Number(payload.find((p: any) => p.dataKey === "assessed")?.value ?? 0);
      const benchmark = Number(payload.find((p: any) => p.dataKey === "benchmark")?.value ?? 0);
      const delta = assessed - benchmark;

      return (
        <div className="rounded-xl border border-[#C7C2BA] bg-white p-3 shadow-lg text-xs space-y-1.5 min-w-[200px] z-50">
          <p className="font-bold text-[#142446] border-b border-[#C7C2BA]/40 pb-1">
            {data.subject}
          </p>
          {data.domain && (
            <p className="text-[11px] text-[#475A6F] font-medium">
              Domain: {data.domain}
            </p>
          )}
          <div className="flex justify-between items-center text-[#475A6F]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D8921E]" />
              Assessed Level:
            </span>
            <span className="font-mono font-bold text-[#D8921E]">
              {assessed.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="flex justify-between items-center text-[#475A6F]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#142446]" />
              Cadre Benchmark:
            </span>
            <span className="font-mono font-bold text-[#142446]">
              {benchmark.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="pt-1 border-t border-[#C7C2BA]/40 flex justify-between items-center">
            <span className="text-[11px] text-[#475A6F]">Status:</span>
            {delta < 0 ? (
              <span className="text-[11px] font-bold text-[#142446] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#C7C2BA]">
                Gap: {Math.abs(delta).toFixed(1)} Level{Math.abs(delta) > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-[11px] font-bold text-[#166534] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#2E7D32]/40">
                Benchmark Met ✓
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Title and Controls (Clean Stacked Layout, Zero Overlap) */}
      <div className="pb-3 border-b border-[#C7C2BA]/40 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#142446]">
                FRAC Competency Radar Profile
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]/60">
                Level 1–5 Scale
              </span>
            </div>
            <p className="text-xs text-[#475A6F] mt-0.5">
              Direct comparison: Assessed Proficiency vs {cadreName}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Own line to prevent any overlap) */}
        {detailedData && detailedData.length > 0 && (
          <div className="inline-flex items-center p-1 bg-[#FAF9F6] rounded-full border border-[#C7C2BA]/60">
            <button
              onClick={() => setViewMode("domain")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                viewMode === "domain"
                  ? "bg-[#142446] text-white shadow-xs"
                  : "text-[#475A6F] hover:text-[#142446]"
              }`}
            >
              4-Domain Summary
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                viewMode === "detailed"
                  ? "bg-[#142446] text-white shadow-xs"
                  : "text-[#475A6F] hover:text-[#142446]"
              }`}
            >
              Granular Competencies
            </button>
          </div>
        )}
      </div>

      {/* Radar Chart Visual */}
      <div className="h-[340px] sm:h-[380px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="75%"
            data={currentData}
            margin={{ top: 15, right: 30, bottom: 15, left: 30 }}
          >
            <PolarGrid stroke="#B7C7D9" strokeDasharray="3 3" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#475A6F",
                fontSize: viewMode === "domain" ? 11.5 : 9.5,
                fontWeight: 600,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={{ fill: "#475A6F", fontSize: 10 }}
              tickCount={6}
              stroke="#B7C7D9"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* 1. Assessed Proficiency Area (Saffron Gold with Subtle Fill) */}
            <Radar
              name={`${officerName} (Assessed)`}
              dataKey="assessed"
              stroke="#D8921E"
              strokeWidth={2.5}
              fill="#D8921E"
              fillOpacity={0.25}
            />

            {/* 2. Target Cadre Benchmark Line (Deep Navy Solid) */}
            <Radar
              name={`Cadre Benchmark (${cadreName})`}
              dataKey="benchmark"
              stroke="#142446"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="#142446"
              fillOpacity={0.08}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-[#C7C2BA]/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#D8921E]" />
          <span className="font-semibold text-[#142446]">
            {officerName} (Assessed)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#142446]" />
          <span className="font-semibold text-[#142446]">
            Cadre Benchmark
          </span>
        </div>
        <span className="text-[11px] text-[#475A6F]">
          Scale: 1 (Basic) to 5 (Expert)
        </span>
      </div>
    </div>
  );
}
