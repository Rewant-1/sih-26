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
import type { CourseSource } from "@/lib/types/sunbird";
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
    <div className="space-y-4 bg-white rounded-2xl border border-[#C7C2BA] p-5 shadow-xs">
      {/* Top Row: Search bar & Dual-Source Radio Pills */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475A6F]" />
          <input
            type="text"
            placeholder="Search by course title, code (e.g. STAT-01), competency (SNA, R, SDC)..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F6] border border-[#C7C2BA] rounded-xl text-sm text-[#142446] placeholder:text-[#475A6F] focus:outline-hidden focus:ring-1 focus:ring-[#142446] focus:bg-white transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475A6F] hover:text-[#142446] p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Badge Tabs (No Gradients) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F6] rounded-xl border border-[#C7C2BA] self-start lg:self-center shrink-0">
          <button
            onClick={() => handleSourceChange("ALL")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filters.source === "ALL"
                ? "bg-[#142446] text-white shadow-xs"
                : "text-[#475A6F] hover:text-[#142446]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>All Sources</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                filters.source === "ALL"
                  ? "bg-white/20 text-white"
                  : "bg-white text-[#142446] border border-[#C7C2BA]"
              }`}
            >
              {totalCoursesCount}
            </span>
          </button>

          <button
            onClick={() => handleSourceChange("iGOT Karmayogi")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filters.source === "iGOT Karmayogi"
                ? "bg-[#D8921E] text-white shadow-xs"
                : "text-[#475A6F] hover:text-[#142446]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>iGOT Karmayogi</span>
            {igotCount > 0 && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  filters.source === "iGOT Karmayogi"
                    ? "bg-white/20 text-white"
                    : "bg-white text-[#142446] border border-[#C7C2BA]"
                }`}
              >
                {igotCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSourceChange("NSSTA TPAC")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filters.source === "NSSTA TPAC"
                ? "bg-[#142446] text-white shadow-xs"
                : "text-[#475A6F] hover:text-[#142446]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>NSSTA TPAC</span>
            {nsstaCount > 0 && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  filters.source === "NSSTA TPAC"
                    ? "bg-white/20 text-white"
                    : "bg-white text-[#142446] border border-[#C7C2BA]"
                }`}
              >
                {nsstaCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Second Row: Dropdown Selects for Faceted Filtering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#C7C2BA]/40">
        {/* Domain Filter */}
        <div>
          <label className="text-[11px] font-bold text-[#475A6F] uppercase tracking-wider block mb-1">
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
            className="w-full py-2 px-3 bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-xs font-medium text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446] focus:bg-white"
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
          <label className="text-[11px] font-bold text-[#475A6F] uppercase tracking-wider block mb-1">
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
            className="w-full py-2 px-3 bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-xs font-medium text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446] focus:bg-white"
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
          <label className="text-[11px] font-bold text-[#475A6F] uppercase tracking-wider block mb-1">
            Delivery Mode
          </label>
          <select
            value={filters.deliveryMode}
            onChange={(e) =>
              onFilterChange({ ...filters, deliveryMode: e.target.value })
            }
            className="w-full py-2 px-3 bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-xs font-medium text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446] focus:bg-white"
          >
            {DELIVERY_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Competency Level Filter */}
        <div>
          <label className="text-[11px] font-bold text-[#475A6F] uppercase tracking-wider block mb-1">
            Competency Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                ...filters,
                level: val === "ALL" ? "ALL" : (Number(val) as ProficiencyLevel),
              });
            }}
            className="w-full py-2 px-3 bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg text-xs font-medium text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446] focus:bg-white"
          >
            {PROFICIENCY_LEVELS.map((l) => (
              <option key={String(l.value)} value={String(l.value)}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Indicators & Reset Button */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#C7C2BA]/40 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-[#475A6F]">
            <span className="font-semibold text-[#142446]">Active Filters:</span>
            {filters.source !== "ALL" && (
              <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] font-medium">
                Source: {filters.source}
              </span>
            )}
            {filters.domain !== "ALL" && (
              <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] font-medium">
                Domain: {filters.domain.replace(" Competencies", "")}
              </span>
            )}
            {filters.cadre !== "ALL" && (
              <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] font-medium">
                Cadre: {filters.cadre.replace("_", " ")}
              </span>
            )}
            {filters.level !== "ALL" && (
              <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] font-medium">
                Level: L{filters.level}
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] font-medium">
                &quot;{filters.search}&quot;
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-xs text-[#475A6F] hover:text-[#142446] gap-1 h-7 px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
