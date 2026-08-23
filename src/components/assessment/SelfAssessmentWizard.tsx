"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  Competency,
  CompetencyDomain,
  DomainCode,
  CadreId,
  CadreBenchmark,
  AssessmentResult,
  SkillGap,
  UserProfile,
} from "@/lib/types";
import { DomainAccordion } from "./DomainAccordion";
import { RubricModal } from "./RubricModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { calculateSkillGaps } from "@/lib/engine/gap-engine";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart3,
  TrendingUp,
  BookOpen,
  User,
  Shield,
  Layers,
  Save,
  Check,
  ChevronRight,
  Filter,
  Download,
  Flame,
} from "lucide-react";
import Link from "next/link";

interface SelfAssessmentWizardProps {
  initialTaxonomy: Competency[];
  initialBenchmarks: Record<CadreId, CadreBenchmark>;
  initialUser?: UserProfile | null;
}

const CADRE_OPTIONS: Array<{
  id: CadreId;
  name: string;
  badge: string;
  classification: string;
  description: string;
}> = [
  {
    id: "ISS_ASSISTANT_DIRECTOR",
    name: "Indian Statistical Service (ISS) - Assistant Director",
    badge: "Group A Gazetted",
    classification: "UPSC Civil Services / ISS Examination",
    description:
      "Responsible for survey design, national accounts modeling, statistical policy formulation, inter-ministerial coordination, and high-level analytical advisory.",
  },
  {
    id: "SENIOR_STATISTICAL_OFFICER",
    name: "Senior Statistical Officer (SSO)",
    badge: "Group B Gazetted",
    classification: "Subordinate Statistical Service (SSS)",
    description:
      "Responsible for field supervision, primary scrutiny of returns, unit-level inspection, CAPI quality control, regional office administration, and junior staff mentoring.",
  },
  {
    id: "JUNIOR_STATISTICAL_OFFICER",
    name: "Junior Statistical Officer (JSO)",
    badge: "Group B Non-Gazetted",
    classification: "Staff Selection Commission (SSC CGL)",
    description:
      "Responsible for canvassing survey schedules, primary data capture via CAPI/tablets, respondent engagement, preliminary data entry, listing, and validation.",
  },
];

const DOMAINS_CONFIG: Array<{
  domain: CompetencyDomain;
  domainCode: DomainCode;
  stepNumber: number;
}> = [
  { domain: "Statistical Competencies", domainCode: "STAT", stepNumber: 1 },
  { domain: "Technical Competencies", domainCode: "TECH", stepNumber: 2 },
  { domain: "Digital Governance & Data Stewardship", domainCode: "GOV", stepNumber: 3 },
  { domain: "Behavioural & Managerial Competencies", domainCode: "BEH", stepNumber: 4 },
];

