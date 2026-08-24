"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  GraduationCap,
  Layers,
  LineChart,
  PlayCircle,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
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
      <div className="min-h-screen bg-[#f9f8f5] flex flex-col justify-between">
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
      suggestedAction = `Immediate training required on iGOT / NSSTA to elevate from Level ${assessedLevel} to Cadre Benchmark Level ${benchmarkLevel}.`;
    } else if (gap === 1) {
      severity = "MODERATE";
      suggestedAction = `Targeted modular coursework recommended to advance from Level ${assessedLevel} to Level ${benchmarkLevel}.`;
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

  // Sort gaps: Critical first, then Moderate, then Proficient
  gaps.sort((a, b) => b.priorityScore - a.priorityScore || b.gap - a.gap);

  // Group by 4 Domains for Radar Chart
  const domains: CompetencyDomain[] = [
    "Statistical Competencies",
    "Technical Competencies",
    "Digital Governance & Data Stewardship",
    "Behavioural & Managerial Competencies",
  ];

  const domainRadarData: RadarDataPoint[] = domains.map((domain) => {
    const domainComps = allCompetencies.filter((c) => c.domain === domain);
    const totalAssessed = domainComps.reduce(
      (sum, c) => sum + (ratings[c.id] ?? 1),
      0
    );
    const totalBenchmark = domainComps.reduce(
      (sum, c) => sum + (benchmark.benchmarks[c.id] ?? 3),
      0
    );

    const avgAssessed = Number((totalAssessed / domainComps.length).toFixed(2));
    const avgBenchmark = Number((totalBenchmark / domainComps.length).toFixed(2));

    return {
      subject: domain.replace(" Competencies", "").replace(" & Data Stewardship", ""),
      assessed: avgAssessed,
      benchmark: avgBenchmark,
      domain,
      fullMark: 5,
      gap: Number((avgBenchmark - avgAssessed).toFixed(2)),
    };
  });

  // Granular radar data
  const detailedRadarData: RadarDataPoint[] = allCompetencies.map((comp) => {
    const assessed = ratings[comp.id] ?? 1;
    const bench = benchmark.benchmarks[comp.id] ?? 3;
    return {
      subject: comp.code || comp.id,
      assessed,
      benchmark: bench,
      domain: comp.domain,
      fullMark: 5,
      gap: bench - assessed,
    };
  });

  // Recommendations: map critical & moderate gaps to courses
  const criticalAndModerateGaps = gaps.filter((g) => g.gap > 0);
  const recommendations: CourseRecommendation[] = [];

  criticalAndModerateGaps.slice(0, 5).forEach((gap) => {
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
    <div className="min-h-screen bg-[#f9f8f5] flex flex-col justify-between">
      <Header
        activeUserId={user.id}
        onUserChange={(newId) => router.push(`/dashboard/learner?user=${newId}`)}
      />

      <div className="mx-auto max-w-7xl w-full px-6 py-6 sm:px-8 lg:px-12 flex-1 flex gap-6">
        <Sidebar currentUserId={user.id} />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Officer Banner */}
          <div className="border border-[#e8e4dc] bg-white rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-1">
                  {benchmark.cadreName} · FRAC Profile
                </p>
                <h1 className="text-[24px] font-light text-[#142446]">
                  Welcome back, {user.name}
                </h1>
                <p className="text-[13px] text-[#475A6F] mt-1">
                  {user.designation} · {user.division}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/assessment?user=${user.id}`}>
                  <Button variant="saffron" size="sm" className="text-xs font-semibold">
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Update Assessment
                  </Button>
                </Link>
                <Link href={`/quiz-studio?user=${user.id}`}>
                  <Button variant="outline" size="sm" className="text-xs font-semibold border-[#e8e4dc] text-[#142446] hover:bg-[#f9f8f5]">
                    AI Quiz Studio
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Competency Index</span>
                <Target className="h-4 w-4 text-[#000080]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {overallCompetencyIndex}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  of Cadre Benchmark
                </span>
              </div>
              <Progress
                value={overallCompetencyIndex}
                variant="navy"
                size="sm"
                className="mt-2"
              />
            </Card>

            {/* KPI 2 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Critical Skill Gaps</span>
                <Flame className="h-4 w-4 text-rose-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-rose-600">
                  {criticalCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Priorities (&gt;= 2 Levels)
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                {moderateCount} moderate gaps identified
              </div>
            </Card>

            {/* KPI 3 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Courses in Learning Path</span>
                <BookOpen className="h-4 w-4 text-[#FF9933]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {recommendations.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  iGOT & NSSTA
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                {user.enrolledCourseIds.length} currently enrolled
              </div>
            </Card>

            {/* KPI 4 */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Benchmarked Strengths</span>
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-emerald-600">
                  {proficientCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Competencies Met
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Eligible for peer mentorship
              </div>
            </Card>
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
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Assessment & Quiz Records
                      </CardTitle>
                      <CardDescription>
                        Recent auto-graded evaluations & Bloom performance
                      </CardDescription>
                    </div>
                    <Badge variant="saffron" size="sm">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Record 1 */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">
                        NSS 79th Round Operational Manual
                      </span>
                      <Badge variant="success" size="sm">
                        88% Score
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Evaluated: Sampling Design & CAPI Operations • 5 Questions
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60">
                      <span>Bloom: Apply & Analyze</span>
                      <span>15 Aug 2026</span>
                    </div>
                  </div>

                  {/* Record 2 */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">
                        CPI Base 2012 Index Compilation
                      </span>
                      <Badge variant="warning" size="sm">
                        74% Score
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Evaluated: Price Relatives & Index Numbers • 5 Questions
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60">
                      <span>Bloom: Understand & Apply</span>
                      <span>18 Aug 2026</span>
                    </div>
                  </div>

                  {/* AI Quiz Generator Prompt Card */}
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#000080]">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Test New Competencies with AI</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Upload any NSS manual, CPI circular, or statistical SOP to
                      generate instant Bloom-weighted quizzes via Gemini AI.
                    </p>
                    <Link href={`/quiz-studio?user=${user.id}`} className="block pt-1">
                      <Button variant="navy" size="sm" className="w-full text-xs h-8">
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#000080] border-t-transparent" />
        </div>
      }
    >
      <LearnerDashboardContent />
    </Suspense>
  );
}
