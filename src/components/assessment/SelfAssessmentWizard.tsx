"use client";

import React, { useState, useMemo, useEffect } from "react";
import type {
  Competency,
  CompetencyDomain,
  DomainCode,
  CadreBenchmark,
  CadreId,
  AssessmentResult,
  SkillGap,
  UserProfile,
} from "@/lib/types";
import { DomainAccordion } from "./DomainAccordion";
import { RubricModal } from "./RubricModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  User,
  Shield,
  Layers,
  Award,
  Check,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SelfAssessmentWizardProps {
  initialTaxonomy: Competency[];
  initialBenchmarks: CadreBenchmark[] | Record<string, CadreBenchmark>;
  initialUser?: UserProfile | null;
  onSaveAssessment?: (result: AssessmentResult) => void;
}

const DOMAINS_CONFIG: {
  domain: CompetencyDomain;
  domainCode: DomainCode;
  stepNumber: number;
}[] = [
  { domain: "Statistical Competencies", domainCode: "STAT", stepNumber: 1 },
  { domain: "Technical Competencies", domainCode: "TECH", stepNumber: 2 },
  {
    domain: "Digital Governance & Data Stewardship",
    domainCode: "GOV",
    stepNumber: 3,
  },
  {
    domain: "Behavioural & Managerial Competencies",
    domainCode: "BEH",
    stepNumber: 4,
  },
];

const CADRE_OPTIONS = [
  {
    id: "cadre_iss_ad",
    name: "Indian Statistical Service (ISS) – Assistant Director",
    badge: "Group A Gazetted",
    classification: "UPSC Civil Services / ISS Examination",
    description:
      "Responsible for survey design, national accounts modeling, statistical policy formulation, inter-ministerial coordination, and high-level analytical advisory.",
  },
  {
    id: "cadre_sso",
    name: "Senior Statistical Officer (SSO)",
    badge: "Group B Gazetted",
    classification: "Subordinate Statistical Service (SSS)",
    description:
      "Responsible for field supervision, primary scrutiny of returns, unit-level inspection, CAPI quality control, regional office administration, and junior staff mentoring.",
  },
  {
    id: "cadre_jso",
    name: "Junior Statistical Officer (JSO)",
    badge: "Group B Non-Gazetted",
    classification: "Staff Selection Commission (SSC CGL)",
    description:
      "Responsible for canvassing survey schedules, primary data capture via CAPI/tablets, respondent engagement, preliminary data entry, listing, and validation.",
  },
];

