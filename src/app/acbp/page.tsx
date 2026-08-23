"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileSpreadsheet,
  Flame,
  GraduationCap,
  Layers,
  MapPin,
  Printer,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { ACBPRecommendationTable } from "@/components/dashboard/ACBPRecommendationTable";
import { repository } from "@/lib/storage/repository";
import type { ACBPPlan, DivisionAggregateMetric } from "@/lib/types";

function ACBPPageContent() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user") || "usr-dir-sunita";

  const [plan, setPlan] = useState<ACBPPlan | null>(null);
  const [divisions, setDivisions] = useState<DivisionAggregateMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [planData, divData] = await Promise.all([
          repository.getACBPPlan("2026-27"),
          repository.getDivisionAggregateData(),
        ]);
        setPlan(planData);
        setDivisions(divData);
      } catch (err) {
        console.error("Failed to load ACBP plan:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading || !plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Header activeUserId={userId} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#000080] border-t-transparent" />
            <p className="text-sm font-semibold text-slate-600">
              Compiling Annual Capacity Building Plan (ACBP 2026-27)...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const nsstaBatches = plan.batches.filter((b) => b.source === "NSSTA TPAC");
  const igotBatches = plan.batches.filter((b) => b.source === "iGOT Karmayogi");
  const criticalBatches = plan.batches.filter((b) => b.priority === "CRITICAL");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header activeUserId={userId} />

      <div className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar currentUserId={userId} />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Executive Header Banner */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#000080] via-[#0B132B] to-slate-900 p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="saffron" size="sm">
                    MoSPI Capacity Building Commission
                  </Badge>
                  <span className="text-xs text-slate-300 font-mono">
                    Financial Year 2026-27
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Annual Capacity Building Plan (ACBP 2026-27)
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Automated strategic training plan aligning identified MoSPI
                  competency deficits to NSSTA TPAC residential programs and iGOT
                  Karmayogi digital learning modules.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="saffron"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs font-semibold"
                >
                  <Printer className="h-4 w-4 mr-1.5" />
                  Print Official Summary
                </Button>
                <Link href="/dashboard/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Division Analytics →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Key Capacity Building Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Targeted Officers</span>
                <Users className="h-4 w-4 text-[#000080]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {plan.totalOfficersTargeted}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Nominations
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Covers ~36% of all statistical personnel
              </div>
            </Card>

            {/* Metric 2 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Training Batches</span>
                <Calendar className="h-4 w-4 text-[#FF9933]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-[#000080]">
                  {plan.totalBatches}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Planned Batches
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                {nsstaBatches.length} NSSTA • {igotBatches.length} iGOT
              </div>
            </Card>

            {/* Metric 3 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Critical Priority Batches</span>
                <Flame className="h-4 w-4 text-rose-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-rose-600">
                  {criticalBatches.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Urgent Actions
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Addressing Microdata, Time Series & SDC
              </div>
            </Card>

            {/* Metric 4 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>NSSTA Greater Noida Venue</span>
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-blue-900">
                  {nsstaBatches.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Residential Batches
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                TPAC 2026-27 Approved
              </div>
            </Card>
          </div>

          {/* Division Allocation Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {divisions.map((div) => {
              const count = plan.summaryByDivision[div.divisionName] || 0;
              return (
                <div
                  key={div.divisionCode}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {div.divisionCode}
                    </span>
                    <Badge variant="navy" size="sm">
                      {count} Officers
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {div.divisionName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Total Strength: {div.totalOfficers}
                  </p>
                  <Progress
                    value={Math.round((count / div.totalOfficers) * 100)}
                    variant="saffron"
                    size="sm"
                    className="mt-1"
                  />
                </div>
              );
            })}
          </div>

          {/* Main Interactive ACBP Table */}
          <ACBPRecommendationTable plan={plan} showExportButton={true} />

          {/* Execution Guidelines Box */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#000080]" />
                <CardTitle className="text-sm font-bold text-[#000080]">
                  ACBP 2026-27 Implementation Directives
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-slate-700 space-y-2">
              <p>
                1. <strong>Subordinate Statistical Cadre Priority</strong>: 70% of
                NSSTA residential batch seats are reserved for JSO/SSO officers
                with identified deficits in Microdata Validation (<code>TECH_VAL_05</code>)
                and Survey Sampling (<code>STAT_SMPL_01</code>).
              </p>
              <p>
                2. <strong>iGOT e-Learning Compliance</strong>: Officers nominated
                for digital batches must complete the modules on iGOT Karmayogi
                Bharat within 45 days of enrollment to receive official FRAC
                competency credentialing.
              </p>
              <p>
                3. <strong>Annual Reporting</strong>: All batch completion records
                are automatically synchronized with the MoSPI DIID Central Skill
                Repository.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function ACBPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#000080] border-t-transparent" />
        </div>
      }
    >
      <ACBPPageContent />
    </Suspense>
  );
}
