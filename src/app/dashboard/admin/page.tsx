"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  BarChart3,
  Building2,
  CalendarCheck2,
  ChevronRight,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  ShieldCheck,
  Target,
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
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        <Header activeUserId={userId} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
            <p className="text-[13px] font-medium text-[#475A6F]">
              Loading analytics...
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
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      <Header activeUserId={userId} />

      <div className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar currentUserId={userId} />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Page Header */}
          <div className="border border-[#C7C2BA] bg-white rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                  DIID Analytics
                </span>
                <h1 className="text-[22px] font-bold text-[#142446] mt-2">
                  Leadership Competency Dashboard
                </h1>
                <p className="text-[13px] text-[#475A6F] mt-0.5 max-w-2xl">
                  Division competency aggregates across FOD, ESD, NAD, DIID, and SDRD — mapped to FRAC and NSSTA TPAC 2026-27.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/acbp">
                  <Button size="sm" className="text-xs font-bold bg-[#D8921E] hover:bg-[#c27f14] text-white">
                    <FileCheck2 className="h-4 w-4 mr-1.5" />
                    ACBP 2026-27
                  </Button>
                </Link>
                <Link href={`/dashboard/learner?user=usr-jso-rajesh`}>
                  <Button variant="outline" size="sm" className="text-xs font-bold border-[#C7C2BA] text-[#142446] bg-white hover:bg-[#FAF9F6]">
                    Learner View
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>Statistical Officers Covered</span>
                <Users className="h-4 w-4 text-[#142446]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {totalOfficers.toLocaleString()}
                </span>
                <span className="text-xs text-[#475A6F]">
                  5 Divisions
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F] font-mono">
                {cadreLabel}
              </div>
            </Card>

            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>Avg Organizational Proficiency</span>
                <Target className="h-4 w-4 text-[#D8921E]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {avgProficiency}%
                </span>
                <span className="text-xs font-semibold text-[#142446]">
                  +4.2% YoY
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                Target Benchmark: 85.0%
              </div>
            </Card>

            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>Critical Skill Deficiencies</span>
                <AlertCircle className="h-4 w-4 text-[#142446]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {totalCriticalGaps}
                </span>
                <span className="text-xs text-[#475A6F]">
                  Priority Cases
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                Highest in {worstDivision.divisionCode || worstDivision.divisionName.split(" ")[0]} ({worstDivision.criticalGapsCount})
              </div>
            </Card>

            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>Planned ACBP Batches</span>
                <CalendarCheck2 className="h-4 w-4 text-[#D8921E]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {acbpPlan.totalBatches}
                </span>
                <span className="text-xs text-[#475A6F]">
                  Batches (2026-27)
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                {acbpPlan.totalOfficersTargeted} Officers Targeted
              </div>
            </Card>
          </div>

          {/* Row 1: Division Competency Heatmap Matrix */}
          <div>
            <DivisionHeatmap divisions={divisions} />
          </div>

          {/* Row 1.5: Gap Reduction Trend Chart */}
          <GapTrendChart divisions={divisions} />

          {/* Row 3: Cadre Analytics & Top Shortages */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex">
              <CadreDistributionChart divisions={divisions} />
            </div>

            <div className="lg:col-span-4 flex">
              <Card className="w-full flex flex-col justify-between border-[#C7C2BA] bg-white">
                <CardHeader className="pb-3 border-b border-[#C7C2BA]/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-[#142446] font-bold">
                      Top Systemic Shortages
                    </CardTitle>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                      Urgent
                    </span>
                  </div>
                  <CardDescription className="text-xs text-[#475A6F]">
                    Highest aggregate competency gaps across MoSPI
                  </CardDescription>
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

                  <Link href="/acbp" className="block pt-2">
                    <Button size="sm" className="w-full text-xs font-bold bg-[#142446] hover:bg-[#1e3460] text-white">
                      View Training Remediation Plan →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Row 4: ACBP Recommendation Table Component */}
          <div>
            <ACBPRecommendationTable plan={acbpPlan} />
          </div>
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
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
