"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
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

function CourseCatalogContent() {
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
    return filterCourseCatalog(courses, {
      source: filters.source === "ALL" ? undefined : filters.source,
      domain: filters.domain === "ALL" ? undefined : filters.domain,
      cadre: filters.cadre === "ALL" ? undefined : filters.cadre,
      level: filters.level === "ALL" ? undefined : filters.level,
      search: filters.search || undefined,
    } as any);
  }, [courses, filters]);

  // Counts
  const igotCount = courses.filter((c) => c.source === "iGOT Karmayogi").length;
  const nsstaCount = courses.filter((c) => c.source === "NSSTA TPAC").length;

  // Top 3 Recommended courses for the spotlight banner
  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 3);
  }, [recommendations]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f5]">
      <Header activeUserId={activeUserId} />

      {/* Enrollment Toast */}
      {enrollmentToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#142446] text-white p-4 rounded-xl shadow-xl border border-[#1e3460] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#D8921E] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[13px] mb-0.5">Enrollment Confirmed</p>
            <p className="text-[#B7C7D9] text-[12px] leading-snug">{enrollmentToast}</p>
          </div>
          <button
            onClick={() => setEnrollmentToast(null)}
            className="text-[#B7C7D9] hover:text-white text-xs ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Title Bar */}
      <div className="bg-[#142446] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="flex items-center gap-2 text-[12px] text-[#B7C7D9] mb-3">
            <Link href="/" className="hover:text-[#D8921E] transition-colors">Home</Link>
            <span className="text-[#475A6F]">/</span>
            <span className="text-white font-medium">Course Catalog</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[32px] sm:text-[40px] font-light text-white mb-2">
                Course Catalog
              </h1>
              <p className="text-[14px] text-[#B7C7D9] max-w-2xl leading-relaxed">
                {courses.length} accredited training programmes mapped to FRAC competencies — iGOT Karmayogi and NSSTA TPAC.
              </p>
            </div>
            <div className="flex gap-8 shrink-0">
              <div className="text-right">
                <div className="text-[32px] font-light text-white">{igotCount}</div>
                <div className="text-[11px] text-[#B7C7D9] uppercase tracking-wider">iGOT Courses</div>
              </div>
              <div className="text-right">
                <div className="text-[32px] font-light text-white">{nsstaCount}</div>
                <div className="text-[11px] text-[#B7C7D9] uppercase tracking-wider">NSSTA TPAC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 flex-1 w-full space-y-8">
        {/* Personalized Recommendations */}
        {topRecommendations.length > 0 && (
          <div className="rounded-xl border border-[#e8e4dc] bg-white p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-1">Personalized for You</p>
                <h2 className="text-[18px] font-semibold text-[#142446]">
                  Recommended for {activeOfficerName}
                </h2>
                <p className="text-[13px] text-[#475A6F] mt-0.5">
                  Matched to your cadre profile and identified skill gaps.
                </p>
              </div>
              <Link
                href={`/dashboard/learner?user=${activeUserId}`}
                className="text-[13px] font-semibold text-[#142446] hover:text-[#D8921E] transition-colors shrink-0"
              >
                View Full Roadmap →
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

export default function CourseCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
        </div>
      }
    >
      <CourseCatalogContent />
    </Suspense>
  );
}
