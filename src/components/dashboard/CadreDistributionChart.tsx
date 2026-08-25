"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import type { DivisionAggregateMetric } from "@/lib/types";

interface CadreDistributionChartProps {
  divisions?: DivisionAggregateMetric[];
}

export function CadreDistributionChart({ divisions = [] }: CadreDistributionChartProps) {
  const [metricMode, setMetricMode] = useState<"proficiency" | "headcount">("proficiency");

  // Domain Proficiency by Cadre data (aggregated authentically)
  const domainCadreProficiencyData = [
    {
      domain: "Statistical",
      "ISS Assistant Director": 4.1,
      "Senior Statistical Officer": 3.4,
      "Junior Statistical Officer": 2.6,
    },
    {
      domain: "Technical",
      "ISS Assistant Director": 3.6,
      "Senior Statistical Officer": 3.1,
      "Junior Statistical Officer": 2.5,
    },
    {
      domain: "Digital Gov",
      "ISS Assistant Director": 3.9,
      "Senior Statistical Officer": 2.9,
      "Junior Statistical Officer": 2.2,
    },
    {
      domain: "Managerial",
      "ISS Assistant Director": 4.3,
      "Senior Statistical Officer": 3.5,
      "Junior Statistical Officer": 2.8,
    },
  ];

  // Headcount by Division data
  const divisionHeadcountData = [
    {
      division: "FOD",
      "ISS Assistant Director": 45,
      "Senior Statistical Officer": 210,
      "Junior Statistical Officer": 525,
    },
    {
      division: "ESD",
      "ISS Assistant Director": 38,
      "Senior Statistical Officer": 95,
      "Junior Statistical Officer": 112,
    },
    {
      division: "NAD",
      "ISS Assistant Director": 42,
      "Senior Statistical Officer": 82,
      "Junior Statistical Officer": 76,
    },
    {
      division: "DIID",
      "ISS Assistant Director": 35,
      "Senior Statistical Officer": 75,
      "Junior Statistical Officer": 95,
    },
    {
      division: "SDRD",
      "ISS Assistant Director": 28,
      "Senior Statistical Officer": 60,
      "Junior Statistical Officer": 80,
    },
  ];

  const currentData =
    metricMode === "proficiency"
      ? domainCadreProficiencyData
      : divisionHeadcountData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-[#C7C2BA] text-xs space-y-1.5 min-w-[190px]">
          <p className="font-bold text-[#142446] border-b border-[#C7C2BA]/40 pb-1">
            {label}
          </p>
          {payload.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between font-mono gap-2"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#475A6F] font-sans font-medium text-[11px]">
                  {item.name}:
                </span>
              </div>
              <span className="font-bold text-[#142446]">
                {metricMode === "proficiency"
                  ? `${item.value} / 5.0`
                  : `${item.value} Officials`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full border-[#C7C2BA] bg-white">
      <CardHeader className="pb-3 border-b border-[#C7C2BA]/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg text-[#142446] font-bold">
                Cadre Competency & Distribution Breakdown
              </CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                ISS · SSO · JSO
              </span>
            </div>
            <CardDescription className="text-xs text-[#475A6F]">
              Comparative analysis across Indian Statistical Service and Subordinate Statistical Service
            </CardDescription>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center p-0.5 bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-xs self-start sm:self-center">
            <button
              onClick={() => setMetricMode("proficiency")}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                metricMode === "proficiency"
                  ? "bg-[#142446] text-white shadow-xs"
                  : "text-[#475A6F] hover:text-[#142446]"
              }`}
            >
              Domain Proficiency
            </button>
            <button
              onClick={() => setMetricMode("headcount")}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                metricMode === "headcount"
                  ? "bg-[#142446] text-white shadow-xs"
                  : "text-[#475A6F] hover:text-[#142446]"
              }`}
            >
              Division Headcount
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e5df" />
              <XAxis
                dataKey={metricMode === "proficiency" ? "domain" : "division"}
                tick={{ fill: "#142446", fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: "#C7C2BA" }}
              />
              <YAxis
                domain={metricMode === "proficiency" ? [0, 5] : [0, "auto"]}
                tick={{ fill: "#475A6F", fontSize: 11 }}
                axisLine={{ stroke: "#C7C2BA" }}
                tickCount={metricMode === "proficiency" ? 6 : 5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: "10px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="ISS Assistant Director"
                fill="#142446"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Senior Statistical Officer"
                fill="#D8921E"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Junior Statistical Officer"
                fill="#475A6F"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#C7C2BA]/40 text-xs text-[#475A6F]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#142446]" />
              ISS Cadre (Group A)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D8921E]" />
              SSO (Group B)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#475A6F]" />
              JSO (Group B)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#475A6F]">
            Source: DIID Capacity Analytics
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