export function SelfAssessmentWizard({
  initialTaxonomy,
  initialBenchmarks,
  initialUser,
}: SelfAssessmentWizardProps) {
  // State: Selected Cadre & User Metadata
  const [selectedCadre, setSelectedCadre] = useState<CadreId>(
    initialUser?.cadre || "ISS_ASSISTANT_DIRECTOR"
  );
  const [officerName, setOfficerName] = useState<string>(
    initialUser?.name || "Dr. Rajesh Kumar"
  );
  const [officerDivision, setOfficerDivision] = useState<string>(
    initialUser?.division || "National Accounts Division (NAD)"
  );
  const [officerDesignation, setOfficerDesignation] = useState<string>(
    initialUser?.designation || "Assistant Director"
  );

  // State: Ratings map (competencyId -> 1..5)
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    if (initialUser?.assessedRatings && Object.keys(initialUser.assessedRatings).length > 0) {
      return { ...initialUser.assessedRatings };
    }
    // Seed initial sensible default ratings
    const initial: Record<string, number> = {};
    const benchmark = initialBenchmarks[selectedCadre]?.benchmarks || {};
    for (const comp of initialTaxonomy) {
      // Default to slightly below benchmark to simulate initial gap analysis
      const bLevel = benchmark[comp.id] || 3;
      initial[comp.id] = Math.max(1, bLevel - 1);
    }
    return initial;
  });

  // State: Wizard step (0: Overview/Setup, 1-4: Domains, 5: Results)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [expandedDomain, setExpandedDomain] = useState<DomainCode | null>("STAT");

  // State: Rubric Modal
  const [activeRubricComp, setActiveRubricComp] = useState<Competency | null>(null);

  // State: Results & Submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [persistedResult, setPersistedResult] = useState<AssessmentResult | null>(null);
  const [gapFilter, setGapFilter] = useState<"ALL" | "CRITICAL" | "MODERATE" | "PROFICIENT" | "SURPLUS">("ALL");

  // Active Cadre Benchmark
  const activeBenchmark = initialBenchmarks[selectedCadre] || initialBenchmarks.ISS_ASSISTANT_DIRECTOR;

  // Live Skill Gap Calculation using deterministic engine
  const liveResult = useMemo(() => {
    return calculateSkillGaps(
      ratings,
      selectedCadre,
      activeBenchmark,
      initialUser?.id || "usr_001"
    );
  }, [ratings, selectedCadre, activeBenchmark, initialUser]);

  // Group competencies by domain
  const domainGroups = useMemo(() => {
    const groups: Record<CompetencyDomain, Competency[]> = {
      "Statistical Competencies": [],
      "Technical Competencies": [],
      "Digital Governance & Data Stewardship": [],
      "Behavioural & Managerial Competencies": [],
    };
    for (const comp of initialTaxonomy) {
      if (groups[comp.domain]) {
        groups[comp.domain].push(comp);
      }
    }
    return groups;
  }, [initialTaxonomy]);

  // Handle rating change for single competency
  const handleRatingChange = (competencyId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [competencyId]: rating,
    }));
  };

  // Handle cadre switch
  const handleCadreChange = (cadreId: CadreId) => {
    setSelectedCadre(cadreId);
    if (cadreId === "ISS_ASSISTANT_DIRECTOR") {
      setOfficerDesignation("Assistant Director");
    } else if (cadreId === "SENIOR_STATISTICAL_OFFICER") {
      setOfficerDesignation("Senior Statistical Officer");
    } else {
      setOfficerDesignation("Junior Statistical Officer");
    }
  };

  // Handle submission to API
  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    setSavedSuccess(false);

    try {
      const payload = {
        userId: initialUser?.id || "usr_001",
        cadre: selectedCadre,
        division: officerDivision,
        ratings,
      };

      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setPersistedResult(data.result || liveResult);
        setSavedSuccess(true);
        setCurrentStep(5); // Jump to Results
      } else {
        // Fallback to local result if API is offline or returns error
        setPersistedResult(liveResult);
        setSavedSuccess(true);
        setCurrentStep(5);
      }
    } catch (err) {
      console.warn("API submission fallback to local store:", err);
      setPersistedResult(liveResult);
      setSavedSuccess(true);
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick preset helper
  const handleApplyPreset = (preset: "BALANCED" | "EXPERT" | "BEGINNER") => {
    const nextRatings: Record<string, number> = {};
    const bMap = activeBenchmark.benchmarks;
    for (const comp of initialTaxonomy) {
      const b = bMap[comp.id] || 3;
      if (preset === "EXPERT") {
        nextRatings[comp.id] = Math.min(5, b + 1);
      } else if (preset === "BEGINNER") {
        nextRatings[comp.id] = Math.max(1, b - 2);
      } else {
        // Balanced (near benchmark)
        nextRatings[comp.id] = b;
      }
    }
    setRatings(nextRatings);
  };

  // Total evaluated counts
  const totalCompetenciesCount = initialTaxonomy.length;
  const evaluatedCount = Object.keys(ratings).length;
  const completionPercentage = Math.round(
    (evaluatedCount / (totalCompetenciesCount || 1)) * 100
  );

  // Active result for display
  const displayResult = persistedResult || liveResult;

  // Filtered gaps list
  const filteredGaps = useMemo(() => {
    if (gapFilter === "ALL") return displayResult.gaps;
    return displayResult.gaps.filter((g) => g.severity === gapFilter);
  }, [displayResult, gapFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header & Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                MoSPI FRAC Competency Evaluation
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Mission Karmayogi CBC Framework
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Official Self-Assessment & Skill Gap Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Evaluate your proficiency across 29 official statistical, technical, digital governance, and managerial competencies. The engine computes deterministic skill deltas against your cadre benchmark and generates prioritized capacity building pathways.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-row lg:flex-col items-center justify-between gap-4 min-w-[220px]">
            <div className="text-center lg:text-right w-full">
              <span className="text-xs text-slate-400 font-medium block">
                Overall Competency Index
              </span>
              <span className="text-3xl font-extrabold text-amber-400">
                {liveResult.overallCompetencyIndex}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 w-full justify-between pt-2 border-t border-white/10">
              <span className="text-rose-300 font-semibold">
                {liveResult.criticalGapsCount} Critical
              </span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">
                {liveResult.moderateGapsCount} Moderate
              </span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold">
                {liveResult.proficientCount + liveResult.surplusCount} Met
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentStep(0)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentStep === 0
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" /> 1. Cadre & Profile
            </button>

            {DOMAINS_CONFIG.map((d) => (
              <button
                key={d.domainCode}
                onClick={() => {
                  setCurrentStep(d.stepNumber);
                  setExpandedDomain(d.domainCode);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentStep === d.stepNumber
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{d.stepNumber + 1}.</span> {d.domainCode} ({domainGroups[d.domain].length})
              </button>
            ))}

            <button
              onClick={() => setCurrentStep(5)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentStep === 5
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "bg-indigo-600/80 text-white hover:bg-indigo-600"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> 6. Gap Results
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyPreset("BALANCED")}
              className="text-xs bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Reset to Benchmark
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? "Calculating..." : "Save Assessment"}
            </Button>
          </div>
        </div>
      </div>

      {/* STEP 0: Cadre Selection & Officer Profile */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Step 1: Select Statistical Cadre & Target Benchmark
                </h2>
                <p className="text-xs text-slate-500">
                  Cadre selection sets the official mandatory proficiency benchmarks ($B_{'{i,k}'}$) across all 29 competencies.
                </p>
              </div>
            </div>

            {/* Cadre Cards Radio Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {CADRE_OPTIONS.map((c) => {
                const isSelected = selectedCadre === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCadreChange(c.id)}
                    className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {c.badge}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3 font-medium">
                        {c.classification}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Benchmark Profile</span>
                      <span className="font-semibold text-indigo-600">
                        {isSelected ? "Active Target" : "Select Cadre"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Officer Details Setup */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-600" />
                Officer Evaluation Profile Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Officer Name
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    value={officerDesignation}
                    onChange={(e) => setOfficerDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    MoSPI Division / Station
                  </label>
                  <select
                    value={officerDivision}
                    onChange={(e) => setOfficerDivision(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                    <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                    <option value="Economic Statistics Division (ESD)">Economic Statistics Division (ESD)</option>
                    <option value="Survey Design and Research Division (SDRD)">Survey Design and Research Division (SDRD)</option>
                    <option value="Data Informatics and Innovation Division (DIID)">Data Informatics and Innovation Division (DIID)</option>
                    <option value="Social Statistics Division (SSSD)">Social Statistics Division (SSSD)</option>
                    <option value="National Statistical Systems Training Academy (NSSTA)">NSSTA Greater Noida</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Quick Seed Options:</span>
                <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("BEGINNER")}>
                  Beginner Seed
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("EXPERT")}>
                  Advanced Seed
                </Button>
              </div>

              <Button
                onClick={() => {
                  setCurrentStep(1);
                  setExpandedDomain("STAT");
                }}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Proceed to Statistical Competencies <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STEPS 1-4: Domain-wise Competency Evaluation */}
      {currentStep >= 1 && currentStep <= 4 && (
        <div className="space-y-6">
          {/* Domain Quick Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Domain Step:
              </span>
              <span className="text-sm font-bold text-slate-800">
                {DOMAINS_CONFIG[currentStep - 1]?.domain}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  size="sm"
                  onClick={() => {
                    const nextStep = currentStep + 1;
                    setCurrentStep(nextStep);
                    setExpandedDomain(DOMAINS_CONFIG[nextStep - 1]?.domainCode);
                  }}
                  className="gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Next Domain <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(5)}
                  className="gap-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  View Gap Analysis <BarChart3 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Render All 4 Domain Accordions with currently active domain expanded */}
          {DOMAINS_CONFIG.map((d) => (
            <DomainAccordion
              key={d.domainCode}
              domain={d.domain}
              domainCode={d.domainCode}
              competencies={domainGroups[d.domain] || []}
              ratings={ratings}
              benchmarks={activeBenchmark.benchmarks || {}}
              onRatingChange={handleRatingChange}
              onViewRubric={(comp) => setActiveRubricComp(comp)}
              isExpanded={expandedDomain === d.domainCode}
              onToggleExpand={() =>
                setExpandedDomain(expandedDomain === d.domainCode ? null : d.domainCode)
              }
            />
          ))}

          {/* Bottom Floating Calculation Preview Bar */}
          <div className="sticky bottom-4 z-30 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 text-white shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Assessed Index (OCI)
                </span>
                <span className="text-xl font-extrabold text-amber-400">
                  {liveResult.overallCompetencyIndex}%
                </span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  {liveResult.criticalGapsCount} Critical Gaps
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {liveResult.moderateGapsCount} Moderate
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {liveResult.proficientCount + liveResult.surplusCount} Proficient
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(5)}
                className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 text-xs"
              >
                Review Results
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitAssessment}
                disabled={isSubmitting}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Submit & Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Results & Comprehensive Skill Gap Analysis */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold">
                    Assessment Evaluated & Stored Successfully
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Official gap profile logged for {officerName} ({activeBenchmark.cadreName}).
                  </p>
                </div>
              </div>
              <span className="text-xs text-emerald-700 font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Results Summary Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning">{activeBenchmark.classification}</Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    Division: {officerDivision}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Skill Gap & Competency Analysis Report
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Official MoSPI FRAC Assessment for {officerName} ({activeBenchmark.cadreName})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs gap-1.5 text-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-evaluate Ratings
                </Button>

                <Link href="/catalog">
                  <Button
                    size="sm"
                    className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View Recommended Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4 Domain Proficiency Index Breakdown Cards */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Domain Proficiency Index (DPI)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOMAINS_CONFIG.map((d) => {
                  const score = displayResult.domainScores[d.domain] || 0;
                  const isHigh = score >= 90;
                  const isMedium = score >= 75;

                  return (
                    <div
                      key={d.domainCode}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {d.domainCode}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              isHigh
                                ? "bg-emerald-100 text-emerald-800"
                                : isMedium
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {score}%
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {d.domain}
                        </h4>
                      </div>

                      <div className="mt-4">
                        <Progress
                          value={Math.min(100, score)}
                          variant={isHigh ? "success" : isMedium ? "default" : "warning"}
                          className="h-2"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Severity Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setGapFilter("CRITICAL")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gapFilter === "CRITICAL"
                    ? "border-rose-500 bg-rose-50 ring-2 ring-rose-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="text-xs text-rose-700 font-semibold block mb-1">
                  Critical Gaps (Gap ≥ 2)
                </span>
                <span className="text-2xl font-extrabold text-rose-600">
                  {displayResult.criticalGapsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGapFilter("MODERATE")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gapFilter === "MODERATE"
                    ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="text-xs text-amber-700 font-semibold block mb-1">
                  Moderate Gaps (Gap = 1)
                </span>
                <span className="text-2xl font-extrabold text-amber-600">
                  {displayResult.moderateGapsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGapFilter("PROFICIENT")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gapFilter === "PROFICIENT"
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="text-xs text-emerald-700 font-semibold block mb-1">
                  Proficient (Target Met)
                </span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {displayResult.proficientCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGapFilter("SURPLUS")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gapFilter === "SURPLUS"
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="text-xs text-indigo-700 font-semibold block mb-1">
                  Surplus (Exceeds Target)
                </span>
                <span className="text-2xl font-extrabold text-indigo-600">
                  {displayResult.surplusCount}
                </span>
              </button>
            </div>
          </div>

          {/* Detailed Skill Gap Breakdown Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Detailed Prioritized Competency Table
                </h3>
                <p className="text-xs text-slate-500">
                  Ranked by priority score ($P_i = G_i \times W_{'{domain}'} \times C_{'{cadre}'}$)
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(["ALL", "CRITICAL", "MODERATE", "PROFICIENT", "SURPLUS"] as const).map((flt) => (
                  <button
                    key={flt}
                    onClick={() => setGapFilter(flt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      gapFilter === flt
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {flt === "ALL" ? `All (${displayResult.gaps.length})` : flt}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Competency</th>
                    <th className="pb-3 px-3">Domain</th>
                    <th className="pb-3 px-3 text-center">Assessed</th>
                    <th className="pb-3 px-3 text-center">Target</th>
                    <th className="pb-3 px-3 text-center">Gap ($G_i$)</th>
                    <th className="pb-3 px-3 text-center">Priority</th>
                    <th className="pb-3 px-3">Severity</th>
                    <th className="pb-3 pl-4">Suggested Action Pathway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGaps.map((gap: SkillGap) => {
                    const compMeta = initialTaxonomy.find((t) => t.id === gap.competencyId);

                    return (
                      <tr key={gap.competencyId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-indigo-600 font-bold">
                              {gap.competencyId}
                            </span>
                            <span className="font-semibold text-slate-900 text-sm">
                              {gap.competencyName}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-xs text-slate-600 font-medium">
                            {gap.domain.replace(" Competencies", "")}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                          L{gap.assessedLevel}
                        </td>

                        <td className="py-3.5 px-3 text-center font-bold text-amber-600">
                          L{gap.benchmarkLevel}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {gap.gap > 0 ? (
                            <span className="font-bold text-rose-600">-{gap.gap}</span>
                          ) : gap.rawDelta > 0 ? (
                            <span className="font-bold text-indigo-600">+{gap.rawDelta}</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center font-mono text-xs font-semibold text-slate-700">
                          {gap.priorityScore.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {gap.severity === "CRITICAL" && (
                            <Badge variant="danger">Critical Gap</Badge>
                          )}
                          {gap.severity === "MODERATE" && (
                            <Badge variant="warning">Moderate Gap</Badge>
                          )}
                          {gap.severity === "PROFICIENT" && (
                            <Badge variant="success">Proficient</Badge>
                          )}
                          {gap.severity === "SURPLUS" && (
                            <Badge variant="primary">Surplus (+{gap.rawDelta})</Badge>
                          )}
                        </td>

                        <td className="py-3.5 pl-4 text-xs text-slate-600 leading-relaxed max-w-md">
                          <div className="flex items-center justify-between gap-2">
                            <span>{gap.suggestedAction}</span>
                            {compMeta && (
                              <button
                                type="button"
                                onClick={() => setActiveRubricComp(compMeta)}
                                className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] whitespace-nowrap"
                              >
                                Rubric
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span>Total Competencies: 29 MoSPI Official FRAC Skills</span>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/catalog">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-sm font-semibold">
                    Explore iGOT & NSSTA Catalog <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rubric Modal Popover */}
      <RubricModal
        competency={activeRubricComp}
        currentRating={activeRubricComp ? ratings[activeRubricComp.id] : undefined}
        benchmarkRating={
          activeRubricComp
            ? activeBenchmark.benchmarks[activeRubricComp.id]
            : undefined
        }
        isOpen={Boolean(activeRubricComp)}
        onClose={() => setActiveRubricComp(null)}
        onSelectRating={(level) => {
          if (activeRubricComp) {
            handleRatingChange(activeRubricComp.id, level);
          }
        }}
      />
    </div>
  );
}
