"use client";

import React from "react";
import {
  BookOpen,
  Building2,
  Filter,
  GraduationCap,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CompetencyDomain, CadreId, ProficiencyLevel } from "@/lib/types/frac";
import type { CourseSource, DeliveryMode } from "@/lib/types/sunbird";
import { Button } from "@/components/ui/Button";

export interface FilterState {
  source: CourseSource | "ALL";
  domain: CompetencyDomain | "ALL";
  cadre: CadreId | "ALL";
  deliveryMode: string | "ALL";
  level: ProficiencyLevel | "ALL";
  search: string;
}

export interface CatalogFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalCoursesCount: number;
  filteredCoursesCount: number;
  igotCount?: number;
  nsstaCount?: number;
}

const DOMAINS: Array<{ label: string; value: CompetencyDomain | "ALL" }> = [
  { label: "All Domains", value: "ALL" },
  { label: "Statistical Competencies", value: "Statistical Competencies" },
  { label: "Technical Competencies", value: "Technical Competencies" },
  {
    label: "Digital Governance & Data Stewardship",
    value: "Digital Governance & Data Stewardship",
  },
  {
    label: "Behavioural & Managerial",
    value: "Behavioural & Managerial Competencies",
  },
];

const CADRES: Array<{ label: string; value: CadreId | "ALL" }> = [
  { label: "All Statistical Cadres", value: "ALL" },
  { label: "ISS Assistant Director (Group A)", value: "ISS_ASSISTANT_DIRECTOR" },
  { label: "Senior Statistical Officer (Group B)", value: "SENIOR_STATISTICAL_OFFICER" },
  { label: "Junior Statistical Officer (Group B)", value: "JUNIOR_STATISTICAL_OFFICER" },
];

const DELIVERY_MODES: Array<{ label: string; value: string }> = [
  { label: "All Delivery Modes", value: "ALL" },
  { label: "Self-Paced e-Learning", value: "Self-Paced e-Learning" },
  {
    label: "Instructor-Led Classroom (NSSTA Greater Noida)",
    value: "Instructor-Led Classroom (NSSTA Greater Noida)",
  },
  { label: "Virtual Synchronous Workshop", value: "Virtual Synchronous Workshop" },
];

const PROFICIENCY_LEVELS: Array<{ label: string; value: ProficiencyLevel | "ALL" }> = [
  { label: "Any Level (1-5)", value: "ALL" },
  { label: "Level 1 (Basic)", value: 1 },
  { label: "Level 2 (Novice)", value: 2 },
  { label: "Level 3 (Proficient)", value: 3 },
  { label: "Level 4 (Advanced)", value: 4 },
  { label: "Level 5 (Expert)", value: 5 },
];

export function CatalogFilters({
  filters,
  onFilterChange,
  totalCoursesCount,
  filteredCoursesCount,
  igotCount = 0,
  nsstaCount = 0,
}: CatalogFiltersProps) {
  const activeFiltersCount =
    (filters.source !== "ALL" ? 1 : 0) +
    (filters.domain !== "ALL" ? 1 : 0) +
    (filters.cadre !== "ALL" ? 1 : 0) +
    (filters.deliveryMode !== "ALL" ? 1 : 0) +
    (filters.level !== "ALL" ? 1 : 0) +
    (filters.search.trim() ? 1 : 0);

  const handleReset = () => {
    onFilterChange({
      source: "ALL",
      domain: "ALL",
      cadre: "ALL",
      deliveryMode: "ALL",
      level: "ALL",
      search: "",
    });
  };

  const handleSourceChange = (source: CourseSource | "ALL") => {
    onFilterChange({ ...filters, source });
  };

  return (
    <div className="space-y-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Top Row: Search bar & Dual-Source Radio Pills */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course title, code (e.g. STAT-01), competency (SNA, R, SDC), or outcome..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white transition-all shadow-xs"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Badge Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200 self-start lg:self-center shrink-0">
          <button
            onClick={() => handleSourceChange("ALL")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.source === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>All Sources</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
              {totalCoursesCount}
            </span>
          </button>

          <button
            onClick={() => handleSourceChange("iGOT Karmayogi")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.source === "iGOT Karmayogi"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs"
                : "text-slate-600 hover:text-orange-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>iGOT Karmayogi</span>
            {igotCount > 0 && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  filters.source === "iGOT Karmayogi"
                    ? "bg-white/20 text-white"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {igotCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSourceChange("NSSTA TPAC")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.source === "NSSTA TPAC"
                ? "bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xs"
                : "text-slate-600 hover:text-blue-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>NSSTA TPAC</span>
            {nsstaCount > 0 && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  filters.source === "NSSTA TPAC"
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-900"
                }`}
              >
                {nsstaCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Second Row: Detailed Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        {/* Domain Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            FRAC Domain
          </label>
          <select
            value={filters.domain}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                domain: e.target.value as CompetencyDomain | "ALL",
              })
            }
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white"
          >
            {DOMAINS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cadre Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Target Cadre
          </label>
          <select
            value={filters.cadre}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                cadre: e.target.value as CadreId | "ALL",
              })
            }
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white"
          >
            {CADRES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Mode Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Delivery Mode
          </label>
          <select
            value={filters.deliveryMode}
            onChange={(e) =>
              onFilterChange({ ...filters, deliveryMode: e.target.value })
            }
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white"
          >
            {DELIVERY_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Proficiency Level Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Competency Level
          </label>
          <select
            value={filters.level}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                level:
                  e.target.value === "ALL"
                    ? "ALL"
                    : (Number(e.target.value) as ProficiencyLevel),
              })
            }
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white"
          >
            {PROFICIENCY_LEVELS.map((lvl) => (
              <option key={String(lvl.value)} value={String(lvl.value)}>
                {lvl.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips & Clear Action */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-medium">Active Filters:</span>
            {filters.source !== "ALL" && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                Source: <strong>{filters.source}</strong>
                <button
                  onClick={() => handleSourceChange("ALL")}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.domain !== "ALL" && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                Domain: <strong>{filters.domain.split(" ")[0]}</strong>
                <button
                  onClick={() => onFilterChange({ ...filters, domain: "ALL" })}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.cadre !== "ALL" && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                Cadre: <strong>{filters.cadre}</strong>
                <button
                  onClick={() => onFilterChange({ ...filters, cadre: "ALL" })}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.search.trim() && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                &ldquo;{filters.search}&rdquo;
                <button
                  onClick={() => onFilterChange({ ...filters, search: "" })}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span>Reset All ({activeFiltersCount})</span>
          </Button>
        </div>
      )}
    </div>
  );
}
