"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingDown } from "lucide-react";

// ponytail: hardcoded quarterly data, replace with real API if/when available
const QUARTERLY_DATA = [
  { quarter: "Q1 2025", criticalGaps: 312, avgProficiency: 62.1 },
  { quarter: "Q2 2025", criticalGaps: 289, avgProficiency: 64.8 },
  { quarter: "Q3 2025", criticalGaps: 261, avgProficiency: 67.3 },
  { quarter: "Q4 2025", criticalGaps: 234, avgProficiency: 70.0 },
  { quarter: "Q1 2026", criticalGaps: 218, avgProficiency: 72.4 },
  { quarter: "Q2 2026", criticalGaps: 198, avgProficiency: 74.6 },
];

export function GapTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Gap Reduction Trend (Quarterly)
            </CardTitle>
            <CardDescription>
              Organization-wide critical skill deficiency count over time
            </CardDescription>
          </div>
          <Badge variant="success" size="sm" className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            -36.5% since Q1 2025
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={QUARTERLY_DATA}
              margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="quarter"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                domain={[150, 350]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`${value} critical gaps`, "Deficiency Count"]}
              />
              <ReferenceLine
                y={200}
                stroke="#f59e0b"
                strokeDasharray="6 4"
                label={{
                  value: "Target: 200",
                  position: "right",
                  fill: "#f59e0b",
                  fontSize: 10,
                }}
              />
              <Line
                type="monotone"
                dataKey="criticalGaps"
                stroke="#000080"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#000080", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#FF9933" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 text-center">
          Based on quarterly FRAC assessment aggregation across FOD, ESD, NAD, DIID, and SDRD divisions.
        </p>
      </CardContent>
    </Card>
  );
}
