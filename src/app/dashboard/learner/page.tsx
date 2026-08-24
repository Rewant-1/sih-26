"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle,
  FileText,
  Target,
  AlertCircle,
  Layers,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { CompetencyRadarChart, RadarDataPoint } from "@/components/dashboard/CompetencyRadarChart";
import { SkillGapCard } from "@/components/dashboard/SkillGapCard";
import { LearningRoadmap } from "@/components/dashboard/LearningRoadmap";
import { repository } from "@/lib/storage/repository";
import type {
  UserProfile,
  Competency,
  CadreBenchmark,
  SkillGap,
  SunbirdCBCourse,
  CourseRecommendation,
  CompetencyDomain,
} from "@/lib/types";

function LearnerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams?.get("user") || "usr-jso-rajesh";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [allCompetencies, setAllCompetencies] = useState<Competency[]>([]);
  const [benchmark, setBenchmark] = useState<CadreBenchmark | null>(null);
  const [courses, setCourses] = useState<SunbirdCBCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all required data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [userData, comps, allCourses] = await Promise.all([
          repository.getUserProfile(userId),
          repository.getCompetencies(),
          repository.getCourses(),
        ]);

        const currentProfile = userData || (await repository.getUserProfile("usr-jso-rajesh"));
        setUser(currentProfile);
        setAllCompetencies(comps);
        setCourses(allCourses);

        if (currentProfile) {
          const cadreBench = await repository.getCadreBenchmarks(currentProfile.cadre);
          setBenchmark(cadreBench);
        }
      } catch (err) {
        console.error("Failed to load learner dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (isLoading || !user || !benchmark) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        <Header activeUserId={userId} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
            <p className="text-[13px] font-medium text-[#475A6F]">
              Loading profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate gaps deterministically
  const ratings = user.assessedRatings || {};
  const gaps: SkillGap[] = allCompetencies.map((comp) => {
    const assessedLevel = ratings[comp.id] ?? 1;
    const benchmarkLevel = benchmark.benchmarks[comp.id] ?? 3;
    const gap = Math.max(0, benchmarkLevel - assessedLevel);
    const rawDelta = assessedLevel - benchmarkLevel;
    const domainWeight = benchmark.domainWeights[comp.domain] ?? 1.0;
    const priorityScore = Number((gap * domainWeight * 1.5).toFixed(2));

    let severity: SkillGap["severity"] = "PROFICIENT";
    let suggestedAction = "Competency benchmark achieved. Eligible for advanced assignments and peer mentoring.";

    if (gap >= 2) {
      severity = "CRITICAL";
      suggestedAction = `Critical deficiency against ${user.cadre} benchmark. Immediate enrollment in structured coursework required.`;
    } else if (gap === 1) {
      severity = "MODERATE";
      suggestedAction = `Moderate deficiency. Targeted modular coursework recommended to advance from Level ${assessedLevel} to Level ${benchmarkLevel}.`;
    } else if (rawDelta > 0) {
      severity = "SURPLUS";
      suggestedAction = `Exceeds benchmark by +${rawDelta} levels. Recommended as departmental subject matter mentor.`;
    }

    return {
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
    };
  });

  // Sort gaps by priority
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  // Radar Data - 4 Domains
  const domainsList: CompetencyDomain[] = [
    "Statistical Competencies",
    "Technical Competencies",
    "Digital Governance & Data Stewardship",
    "Behavioural & Managerial Competencies",
  ];

  const domainRadarData: RadarDataPoint[] = domainsList.map((domain) => {
    const domainComps = allCompetencies.filter((c) => c.domain === domain);
    const totalAssessed = domainComps.reduce(
      (acc, c) => acc + (ratings[c.id] ?? 1),
      0
    );
    const totalBenchmark = domainComps.reduce(
      (acc, c) => acc + (benchmark.benchmarks[c.id] ?? 3),
      0
    );
    const count = domainComps.length || 1;

    const shortLabels: Record<CompetencyDomain, string> = {
      "Statistical Competencies": "Statistical",
      "Technical Competencies": "Technical",
      "Digital Governance & Data Stewardship": "Digital Governance",
      "Behavioural & Managerial Competencies": "Managerial",
    };

    return {
      subject: shortLabels[domain],
      assessed: Number((totalAssessed / count).toFixed(2)),
      benchmark: Number((totalBenchmark / count).toFixed(2)),
      domain,
      fullMark: 5,
    };
  });

  // Detailed Radar Data
  const detailedRadarData: RadarDataPoint[] = allCompetencies.slice(0, 10).map((c) => ({
    subject: c.name.length > 18 ? `${c.name.substring(0, 18)}...` : c.name,
    assessed: ratings[c.id] ?? 1,
    benchmark: benchmark.benchmarks[c.id] ?? 3,
    domain: c.domain,
    fullMark: 5,
  }));

  // Recommendations
  const recommendations: CourseRecommendation[] = [];
  gaps.forEach((gap) => {
    if (gap.gap === 0 && gap.severity === "PROFICIENT") return;

    const matchedCourse = courses.find((c) =>
      c.competencies.some((cmp) => cmp.id === gap.competencyId)
    );

    if (matchedCourse) {
      const isCadreMatch = matchedCourse.targetAudience.includes(user.cadre);
      recommendations.push({
        course: matchedCourse,
        targetCompetencyId: gap.competencyId,
        targetCompetencyName: gap.competencyName,
        relevanceScore: gap.severity === "CRITICAL" ? 95 : 82,
        cadreMatch: isCadreMatch,
        estimatedEffortHours: matchedCourse.durationMinutes / 60,
        sourceBadge: matchedCourse.source,
        recommendationReason: `Directly bridges identified ${gap.severity.toLowerCase()} deficiency in ${
          gap.competencyName
        }.`,
      });
    }
  });

  // KPIs
  const criticalCount = gaps.filter((g) => g.severity === "CRITICAL").length;
  const moderateCount = gaps.filter((g) => g.severity === "MODERATE").length;
  const proficientCount = gaps.filter((g) => g.gap === 0).length;

  const totalAssessedScore = allCompetencies.reduce(
    (sum, c) => sum + (ratings[c.id] ?? 1),
    0
  );
  const totalBenchmarkScore = allCompetencies.reduce(
    (sum, c) => sum + (benchmark.benchmarks[c.id] ?? 3),
    0
  );
  const overallCompetencyIndex = Math.min(
    100,
    Math.round((totalAssessedScore / totalBenchmarkScore) * 100)
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      <Header
        activeUserId={user.id}
        onUserChange={(newId) => router.push(`/dashboard/learner?user=${newId}`)}
      />

      <div className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 flex gap-6">
        <Sidebar currentUserId={user.id} />

        <main className="flex-1 min-w-0 space-y-8">
          {/* Officer Greeting (Open layout, no heavy box frame) */}
          <div className="pb-6 border-b border-[#C7C2BA]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#142446] text-white">
                  {benchmark.cadreName}
                </span>
                <span className="text-xs text-[#475A6F] font-medium">
                  {user.division}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#142446]">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#475A6F] mt-0.5">
                {user.designation} · Subordinate Statistical Service
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link href={`/assessment?user=${user.id}`}>
                <Button size="sm" className="text-xs font-bold bg-[#142446] hover:bg-[#1e3460] text-white">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Update Assessment
                </Button>
              </Link>
              <Link href={`/quiz-studio?user=${user.id}`}>
                <Button variant="outline" size="sm" className="text-xs font-bold border-[#C7C2BA] text-[#142446] bg-white hover:bg-[#FAF9F6]">
                  AI Quiz Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Ribbon (Clean, Dividers Instead of Cluttered Box Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-[#C7C2BA]/40">
            {/* Metric 1 */}
            <div className="border-l-2 border-[#142446] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Competency Index
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#142446]">
                  {overallCompetencyIndex}%
                </span>
                <span className="text-[11px] text-[#475A6F]">of Cadre Benchmark</span>
              </div>
              <Progress
                value={overallCompetencyIndex}
                variant="navy"
                size="sm"
                className="mt-1.5"
              />
            </div>

            {/* Metric 2 */}
            <div className="border-l-2 border-[#142446] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Critical Gaps
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#142446]">
                  {criticalCount}
                </span>
                <span className="text-[11px] text-[#475A6F]">Priority Areas</span>
              </div>
              <p className="text-[11px] text-[#475A6F]">
                {moderateCount} moderate gaps identified
              </p>
            </div>

            {/* Metric 3 */}
            <div className="border-l-2 border-[#142446] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Recommended Courses
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#142446]">
                  {recommendations.length}
                </span>
                <span className="text-[11px] text-[#475A6F]">iGOT & NSSTA</span>
              </div>
              <p className="text-[11px] text-[#475A6F]">
                {user.enrolledCourseIds.length} currently enrolled
              </p>
            </div>

            {/* Metric 4 */}
            <div className="border-l-2 border-[#142446] pl-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Benchmarked Strengths
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#142446]">
                  {proficientCount}
                </span>
                <span className="text-[11px] text-[#475A6F]">Competencies Met</span>
              </div>
              <p className="text-[11px] text-[#475A6F]">
                Eligible for peer mentorship
              </p>
            </div>
          </div>

          {/* Row 1: Radar Chart & Prioritized Gaps Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 flex">
              <CompetencyRadarChart
                domainData={domainRadarData}
                detailedData={detailedRadarData}
                officerName={user.name}
                cadreName={benchmark.cadreName}
              />
            </div>

            <div className="lg:col-span-6 flex">
              <SkillGapCard gaps={gaps} userId={user.id} />
            </div>
          </div>

          {/* Row 2: Personalized Learning Roadmap & Quiz Assessment History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Learning Roadmap */}
            <div className="lg:col-span-7">
              <LearningRoadmap
                recommendations={recommendations}
                enrolledCourseIds={user.enrolledCourseIds}
                completedCourseIds={user.completedCourseIds}
                userId={user.id}
              />
            </div>

            {/* Right: Quiz Assessment History & Recent Performance */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-[#C7C2BA] bg-white">
                <CardHeader className="pb-3 border-b border-[#C7C2BA]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base text-[#142446] font-bold">
                        Assessment & Quiz Records
                      </CardTitle>
                      <CardDescription className="text-[#475A6F] text-xs">
                        Recent auto-graded evaluations & Bloom performance
                      </CardDescription>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                      Verified
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {/* Record 1 */}
                  <div className="p-3 rounded-xl border border-[#C7C2BA] bg-[#FAF9F6] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#142446]">
                        NSS 79th Round Operational Manual
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#142446] border border-[#C7C2BA]">
                        88% Score
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475A6F]">
                      Evaluated: Sampling Design & CAPI Operations · 5 Questions
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-[#475A6F] font-mono pt-1 border-t border-[#C7C2BA]/40">
                      <span>Bloom: Apply & Analyze</span>
                      <span>15 Aug 2026</span>
                    </div>
                  </div>

                  {/* Record 2 */}
                  <div className="p-3 rounded-xl border border-[#C7C2BA] bg-[#FAF9F6] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#142446]">
                        CPI Base 2012 Index Compilation
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#142446] border border-[#C7C2BA]">
                        74% Score
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475A6F]">
                      Evaluated: Price Relatives & Index Numbers · 5 Questions
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-[#475A6F] font-mono pt-1 border-t border-[#C7C2BA]/40">
                      <span>Bloom: Understand & Apply</span>
                      <span>18 Aug 2026</span>
                    </div>
                  </div>

                  {/* Quiz Generator Prompt Card (Light Theme, No Gradients) */}
                  <div className="rounded-xl border border-[#C7C2BA] bg-[#FAF9F6] p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#142446]">
                      <FileText className="h-4 w-4 text-[#D8921E]" />
                      <span>Test New Competencies with AI</span>
                    </div>
                    <p className="text-[#475A6F] leading-relaxed">
                      Upload any NSS manual, CPI circular, or statistical SOP to generate instant Bloom-weighted quizzes.
                    </p>
                    <Link href={`/quiz-studio?user=${user.id}`} className="block pt-1">
                      <Button size="sm" className="w-full text-xs h-8 bg-[#142446] hover:bg-[#1e3460] text-white font-bold">
                        Launch AI Quiz Studio →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function LearnerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
        </div>
      }
    >
      <LearnerDashboardContent />
    </Suspense>
  );
}
