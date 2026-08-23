"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Download,
  ExternalLink,
  Filter,
  Flame,
  GraduationCap,
  Layers,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ACBPBatchPlan, ACBPPlan } from "@/lib/types";

interface ACBPRecommendationTableProps {
  plan: ACBPPlan;
  showExportButton?: boolean;
}

export function ACBPRecommendationTable({
  plan,
  showExportButton = true,
}: ACBPRecommendationTableProps) {
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");

  const divisionsList = [
    "ALL",
    "Field Operations Division",
    "Economic Statistics Division",
    "National Accounts Division",
    "Data Informatics and Innovation Division",
    "Survey Design and Research Division",
  ];

  const filteredBatches = plan.batches.filter((batch) => {
    // Search query
    if (search) {
      const q = search.toLowerCase();
      const matchSearch =
        batch.batchId.toLowerCase().includes(q) ||
        batch.courseTitle.toLowerCase().includes(q) ||
        batch.targetCompetencyName.toLowerCase().includes(q) ||
        batch.targetCompetencyId.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Source filter
    if (selectedSource !== "ALL" && batch.source !== selectedSource) {
      return false;
    }

    // Priority filter
    if (selectedPriority !== "ALL" && batch.priority !== selectedPriority) {
      return false;
    }

    // Division filter
    if (
      selectedDivision !== "ALL" &&
      !batch.targetDivisions.some((d) => d.includes(selectedDivision))
    ) {
      return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      "Batch ID",
      "Course Title",
      "Source",
      "Target Domain",
      "Competency ID",
      "Target Competency",
      "Target Divisions",
      "Target Cadres",
      "Officers Count",
      "Hours",
      "Schedule Window",
      "Priority",
    ];

    const rows = filteredBatches.map((b) => [
      `"${b.batchId}"`,
      `"${b.courseTitle}"`,
      `"${b.source}"`,
      `"${b.targetDomain}"`,
      `"${b.targetCompetencyId}"`,
      `"${b.targetCompetencyName}"`,
      `"${b.targetDivisions.join("; ")}"`,
      `"${b.cadreTarget.join("; ")}"`,
      b.recommendedOfficersCount,
      b.estimatedHours,
      `"${b.scheduleWindow || "Q2-Q3 2026"}"`,
      `"${b.priority}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ACBP_Plan_${plan.year}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">
                ACBP 2026-27 Training Batch Allocation Plan
              </CardTitle>
              <Badge variant="navy" size="sm">
                {filteredBatches.length} Batches
              </Badge>
            </div>
            <CardDescription>
              Annual Capacity Building Plan generated from aggregate MoSPI
              competency gaps
            </CardDescription>
          </div>

          {showExportButton && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="text-xs h-8"
              >
                <Download className="h-3.5 w-3.5 mr-1 text-[#000080]" />
                Export CSV
              </Button>
              <Link href="/acbp">
                <Button variant="navy" size="sm" className="text-xs h-8">
                  Full Plan View →
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search batch, course, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#000080] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-[#000080] focus:bg-white focus:outline-none"
          >
            <option value="ALL">All MoSPI Divisions</option>
            {divisionsList.filter((d) => d !== "ALL").map((div) => (
              <option key={div} value={div}>
                {div.split(" ")[0]} ({div})
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-[#000080] focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Delivery Channels</option>
            <option value="iGOT Karmayogi">iGOT Karmayogi (e-Learning)</option>
            <option value="NSSTA TPAC">NSSTA TPAC (Residential/Classroom)</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-[#000080] focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3 min-w-[200px]">Course Title</th>
                <th className="py-2.5 px-2 text-center">Channel</th>
                <th className="py-2.5 px-3 min-w-[160px]">Target Competency</th>
                <th className="py-2.5 px-2">Target Division</th>
                <th className="py-2.5 px-2 text-center">Officers</th>
                <th className="py-2.5 px-2 text-center">Schedule</th>
                <th className="py-2.5 px-2 text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-slate-500 font-medium bg-slate-50/50"
                  >
                    No training batches match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  const isNSSTA = batch.source === "NSSTA TPAC";
                  const isCritical = batch.priority === "CRITICAL";

                  return (
                    <tr
                      key={batch.batchId}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-[11px]">
                        {batch.batchId}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <Link
                            href={`/catalog?search=${encodeURIComponent(
                              batch.courseTitle
                            )}`}
                            className="font-semibold text-slate-900 hover:text-[#000080] hover:underline leading-snug"
                          >
                            {batch.courseTitle}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {batch.estimatedHours}h • {batch.cadreTarget.join(", ")}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <Badge
                          variant={isNSSTA ? "nssta" : "igot"}
                          size="sm"
                          className="text-[10px]"
                        >
                          {isNSSTA ? "NSSTA" : "iGOT"}
                        </Badge>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 line-clamp-1">
                            {batch.targetCompetencyName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {batch.targetCompetencyId} • {batch.targetDomain.split(" ")[0]}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-2">
                        <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {batch.targetDivisions[0]?.split(" ")[0] || "All"}
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900">
                        {batch.recommendedOfficersCount}
                      </td>

                      <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-600">
                        {batch.scheduleWindow || "Q2 2026"}
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        {isCritical ? (
                          <Badge variant="destructive" size="sm" className="text-[10px]">
                            <Flame className="h-2.5 w-2.5 mr-0.5" />
                            Critical
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm" className="text-[10px]">
                            High
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