export function SelfAssessmentWizard({
  initialTaxonomy,
  initialBenchmarks,
  initialUser,
  onSaveAssessment,
}: SelfAssessmentWizardProps) {
  const searchParams = useSearchParams();
  const urlUser = searchParams?.get("user");

  // Determine initial cadre based on URL or user profile
  const defaultCadre = useMemo(() => {
    if (urlUser === "usr-sso-priya") return "cadre_sso";
    if (urlUser === "usr-ad-amit" || urlUser === "usr-dir-sunita") return "cadre_iss_ad";
    return initialUser?.cadre === "SENIOR_STATISTICAL_OFFICER"
      ? "cadre_sso"
      : initialUser?.cadre === "ISS_ASSISTANT_DIRECTOR"
      ? "cadre_iss_ad"
      : "cadre_jso";
  }, [urlUser, initialUser]);

  const [selectedCadre, setSelectedCadre] = useState<string>(defaultCadre);
  const [officerName, setOfficerName] = useState<string>(() => {
    if (urlUser === "usr-sso-priya") return "Priya Sharma";
    if (urlUser === "usr-ad-amit") return "Dr. Amit Verma";
    if (urlUser === "usr-dir-sunita") return "Sunita Rao";
    return initialUser?.name || "Rajesh Kumar";
  });
  const [officerDesignation, setOfficerDesignation] = useState<string>(() => {
    if (urlUser === "usr-sso-priya") return "Senior Statistical Officer";
    if (urlUser === "usr-ad-amit") return "Assistant Director (ISS)";
    if (urlUser === "usr-dir-sunita") return "Director (DIID & CBC)";
    return initialUser?.designation || "Junior Statistical Officer";
  });
  const [officerDivision, setOfficerDivision] = useState<string>(() => {
    if (urlUser === "usr-sso-priya") return "Economic Statistics Division (ESD)";
    if (urlUser === "usr-ad-amit") return "National Accounts Division (NAD)";
    if (urlUser === "usr-dir-sunita") return "Data Informatics & Innovation Division";
    return initialUser?.division || "Field Operations Division (FOD)";
  });

  // Current Step: 0 = Profile, 1..4 = Domains, 5 = Results
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [expandedDomain, setExpandedDomain] = useState<DomainCode | null>("STAT");

  // Active benchmark profile
  const activeBenchmark = useMemo(() => {
    const list = Array.isArray(initialBenchmarks)
      ? initialBenchmarks
      : Object.values(initialBenchmarks);
    return (
      list.find(
        (b) =>
          b.cadreId === (selectedCadre === "cadre_sso" ? "SENIOR_STATISTICAL_OFFICER" : selectedCadre === "cadre_iss_ad" ? "ISS_ASSISTANT_DIRECTOR" : "JUNIOR_STATISTICAL_OFFICER") ||
          (b as any).id === selectedCadre
      ) ||
      list[0] || {
        cadreId: "JUNIOR_STATISTICAL_OFFICER" as CadreId,
        cadreName: "Junior Statistical Officer",
        classification: "Group B Non-Gazetted",
        description: "",
        benchmarks: {},
        domainWeights: {
          "Statistical Competencies": 1.0,
          "Technical Competencies": 1.0,
          "Digital Governance & Data Stewardship": 1.0,
          "Behavioural & Managerial Competencies": 1.0,
        },
      }
    );
  }, [initialBenchmarks, selectedCadre]);

  // Ratings State: competencyId -> Level (1..5)
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    initialTaxonomy.forEach((comp) => {
      const benchmarkVal = activeBenchmark.benchmarks[comp.id] ?? 3;
      initial[comp.id] = Math.max(1, benchmarkVal - 1);
    });
    return initial;
  });

  // Modal State for Rubrics
  const [activeRubricComp, setActiveRubricComp] = useState<Competency | null>(null);

  // Submitting and Saved State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [persistedResult, setPersistedResult] = useState<any | null>(null);

  // Result Filtering State
  const [gapFilter, setGapFilter] = useState<
    "ALL" | "CRITICAL" | "MODERATE" | "PROFICIENT" | "SURPLUS"
  >("ALL");

  // Group competencies by domain
  const domainGroups = useMemo(() => {
    const groups: Record<CompetencyDomain, Competency[]> = {
      "Statistical Competencies": [],
      "Technical Competencies": [],
      "Digital Governance & Data Stewardship": [],
      "Behavioural & Managerial Competencies": [],
    };
    initialTaxonomy.forEach((comp) => {
      if (groups[comp.domain]) {
        groups[comp.domain].push(comp);
      }
    });
    return groups;
  }, [initialTaxonomy]);

  // Handle rating change
  const handleRatingChange = (competencyId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [competencyId]: rating,
    }));
  };

  // Handle Cadre Change
  const handleCadreChange = (newCadreId: string) => {
    setSelectedCadre(newCadreId);
    const list = Array.isArray(initialBenchmarks)
      ? initialBenchmarks
      : Object.values(initialBenchmarks);
    const newBenchmark = list.find(
      (b) =>
        b.cadreId === (newCadreId === "cadre_sso" ? "SENIOR_STATISTICAL_OFFICER" : newCadreId === "cadre_iss_ad" ? "ISS_ASSISTANT_DIRECTOR" : "JUNIOR_STATISTICAL_OFFICER") ||
        (b as any).id === newCadreId
    );
    if (newBenchmark) {
      const nextRatings: Record<string, number> = {};
      initialTaxonomy.forEach((comp) => {
        const targetVal = newBenchmark.benchmarks[comp.id] ?? 3;
        nextRatings[comp.id] = Math.max(1, targetVal - 1);
      });
      setRatings(nextRatings);
    }
  };

  // Mathematical Gap Engine (Live Calculation)
  const liveResult = useMemo(() => {
    const gaps: SkillGap[] = [];
    const domainTotals: Record<
      CompetencyDomain,
      { assessedSum: number; benchmarkSum: number; count: number }
    > = {
      "Statistical Competencies": { assessedSum: 0, benchmarkSum: 0, count: 0 },
      "Technical Competencies": { assessedSum: 0, benchmarkSum: 0, count: 0 },
      "Digital Governance & Data Stewardship": {
        assessedSum: 0,
        benchmarkSum: 0,
        count: 0,
      },
      "Behavioural & Managerial Competencies": {
        assessedSum: 0,
        benchmarkSum: 0,
        count: 0,
      },
    };

    let totalAssessedScore = 0;
    let totalBenchmarkScore = 0;

    initialTaxonomy.forEach((comp) => {
      const assessedLevel = ratings[comp.id] ?? 1;
      const benchmarkLevel = activeBenchmark.benchmarks[comp.id] ?? 3;
      const gap = Math.max(0, benchmarkLevel - assessedLevel);
      const rawDelta = assessedLevel - benchmarkLevel;

      const domainWeight = activeBenchmark.domainWeights[comp.domain] ?? 1.0;
      const cadreMultiplier =
        selectedCadre === "cadre_iss_ad" ? 1.3 : selectedCadre === "cadre_sso" ? 1.15 : 1.0;
      const priorityScore = Number((gap * domainWeight * cadreMultiplier).toFixed(2));

      let severity: SkillGap["severity"] = "PROFICIENT";
      let suggestedAction = "Meets or exceeds mandatory benchmark. Eligible for mentoring.";

      if (gap >= 2) {
        severity = "CRITICAL";
        suggestedAction = `Priority training required on iGOT / NSSTA to elevate from Level ${assessedLevel} to Cadre Benchmark Level ${benchmarkLevel}.`;
      } else if (gap === 1) {
        severity = "MODERATE";
        suggestedAction = `Targeted modular coursework recommended to advance from Level ${assessedLevel} to Level ${benchmarkLevel}.`;
      } else if (rawDelta > 0) {
        severity = "SURPLUS";
        suggestedAction = `Exceeds benchmark by +${rawDelta} levels. Recommended as departmental subject matter mentor.`;
      }

      gaps.push({
        competencyId: comp.id,
        competencyName: comp.name,
        domain: comp.domain,
        assessedLevel,
        benchmarkLevel,
        gap,
        rawDelta,
        priorityScore,
        severity,
        suggestedAction,
      });

      if (domainTotals[comp.domain]) {
        domainTotals[comp.domain].assessedSum += assessedLevel;
        domainTotals[comp.domain].benchmarkSum += benchmarkLevel;
        domainTotals[comp.domain].count += 1;
      }

      totalAssessedScore += assessedLevel;
      totalBenchmarkScore += benchmarkLevel;
    });

    // Sort gaps: Critical first, then Moderate, then Proficient
    gaps.sort((a, b) => b.priorityScore - a.priorityScore || b.gap - a.gap);

    const domainScores: Record<CompetencyDomain, number> = {
      "Statistical Competencies": 0,
      "Technical Competencies": 0,
      "Digital Governance & Data Stewardship": 0,
      "Behavioural & Managerial Competencies": 0,
    };

    (Object.keys(domainTotals) as CompetencyDomain[]).forEach((d) => {
      const dt = domainTotals[d];
      domainScores[d] = dt.benchmarkSum > 0 ? Math.round((dt.assessedSum / dt.benchmarkSum) * 100) : 0;
    });

    const overallCompetencyIndex =
      totalBenchmarkScore > 0 ? Math.round((totalAssessedScore / totalBenchmarkScore) * 100) : 0;

    const criticalGapsCount = gaps.filter((g) => g.severity === "CRITICAL").length;
    const moderateGapsCount = gaps.filter((g) => g.severity === "MODERATE").length;
    const proficientCount = gaps.filter((g) => g.severity === "PROFICIENT").length;
    const surplusCount = gaps.filter((g) => g.severity === "SURPLUS").length;

    return {
      gaps,
      domainScores,
      overallCompetencyIndex,
      criticalGapsCount,
      moderateGapsCount,
      proficientCount,
      surplusCount,
      totalAssessedScore,
      totalBenchmarkScore,
    };
  }, [initialTaxonomy, activeBenchmark, ratings, selectedCadre]);

  // Submission handler
  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        userId: initialUser?.id || "usr_001",
        cadreId: selectedCadre,
        completedAt: new Date().toISOString(),
        ratings,
        domainScores: liveResult.domainScores,
        overallCompetencyIndex: liveResult.overallCompetencyIndex,
        criticalGapsCount: liveResult.criticalGapsCount,
        moderateGapsCount: liveResult.moderateGapsCount,
        proficientCount: liveResult.proficientCount,
        surplusCount: liveResult.surplusCount,
        gaps: liveResult.gaps,
      };

      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        const saved = await res.json();
        setPersistedResult(saved.submission || submissionData);
        setSavedSuccess(true);
        setCurrentStep(5);
        if (onSaveAssessment) {
          onSaveAssessment(saved.submission || submissionData);
        }
      }
    } catch (err) {
      console.error("Failed to submit assessment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset quick fill
  const handleApplyPreset = (type: "BEGINNER" | "BALANCED" | "EXPERT") => {
    const nextRatings: Record<string, number> = {};
    for (const comp of initialTaxonomy) {
      const b = activeBenchmark.benchmarks[comp.id] ?? 3;
      if (type === "BEGINNER") {
        nextRatings[comp.id] = Math.max(1, b - 2);
      } else if (type === "EXPERT") {
        nextRatings[comp.id] = Math.min(5, b + 1);
      } else {
        nextRatings[comp.id] = b;
      }
    }
    setRatings(nextRatings);
  };

  const displayResult = persistedResult || liveResult;
  const filteredGaps = useMemo(() => {
    const gapsList: SkillGap[] = displayResult.gaps || [];
    if (gapFilter === "ALL") return gapsList;
    return gapsList.filter((g: SkillGap) => g.severity === gapFilter);
  }, [displayResult, gapFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Top Header & Context Banner (Light Government Theme) ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-[#142446] border border-[#C7C2BA] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#D8921E]" />
                MoSPI FRAC Competency Evaluation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]">
                Mission Karmayogi CBC Framework
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#142446]">
              Official Self-Assessment & Skill Gap Engine
            </h1>
            <p className="text-sm text-[#475A6F] max-w-3xl leading-relaxed">
              Evaluate your proficiency across 29 official statistical, technical, digital governance, and managerial competencies. The engine computes deterministic skill deltas against your cadre benchmark and generates prioritized capacity building pathways.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#FAF9F6] rounded-xl p-4 border border-[#C7C2BA] flex flex-row lg:flex-col items-center justify-between gap-3 min-w-[220px]">
            <div className="text-center lg:text-right w-full">
              <span className="text-xs text-[#475A6F] font-medium block">
                Overall Competency Index
              </span>
              <span className="text-3xl font-bold text-[#142446]">
                {liveResult.overallCompetencyIndex}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#475A6F] w-full justify-between pt-2 border-t border-[#C7C2BA]/40">
              <span className="font-semibold text-[#142446]">
                {liveResult.criticalGapsCount} Critical
              </span>
              <span>·</span>
              <span className="font-semibold text-[#142446]">
                {liveResult.moderateGapsCount} Moderate
              </span>
              <span>·</span>
              <span className="font-semibold text-[#142446]">
                {liveResult.proficientCount + liveResult.surplusCount} Met
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-[#C7C2BA]/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentStep(0)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentStep === 0
                  ? "bg-[#142446] text-white shadow-xs"
                  : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA] hover:text-[#142446]"
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  currentStep === d.stepNumber
                    ? "bg-[#142446] text-white shadow-xs"
                    : "bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA] hover:text-[#142446]"
                }`}
              >
                <span>{d.stepNumber + 1}.</span> {d.domainCode} ({domainGroups[d.domain].length})
              </button>
            ))}

            <button
              onClick={() => setCurrentStep(5)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentStep === 5
                  ? "bg-[#142446] text-white shadow-xs"
                  : "bg-white text-[#142446] border border-[#142446] hover:bg-[#FAF9F6]"
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
              className="text-xs bg-white border-[#C7C2BA] text-[#475A6F] hover:text-[#142446]"
            >
              Reset to Benchmark
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="text-xs bg-[#D8921E] hover:bg-[#c27f14] text-white font-bold gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? "Saving..." : "Save Assessment"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── STEP 0: Cadre Selection & Officer Profile ── */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 border-[#C7C2BA] shadow-xs bg-white">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#C7C2BA]/40">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5 text-[#D8921E]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#142446]">
                  Step 1: Select Statistical Cadre & Target Benchmark
                </h2>
                <p className="text-xs text-[#475A6F]">
                  Cadre selection sets the official mandatory proficiency benchmarks across all 29 competencies.
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
                    className={`p-5 rounded-xl border text-left transition-colors relative flex flex-col justify-between ${
                      isSelected
                        ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                        : "border-[#C7C2BA] bg-white hover:border-[#475A6F]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                          {c.badge}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#142446] text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#142446] mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-[#475A6F] mb-3 font-medium">
                        {c.classification}
                      </p>
                      <p className="text-xs text-[#475A6F] leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#C7C2BA]/40 flex items-center justify-between text-xs text-[#475A6F]">
                      <span>Benchmark Profile</span>
                      <span className="font-semibold text-[#142446]">
                        {isSelected ? "Active Target" : "Select Cadre"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Officer Details Setup */}
            <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#C7C2BA] mb-6">
              <h4 className="text-sm font-bold text-[#142446] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#475A6F]" />
                Officer Evaluation Profile Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#142446] block mb-1">
                    Officer Name
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#C7C2BA] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#142446] text-[#142446]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#142446] block mb-1">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    value={officerDesignation}
                    onChange={(e) => setOfficerDesignation(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#C7C2BA] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#142446] text-[#142446]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#142446] block mb-1">
                    MoSPI Division / Station
                  </label>
                  <input
                    type="text"
                    value={officerDivision}
                    onChange={(e) => setOfficerDivision(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-[#C7C2BA] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#142446] text-[#142446]"
                  />
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#C7C2BA]/40">
              <div className="flex items-center gap-2 text-xs text-[#475A6F]">
                <span>Quick Seed Options:</span>
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
                className="gap-2 bg-[#142446] hover:bg-[#1e3460] text-white font-semibold"
              >
                Proceed to Statistical Competencies <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── STEPS 1-4: Domain-wise Competency Evaluation ── */}
      {currentStep >= 1 && currentStep <= 4 && (
        <div className="space-y-6">
          {/* Domain Quick Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-[#C7C2BA]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#475A6F] uppercase tracking-wider">
                Domain Step:
              </span>
              <span className="text-sm font-bold text-[#142446]">
                {DOMAINS_CONFIG[currentStep - 1]?.domain}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="gap-1 text-xs border-[#C7C2BA] text-[#475A6F] hover:text-[#142446]"
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
                  className="gap-1 text-xs bg-[#142446] hover:bg-[#1e3460] text-white"
                >
                  Next Domain <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(5)}
                  className="gap-1 text-xs bg-[#D8921E] hover:bg-[#c27f14] text-white font-bold"
                >
                  View Gap Analysis <BarChart3 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Render All 4 Domain Accordions */}
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
          <div className="sticky bottom-4 z-30 bg-white rounded-xl p-4 text-[#142446] shadow-md border border-[#C7C2BA] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-[#475A6F] block font-medium">
                  Assessed Index (OCI)
                </span>
                <span className="text-xl font-bold text-[#142446]">
                  {liveResult.overallCompetencyIndex}%
                </span>
              </div>
              <div className="h-8 w-px bg-[#C7C2BA]/60" />
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] text-[#142446] font-semibold border border-[#C7C2BA]">
                  {liveResult.criticalGapsCount} Critical Gaps
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] text-[#142446] font-semibold border border-[#C7C2BA]">
                  {liveResult.moderateGapsCount} Moderate
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#F3E7D1] text-[#142446] font-semibold border border-[#C7C2BA]">
                  {liveResult.proficientCount + liveResult.surplusCount} Proficient
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(5)}
                className="bg-white border-[#C7C2BA] text-[#142446] hover:bg-[#FAF9F6] text-xs font-semibold"
              >
                Review Results
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitAssessment}
                disabled={isSubmitting}
                className="bg-[#D8921E] hover:bg-[#c27f14] text-white font-bold text-xs gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Submit & Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 5: Results & Comprehensive Skill Gap Analysis ── */}
      {currentStep === 5 && (
        <div className="space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D8921E]" />
                <div>
                  <h4 className="text-sm font-bold">
                    Assessment Evaluated & Stored Successfully
                  </h4>
                  <p className="text-xs text-[#475A6F]">
                    Official gap profile logged for {officerName} ({activeBenchmark.cadreName}).
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#475A6F] font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Results Summary Hero Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C7C2BA] shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#C7C2BA]/40">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                    {activeBenchmark.classification}
                  </span>
                  <span className="text-xs text-[#475A6F] font-medium">
                    Division: {officerDivision}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#142446]">
                  Skill Gap & Competency Analysis Report
                </h2>
                <p className="text-xs text-[#475A6F] mt-1">
                  Official MoSPI FRAC Assessment for {officerName} ({activeBenchmark.cadreName})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs gap-1.5 border-[#C7C2BA] text-[#475A6F] hover:text-[#142446]"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-evaluate Ratings
                </Button>

                <Link href="/catalog">
                  <Button
                    size="sm"
                    className="text-xs gap-1.5 bg-[#142446] hover:bg-[#1e3460] text-white font-semibold shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View Recommended Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4 Domain Proficiency Index Breakdown Cards */}
            <div>
              <h3 className="text-sm font-bold text-[#142446] mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D8921E]" />
                Domain Proficiency Index (DPI)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOMAINS_CONFIG.map((d) => {
                  const score = displayResult.domainScores[d.domain] || 0;
                  return (
                    <div
                      key={d.domainCode}
                      className="p-4 rounded-xl border border-[#C7C2BA] bg-[#FAF9F6] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-[#475A6F]">
                            {d.domainCode}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-[#C7C2BA] text-[#142446]">
                            {score}%
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#142446] mb-1">
                          {d.domain}
                        </h4>
                      </div>

                      <div className="mt-4">
                        <Progress
                          value={Math.min(100, score)}
                          variant="navy"
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
                className={`p-4 rounded-xl border text-left transition-colors ${
                  gapFilter === "CRITICAL"
                    ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                    : "border-[#C7C2BA] bg-white hover:bg-[#FAF9F6]"
                }`}
              >
                <span className="text-xs text-[#142446] font-semibold block mb-1">
                  Critical Gaps (Gap ≥ 2)
                </span>
                <span className="text-2xl font-bold text-[#142446]">
                  {displayResult.criticalGapsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGapFilter("MODERATE")}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  gapFilter === "MODERATE"
                    ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                    : "border-[#C7C2BA] bg-white hover:bg-[#FAF9F6]"
                }`}
              >
                <span className="text-xs text-[#142446] font-semibold block mb-1">
                  Moderate Gaps (Gap = 1)
                </span>
                <span className="text-2xl font-bold text-[#142446]">
                  {displayResult.moderateGapsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGapFilter("PROFICIENT")}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  gapFilter === "PROFICIENT"
                    ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                    : "border-[#C7C2BA] bg-white hover:bg-[#FAF9F6]"
                }`}
              >
                <span className="text-xs text-[#142446] font-semibold block mb-1">
                  Proficient (Target Met)
                </span>
                <span className="text-2xl font-bold text-[#142446]">
                  {displayResult.proficientCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGapFilter("SURPLUS")}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  gapFilter === "SURPLUS"
                    ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                    : "border-[#C7C2BA] bg-white hover:bg-[#FAF9F6]"
                }`}
              >
                <span className="text-xs text-[#142446] font-semibold block mb-1">
                  Surplus (Exceeds Target)
                </span>
                <span className="text-2xl font-bold text-[#142446]">
                  {displayResult.surplusCount}
                </span>
              </button>
            </div>
          </div>

          {/* Detailed Skill Gap Breakdown Table */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#C7C2BA] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C7C2BA]/40">
              <div>
                <h3 className="text-lg font-bold text-[#142446]">
                  Detailed Prioritized Competency Table
                </h3>
                <p className="text-xs text-[#475A6F]">
                  Ranked by role-calibrated priority score ($P_i = G_i \times W_{'{domain}'} \times C_{'{cadre}'}$)
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF9F6] p-1 rounded-lg border border-[#C7C2BA]">
                {(["ALL", "CRITICAL", "MODERATE", "PROFICIENT", "SURPLUS"] as const).map((flt) => (
                  <button
                    key={flt}
                    onClick={() => setGapFilter(flt)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                      gapFilter === flt
                        ? "bg-[#142446] text-white shadow-xs"
                        : "text-[#475A6F] hover:text-[#142446]"
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
                  <tr className="border-b border-[#C7C2BA] text-xs font-semibold text-[#475A6F] uppercase tracking-wider">
                    <th className="pb-3 pr-4">Competency</th>
                    <th className="pb-3 px-3">Domain</th>
                    <th className="pb-3 px-3 text-center">Assessed</th>
                    <th className="pb-3 px-3 text-center">Target</th>
                    <th className="pb-3 px-3 text-center">Gap</th>
                    <th className="pb-3 px-3 text-center">Priority</th>
                    <th className="pb-3 px-3">Severity</th>
                    <th className="pb-3 pl-4">Suggested Action Pathway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C7C2BA]/40">
                  {filteredGaps.map((gap: SkillGap) => {
                    const compMeta = initialTaxonomy.find((t) => t.id === gap.competencyId);

                    return (
                      <tr key={gap.competencyId} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-[#475A6F] font-bold">
                              {gap.competencyId}
                            </span>
                            <span className="font-semibold text-[#142446] text-sm">
                              {gap.competencyName}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-xs text-[#475A6F] font-medium">
                            {gap.domain.replace(" Competencies", "")}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center font-bold text-[#142446]">
                          L{gap.assessedLevel}
                        </td>

                        <td className="py-3.5 px-3 text-center font-bold text-[#142446]">
                          L{gap.benchmarkLevel}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {gap.gap > 0 ? (
                            <span className="font-bold text-[#142446]">-{gap.gap}</span>
                          ) : gap.rawDelta > 0 ? (
                            <span className="font-bold text-[#142446]">+{gap.rawDelta}</span>
                          ) : (
                            <span className="text-[#C7C2BA]">0</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center font-mono text-xs font-semibold text-[#142446]">
                          {gap.priorityScore.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {gap.severity === "CRITICAL" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#142446] text-white">
                              Critical Gap
                            </span>
                          )}
                          {gap.severity === "MODERATE" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                              Moderate Gap
                            </span>
                          )}
                          {gap.severity === "PROFICIENT" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                              Proficient
                            </span>
                          )}
                          {gap.severity === "SURPLUS" && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-[#142446] border border-[#142446]">
                              Surplus (+{gap.rawDelta})
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 pl-4 text-xs text-[#475A6F] leading-relaxed max-w-md">
                          <div className="flex items-center justify-between gap-2">
                            <span>{gap.suggestedAction}</span>
                            {compMeta && (
                              <button
                                type="button"
                                onClick={() => setActiveRubricComp(compMeta)}
                                className="text-[#142446] hover:text-[#D8921E] font-semibold text-[11px] whitespace-nowrap"
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
            <div className="pt-6 border-t border-[#C7C2BA]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#475A6F]">
                <span>Total Competencies: 29 MoSPI Official FRAC Skills</span>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/catalog">
                  <Button className="bg-[#142446] hover:bg-[#1e3460] text-white gap-2 text-sm font-semibold">
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
