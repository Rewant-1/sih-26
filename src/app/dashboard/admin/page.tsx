"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertOctagon,
  Award,
  BarChart3,
  Building2,
  CalendarCheck2,
  ChevronRight,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Flame,
  GraduationCap,
  Layers,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DivisionHeatmap } from "@/components/dashboard/DivisionHeatmap";
import { CadreDistributionChart } from "@/components/dashboard/CadreDistributionChart";
import { ACBPRecommendationTable } from "@/components/dashboard/ACBPRecommendationTable";
import { GapTrendChart } from "@/components/dashboard/GapTrendChart";
import { repository } from "@/lib/storage/repository";
import type { DivisionAggregateMetric, ACBPPlan } from "@/lib/types";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user") || "usr-dir-sunita";

  const [divisions, setDivisions] = useState<DivisionAggregateMetric[]>([]);
  const [acbpPlan, setAcbpPlan] = useState<ACBPPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [divData, planData] = await Promise.all([
          repository.getDivisionAggregateData(),
          repository.getACBPPlan("2026-27"),
        ]);
        setDivisions(divData);
        setAcbpPlan(planData);
      } catch (err) {
        console.error("Failed to load admin analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading || !acbpPlan || divisions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Header activeUserId={userId} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#000080] border-t-transparent" />
            <p className="text-sm font-semibold text-slate-600">
              Aggregating MoSPI Division Analytics & ACBP Matrix...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate high-level KPIs from division data
  const totalOfficers = divisions.reduce((acc, d) => acc + d.totalOfficers, 0);
  const avgProficiency = Number(
    (
      divisions.reduce((acc, d) => acc + d.overallProficiency, 0) /
      divisions.length
    ).toFixed(1)
  );
  const totalCriticalGaps = divisions.reduce(
    (acc, d) => acc + d.criticalGapsCount,
    0
  );

  // Compute cadre breakdown from division data
  const cadreAgg: Record<string, number> = {};
  for (const d of divisions) {
    if (d.cadreBreakdown) {
      for (const [cadre, count] of Object.entries(d.cadreBreakdown)) {
        cadreAgg[cadre] = (cadreAgg[cadre] || 0) + (count as number);
      }
    }
  }
  const cadreLabel = Object.entries(cadreAgg)
    .map(([k, v]) => {
      const short = k.includes("ASSISTANT") ? "ISS AD" : k.includes("SENIOR") ? "SSO" : "JSO";
      return `${short}: ${v}`;
    })
    .join(" • ");

  // Compute top shortages from division deficiency data
  const shortageMap: Record<string, { id: string; name: string; gap: number; divisions: string[] }> = {};
  for (const d of divisions) {
    for (const def of d.topDeficientCompetencies || []) {
      if (!shortageMap[def.competencyId]) {
        shortageMap[def.competencyId] = { id: def.competencyId, name: def.competencyName, gap: 0, divisions: [] };
      }
      shortageMap[def.competencyId].gap = Math.max(shortageMap[def.competencyId].gap, def.gap);
      shortageMap[def.competencyId].divisions.push(d.divisionCode || d.divisionName);
    }
  }
  const topShortages = Object.values(shortageMap)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  // Derive highest-gap division for display
  const worstDivision = [...divisions].sort((a, b) => b.criticalGapsCount - a.criticalGapsCount)[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header activeUserId={userId} />

      <div className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar currentUserId={userId} />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Executive Header Banner */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#000080] via-[#0B132B] to-slate-950 p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="saffron" size="sm">
                    DIID Executive Intelligence
                  </Badge>
                  <span className="text-xs text-slate-300 font-mono">
                    MoSPI Division Competency Matrix
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Leadership Competency & Capacity Dashboard
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Real-time aggregation across FOD, ESD, NAD, DIID, and SDRD. Mapped to Mission Karmayogi FRAC framework and NSSTA TPAC 2026-27 training planner.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href="/acbp">
                  <Button variant="saffron" size="sm" className="text-xs font-semibold">
                    <FileCheck2 className="h-4 w-4 mr-1.5" />
                    ACBP 2026-27 Plan
                  </Button>
                </Link>
                <Link href="/dashboard/learner">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Learner Profile View →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Organizational KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Statistical Officers Covered</span>
                <Users className="h-4 w-4 text-[#000080]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {totalOfficers.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  5 Divisions
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                {cadreLabel}
              </div>
            </Card>

            {/* KPI 2 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Avg Organizational Proficiency</span>
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {avgProficiency}%
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +4.2% YoY
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                Target Benchmark: 85.0%
              </div>
            </Card>

            {/* KPI 3 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Critical Skill Deficiencies</span>
                <Flame className="h-4 w-4 text-rose-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-rose-600">
                  {totalCriticalGaps}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Priority Cases
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Highest in {worstDivision.divisionCode || worstDivision.divisionName.split(" ")[0]} ({worstDivision.criticalGapsCount})
              </div>
            </Card>

            {/* KPI 4 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Planned ACBP Batches</span>
                <CalendarCheck2 className="h-4 w-4 text-[#FF9933]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-[#000080]">
                  {acbpPlan.totalBatches}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Batches (2026-27)
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                {acbpPlan.totalOfficersTargeted} Officers Targeted
              </div>
            </Card>
          </div>

          {/* Row 1: Division Heatmap Matrix */}
          <DivisionHeatmap divisions={divisions} />

          {/* Row 1.5: Gap Reduction Trend Chart */}
          <GapTrendChart divisions={divisions} />

          {/* Row 2: Cadre Analytics Bar Chart & High-Deficiency Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Cadre Distribution Chart */}
            <div className="lg:col-span-8 flex">
              <CadreDistributionChart divisions={divisions} />
            </div>

            {/* Right: Critical Organizational Skill Shortages */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Top Systemic Shortages
                      </CardTitle>
                      <CardDescription>
                        Highest aggregate competency gaps across MoSPI
                      </CardDescription>
                    </div>
                    <Badge variant="destructive" size="sm">
                      Urgent
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topShortages.map((shortage, idx) => {
                    const isCritical = shortage.gap >= 0.9;
                    return (
                      <div
                        key={shortage.id}
                        className={`p-3 rounded-lg border space-y-1 ${
                          isCritical
                            ? "border-rose-200 bg-rose-50/50"
                            : "border-amber-200 bg-amber-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-900">
                            {shortage.id}
                          </span>
                          <Badge variant={isCritical ? "destructive" : "warning"} size="sm">
                            Gap: -{shortage.gap.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-slate-900">
                          {shortage.name}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {shortage.divisions.length > 1
                            ? `Affects ${shortage.divisions.length} divisions (${shortage.divisions.join(", ")})`
                            : `Primary impact: ${shortage.divisions[0]}`}
                        </p>
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <Link href="/acbp">
                      <Button variant="navy" size="sm" className="w-full text-xs h-8">
                        View Training Remediation Plan →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Row 3: ACBP 2026-27 Batch Planner Preview */}
          <ACBPRecommendationTable plan={acbpPlan} />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#000080] border-t-transparent" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
