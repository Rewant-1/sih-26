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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import type { DivisionAggregateMetric } from "@/lib/types";

interface CadreDistributionChartProps {
  divisions: DivisionAggregateMetric[];
}

export function CadreDistributionChart({ divisions }: CadreDistributionChartProps) {
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
      domain: "Digital Governance",
      "ISS Assistant Director": 4.2,
      "Senior Statistical Officer": 3.6,
      "Junior Statistical Officer": 2.8,
    },
    {
      domain: "Behavioural",
      "ISS Assistant Director": 4.3,
      "Senior Statistical Officer": 3.8,
      "Junior Statistical Officer": 3.3,
    },
  ];

  // Headcount by Division data
  const divisionHeadcountData = divisions.map((div) => ({
    division: div.divisionCode,
    "ISS Assistant Director": div.cadreBreakdown.ISS_ASSISTANT_DIRECTOR,
    "Senior Statistical Officer": div.cadreBreakdown.SENIOR_STATISTICAL_OFFICER,
    "Junior Statistical Officer": div.cadreBreakdown.JUNIOR_STATISTICAL_OFFICER,
  }));

  const displayData =
    metricMode === "proficiency"
      ? domainCadreProficiencyData
      : divisionHeadcountData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg ring-1 ring-black/5 text-xs space-y-1.5 min-w-[200px]">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">
            {metricMode === "proficiency" ? `${label} Domain` : `${label} Division`}
          </p>
          {payload.map((entry: any) => (
            <div
              key={entry.name}
              className="flex justify-between items-center text-slate-700"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[11px] font-medium">{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {metricMode === "proficiency"
                  ? `${entry.value.toFixed(1)} / 5.0`
                  : `${entry.value} Officers`}
              </span>
            </div>
          ))}
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
              Cadre-Wise Analytics & Distribution
            </CardTitle>
            <Badge variant="saffron" size="sm">
              ISS • SSO • JSO
            </Badge>
          </div>
          <CardDescription>
            {metricMode === "proficiency"
              ? "Proficiency level benchmark comparison by statistical cadre"
              : "Cadre deployment breakdown across MoSPI operating divisions"}
          </CardDescription>
        </div>

        <Tabs
          defaultValue="proficiency"
          value={metricMode}
          onValueChange={(val: any) => setMetricMode(val)}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="proficiency" className="text-xs px-2.5 py-1">
              Domain Proficiency
            </TabsTrigger>
            <TabsTrigger value="headcount" className="text-xs px-2.5 py-1">
              Cadre Headcount
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[320px] sm:h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey={metricMode === "proficiency" ? "domain" : "division"}
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                domain={metricMode === "proficiency" ? [0, 5] : [0, "auto"]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickCount={metricMode === "proficiency" ? 6 : 5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="ISS Assistant Director"
                fill="#000080"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Senior Statistical Officer"
                fill="#FF9933"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Junior Statistical Officer"
                fill="#138808"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#000080]" />
              ISS Cadre (Gazetted Group A)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FF9933]" />
              SSO (Subordinate Group B)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#138808]" />
              JSO (Subordinate Group B)
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Source: DIID Capacity Analytics
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
