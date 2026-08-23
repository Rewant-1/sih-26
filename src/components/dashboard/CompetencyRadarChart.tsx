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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import type { CompetencyDomain } from "@/lib/types";

export interface RadarDataPoint {
  subject: string;
  assessed: number;
  benchmark: number;
  domain?: CompetencyDomain;
  fullMark: number;
  gap?: number;
}

interface CompetencyRadarChartProps {
  domainData: RadarDataPoint[];
  detailedData?: RadarDataPoint[];
  officerName?: string;
  cadreName?: string;
}

export function CompetencyRadarChart({
  domainData,
  detailedData = [],
  officerName = "Officer",
  cadreName = "Cadre Benchmark",
}: CompetencyRadarChartProps) {
  const [viewMode, setViewMode] = useState<"domain" | "all">("domain");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");

  const domainsList = [
    "ALL",
    "Statistical Competencies",
    "Technical Competencies",
    "Digital Governance & Data Stewardship",
    "Behavioural & Managerial Competencies",
  ];

  let displayData = viewMode === "domain" ? domainData : detailedData;

  if (viewMode === "all" && selectedDomain !== "ALL") {
    displayData = detailedData.filter((d) => d.domain === selectedDomain);
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const assessed = Number(payload.find((p: any) => p.dataKey === "assessed")?.value ?? 0);
      const benchmark = Number(payload.find((p: any) => p.dataKey === "benchmark")?.value ?? 0);
      const delta = assessed - benchmark;

      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg ring-1 ring-black/5 text-xs space-y-1.5 min-w-[200px]">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">
            {data.subject}
          </p>
          {data.domain && (
            <p className="text-[11px] text-slate-500 font-medium">
              Domain: {data.domain}
            </p>
          )}
          <div className="flex justify-between items-center text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF9933]" />
              Assessed Level:
            </span>
            <span className="font-mono font-bold text-amber-700">
              {assessed.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#000080]" />
              Cadre Benchmark:
            </span>
            <span className="font-mono font-bold text-indigo-900">
              {benchmark.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="pt-1 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-slate-500">Gap Status:</span>
            {delta < -0.5 ? (
              <Badge variant="destructive" size="sm">
                Gap: {Math.abs(delta).toFixed(1)}
              </Badge>
            ) : delta < 0 ? (
              <Badge variant="warning" size="sm">
                Gap: {Math.abs(delta).toFixed(1)}
              </Badge>
            ) : (
              <Badge variant="success" size="sm">
                Proficient (+{delta.toFixed(1)})
              </Badge>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">
              FRAC Competency Radar Profile
            </CardTitle>
            <Badge variant="saffron" size="sm">
              Level 1-5 Rubric
            </Badge>
          </div>
          <CardDescription>
            Direct comparison: Assessed Proficiency vs {cadreName}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="domain"
            value={viewMode}
            onValueChange={(val: any) => setViewMode(val)}
            className="w-auto"
          >
            <TabsList className="h-8">
              <TabsTrigger value="domain" className="text-xs px-2.5 py-1">
                4-Domain Summary
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2.5 py-1">
                Granular Competencies
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Domain filter if granular mode */}
        {viewMode === "all" && (
          <div className="flex flex-wrap gap-1 mb-3 pt-1 border-t border-slate-100">
            {domainsList.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition font-medium ${
                  selectedDomain === d
                    ? "bg-[#000080] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d === "ALL" ? "All Domains" : d.split(" ")[0]}
              </button>
            ))}
          </div>
        )}

        <div className="h-[340px] sm:h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={displayData}>
              <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: "12px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
              <Radar
                name={`${officerName} (Assessed)`}
                dataKey="assessed"
                stroke="#FF9933"
                fill="#FF9933"
                fillOpacity={0.45}
                strokeWidth={2}
              />
              <Radar
                name="Cadre Benchmark"
                dataKey="benchmark"
                stroke="#000080"
                fill="#000080"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF9933]" />
              Assessed Level (1.0-5.0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#000080]" />
              Cadre Target Level
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Scale: 1 (Basic) to 5 (Expert)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
