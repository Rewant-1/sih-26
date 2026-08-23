"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  CatalogFilters,
  type FilterState,
} from "@/components/catalog/CatalogFilters";
import { CourseGrid } from "@/components/catalog/CourseGrid";
import { CourseCard } from "@/components/catalog/CourseCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SunbirdCBCourse, CourseRecommendation } from "@/lib/types/sunbird";
import type { CadreId } from "@/lib/types/frac";
import {
  recommendCoursesForGaps,
  filterCourseCatalog,
} from "@/lib/engine/recommendation-engine";

export default function CourseCatalogPage() {
  const searchParams = useSearchParams();
  const activeUserId = searchParams?.get("user") || "usr-jso-rajesh";

  // Data state
  const [courses, setCourses] = useState<SunbirdCBCourse[]>([]);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [activeOfficerName, setActiveOfficerName] = useState<string>("Rajesh Kumar");
  const [activeCadre, setActiveCadre] = useState<CadreId>("JUNIOR_STATISTICAL_OFFICER");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrollmentToast, setEnrollmentToast] = useState<string | null>(null);

  // Filters State
  const initialSource = searchParams?.get("source") as any;
  const [filters, setFilters] = useState<FilterState>({
    source: initialSource === "igot" ? "iGOT Karmayogi" : initialSource === "nssta" ? "NSSTA TPAC" : "ALL",
    domain: "ALL",
    cadre: "ALL",
    deliveryMode: "ALL",
    level: "ALL",
    search: searchParams?.get("q") || "",
  });

  // Fetch courses and user recommendation data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch courses list
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        const loadedCourses: SunbirdCBCourse[] = coursesData.courses || [];
        setCourses(loadedCourses);

        // Fetch user profile and recommendations
        const recRes = await fetch(`/api/recommendations?userId=${activeUserId}`);
        const recData = await recRes.json();

        if (recData.success) {
          setRecommendations(recData.recommendations || []);
          if (recData.userProfile) {
            setActiveOfficerName(recData.userProfile.name);
            setActiveCadre(recData.userProfile.cadre);
            setEnrolledCourseIds(recData.userProfile.enrolledCourseIds || []);
          }
        }
      } catch (err) {
        console.error("Error loading course catalog data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [activeUserId]);

  // Handle Enrollment Action
  const handleEnroll = (courseId: string) => {
    const targetCourse = courses.find((c) => c.identifier === courseId);
    setEnrolledCourseIds((prev) => Array.from(new Set([...prev, courseId])));

    setEnrollmentToast(
      targetCourse
        ? `Successfully enrolled in "${targetCourse.name}"! Added to your learning roadmap.`
        : "Successfully enrolled in course!"
    );

    setTimeout(() => {
      setEnrollmentToast(null);
    }, 4500);
  };

  // Filter courses in memory
  const filteredCourses = useMemo(() => {
    return filterCourseCatalog(courses, filters);
  }, [courses, filters]);

  // Counts
  const igotCount = courses.filter((c) => c.source === "iGOT Karmayogi").length;
  const nsstaCount = courses.filter((c) => c.source === "NSSTA TPAC").length;

  // Top 3 Recommended courses for the spotlight banner
  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 3);
  }, [recommendations]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header activeUserId={activeUserId} />

      {/* Floating Enrollment Toast Notification */}
      {enrollmentToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-sm mb-0.5">Enrollment Confirmed</p>
            <p className="text-slate-300 leading-snug">{enrollmentToast}</p>
          </div>
          <button
            onClick={() => setEnrollmentToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#000080] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-400 font-medium">Course Catalog</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Mission Karmayogi • Sunbird-CB &amp; NSSTA TPAC Repository</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                MoSPI Capacity Building Course Catalog
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-light leading-relaxed">
                Discover {courses.length} accredited training programmes mapped to official FRAC competencies—uniting online micro-learning on iGOT Karmayogi and intensive residential masterclasses at NSSTA Greater Noida.
              </p>
            </div>

            {/* Quick Stats Pill Strip */}
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2.5 rounded-xl text-center min-w-[90px]">
                <div className="text-xl font-bold text-white">{courses.length}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">
                  Total Courses
                </div>
              </div>

              <div className="bg-amber-500/15 backdrop-blur-md border border-amber-400/30 px-3.5 py-2.5 rounded-xl text-center min-w-[90px]">
                <div className="text-xl font-bold text-amber-400">{igotCount}</div>
                <div className="text-[10px] text-amber-200 uppercase tracking-wider font-medium">
                  iGOT e-Learning
                </div>
              </div>

              <div className="bg-blue-500/15 backdrop-blur-md border border-blue-400/30 px-3.5 py-2.5 rounded-xl text-center min-w-[90px]">
                <div className="text-xl font-bold text-blue-300">{nsstaCount}</div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider font-medium">
                  NSSTA TPAC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Spotlight Banner: Personalized Recommendations */}
        {topRecommendations.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Prioritized Recommendations for {activeOfficerName} ({activeCadre.replace(/_/g, " ")})
                  </h2>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Engine has identified targeted skill gaps and matched optimal courses across iGOT and NSSTA to accelerate your cadre progression.
                </p>
              </div>

              <Link
                href={`/dashboard/learner?user=${activeUserId}`}
                className="inline-flex items-center text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300/80 px-3.5 py-2 rounded-lg transition-colors shrink-0"
              >
                <span>View Full Learning Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Spotlight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRecommendations.map((rec) => (
                <CourseCard
                  key={`rec-${rec.course.identifier}`}
                  course={rec.course}
                  isEnrolled={enrolledCourseIds.includes(rec.course.identifier)}
                  onEnroll={handleEnroll}
                  relevanceScore={rec.relevanceScore}
                  recommendationReason={rec.recommendationReason}
                />
              ))}
            </div>
          </div>
        )}

        {/* Course Catalog Explorer Filter Section */}
        <section className="space-y-6">
          <CatalogFilters
            filters={filters}
            onFilterChange={setFilters}
            totalCoursesCount={courses.length}
            filteredCoursesCount={filteredCourses.length}
            igotCount={igotCount}
            nsstaCount={nsstaCount}
          />

          {/* Course Grid Results */}
          <CourseGrid
            courses={filteredCourses}
            recommendations={recommendations}
            enrolledCourseIds={enrolledCourseIds}
            onEnroll={handleEnroll}
            onResetFilters={() =>
              setFilters({
                source: "ALL",
                domain: "ALL",
                cadre: "ALL",
                deliveryMode: "ALL",
                level: "ALL",
                search: "",
              })
            }
            isLoading={isLoading}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
