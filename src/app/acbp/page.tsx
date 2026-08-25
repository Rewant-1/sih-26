"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Building2,
  Calendar,
  Download,
  FileCheck2,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { repository } from "@/lib/storage/repository";
import type { ACBPPlan, ACBPBatchPlan } from "@/lib/types";

function ACBPContent() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user") || "usr-dir-sunita";

  const [plan, setPlan] = useState<ACBPPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await repository.getACBPPlan("2026-27");
        setPlan(data);
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
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        <Header activeUserId={userId} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
            <p className="text-[13px] font-medium text-[#475A6F]">
              Loading ACBP plan...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter batches
  const filteredBatches = plan.batches.filter((b) => {
    if (
      divisionFilter !== "ALL" &&
      !b.targetDivisions.some((div) => div.toLowerCase().includes(divisionFilter.toLowerCase()))
    ) {
      return false;
    }
    if (channelFilter !== "ALL" && b.source !== channelFilter) {
      return false;
    }
    if (priorityFilter !== "ALL" && b.priority !== priorityFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.batchId.toLowerCase().includes(q) ||
        b.courseTitle.toLowerCase().includes(q) ||
        b.targetCompetencyName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const nsstaBatches = plan.batches.filter((b) => b.source === "NSSTA TPAC");
  const igotBatches = plan.batches.filter((b) => b.source === "iGOT Karmayogi");
  const criticalBatches = plan.batches.filter((b) => b.priority === "CRITICAL");

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      <Header activeUserId={userId} />

      <div className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar currentUserId={userId} />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Executive Header Banner (Light Theme) */}
          <div className="rounded-2xl border border-[#C7C2BA] bg-white p-6 text-[#142446] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                    MoSPI Capacity Building Commission
                  </span>
                  <span className="text-xs text-[#475A6F] font-mono">
                    Financial Year 2026-27
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#142446]">
                  Annual Capacity Building Plan (ACBP 2026-27)
                </h1>
                <p className="text-xs text-[#475A6F] max-w-2xl leading-relaxed">
                  Automated strategic training plan aligning identified MoSPI competency deficits to NSSTA TPAC residential programs and iGOT self-paced courses.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      "BatchID,CourseTitle,Source,TargetCompetency,TargetDivisions,OfficersNominated,Schedule,Priority\n" +
                      plan.batches
                        .map(
                          (b) =>
                            `"${b.batchId}","${b.courseTitle}","${b.source}","${b.targetCompetencyName}","${b.targetDivisions.join("; ")}",${b.recommendedOfficersCount},"${b.scheduleWindow || "Q1 2026-27"}","${b.priority}"`
                        )
                        .join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "MoSPI_ACBP_2026-27_Batches.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-xs font-semibold border-[#C7C2BA] text-[#142446] bg-white hover:bg-[#FAF9F6]"
                >
                  <Download className="h-3.5 w-3.5 mr-1 text-[#475A6F]" />
                  Export Plan (CSV)
                </Button>
                <Link href="/dashboard/admin">
                  <Button size="sm" className="text-xs font-bold bg-[#142446] hover:bg-[#1e3460] text-white">
                    Leadership Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>Total Planned Batches</span>
                <Calendar className="h-4 w-4 text-[#D8921E]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {plan.totalBatches}
                </span>
                <span className="text-xs text-[#475A6F]">
                  FY 2026-27
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                {criticalBatches.length} critical priority batches
              </div>
            </Card>

            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>Officers Targeted</span>
                <Users className="h-4 w-4 text-[#142446]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {plan.totalOfficersTargeted.toLocaleString()}
                </span>
                <span className="text-xs text-[#475A6F]">
                  Officials
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                Across 5 MoSPI divisions
              </div>
            </Card>

            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>NSSTA Residential</span>
                <Building2 className="h-4 w-4 text-[#142446]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {nsstaBatches.length}
                </span>
                <span className="text-xs text-[#475A6F]">
                  Workshops
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                Greater Noida Campus
              </div>
            </Card>

            <Card className="p-4 bg-white border-[#C7C2BA]">
              <div className="flex items-center justify-between text-xs text-[#475A6F] font-semibold">
                <span>iGOT Karmayogi Online</span>
                <GraduationCap className="h-4 w-4 text-[#D8921E]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#142446]">
                  {igotBatches.length}
                </span>
                <span className="text-xs text-[#475A6F]">
                  Courses
                </span>
              </div>
              <div className="mt-2 text-[11px] text-[#475A6F]">
                Continuous digital learning
              </div>
            </Card>
          </div>

          {/* Batches Table & Filter Controls */}
          <div className="rounded-2xl border border-[#C7C2BA] bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#C7C2BA]/40">
              <div>
                <h3 className="text-base font-bold text-[#142446]">
                  ACBP 2026-27 Training Batch Allocation Plan
                </h3>
                <p className="text-xs text-[#475A6F] mt-0.5">
                  Showing {filteredBatches.length} of {plan.batches.length} allocated batches
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#475A6F]" />
                  <input
                    type="text"
                    placeholder="Search batch, course, skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-[#142446] placeholder:text-[#475A6F] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
                  />
                </div>

                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
                >
                  <option value="ALL">All MoSPI Divisions</option>
                  <option value="Field">FOD (Field Operations)</option>
                  <option value="Economic">ESD (Economic Statistics)</option>
                  <option value="National">NAD (National Accounts)</option>
                  <option value="Informatics">DIID (Data Informatics)</option>
                  <option value="Research">SDRD (Survey Design)</option>
                </select>

                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
                >
                  <option value="ALL">All Delivery Channels</option>
                  <option value="NSSTA TPAC">NSSTA TPAC (Residential)</option>
                  <option value="iGOT Karmayogi">iGOT Karmayogi (e-Learning)</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#C7C2BA] font-bold text-[#475A6F] uppercase tracking-wider">
                    <th className="pb-3 pr-3">Batch ID</th>
                    <th className="pb-3 px-3">Course Title</th>
                    <th className="pb-3 px-3 text-center">Channel</th>
                    <th className="pb-3 px-3">Target Competency</th>
                    <th className="pb-3 px-3">Target Divisions</th>
                    <th className="pb-3 px-3 text-center">Officers</th>
                    <th className="pb-3 px-3">Schedule</th>
                    <th className="pb-3 pl-3 text-center">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C7C2BA]/40">
                  {filteredBatches.map((batch: ACBPBatchPlan) => (
                    <tr key={batch.batchId} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 pr-3 font-mono font-bold text-[#142446]">
                        {batch.batchId}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-bold text-[#142446] line-clamp-1">
                          {batch.courseTitle}
                        </p>
                        <p className="text-[10px] text-[#475A6F]">
                          {batch.estimatedHours}h · {batch.cadreTarget.join(", ")}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                            batch.source === "NSSTA TPAC"
                              ? "bg-[#142446] text-white"
                              : "bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]"
                          }`}
                        >
                          {batch.source === "NSSTA TPAC" ? "NSSTA" : "iGOT"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#142446]">{batch.targetCompetencyName}</p>
                        <p className="text-[10px] font-mono text-[#475A6F]">
                          {batch.targetCompetencyId} · {batch.targetDomain.split(" ")[0]}
                        </p>
                      </td>
                      <td className="py-3 px-3 font-medium text-[#142446]">
                        {batch.targetDivisions.join(", ")}
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-[#142446]">
                        {batch.recommendedOfficersCount}
                      </td>
                      <td className="py-3 px-3 text-[#475A6F]">
                        {batch.scheduleWindow || "Q1 2026-27"}
                      </td>
                      <td className="py-3 pl-3 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                            batch.priority === "CRITICAL"
                              ? "bg-[#142446] text-white"
                              : "bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]"
                          }`}
                        >
                          {batch.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
        </div>
      }
    >
      <ACBPContent />
    </Suspense>
  );
}
