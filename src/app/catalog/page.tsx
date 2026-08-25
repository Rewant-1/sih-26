"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  CatalogFilters,
  type FilterState,
} from "@/components/catalog/CatalogFilters";
import { CourseGrid } from "@/components/catalog/CourseGrid";
import { CourseCard } from "@/components/catalog/CourseCard";
import type { SunbirdCBCourse, CourseRecommendation } from "@/lib/types/sunbird";
import type { CadreId } from "@/lib/types/frac";
import {
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header activeUserId={activeUserId} />

      {/* Enrollment Toast */}
      {enrollmentToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white text-[#142446] p-4 rounded-xl shadow-lg border border-[#C7C2BA] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#D8921E] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[13px] mb-0.5">Enrollment Confirmed</p>
            <p className="text-[#475A6F] text-[12px] leading-snug">{enrollmentToast}</p>
          </div>
          <button
            onClick={() => setEnrollmentToast(null)}
            className="text-[#475A6F] hover:text-[#142446] text-xs ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Title Bar (Light Theme) */}
      <div className="bg-white border-b border-[#C7C2BA]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-[12px] text-[#475A6F] mb-2">
            <Link href="/" className="hover:text-[#D8921E] transition-colors">Home</Link>
            <span className="text-[#C7C2BA]">/</span>
            <span className="text-[#142446] font-medium">Course Catalog</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[#142446] leading-tight">
                Course Catalog
              </h1>
              <p className="text-[14px] text-[#475A6F] max-w-2xl mt-1 leading-relaxed">
                {courses.length} accredited training programmes mapped to FRAC competencies — iGOT Karmayogi and NSSTA TPAC.
              </p>
            </div>
            <div className="flex gap-6 shrink-0">
              <div className="p-3 bg-[#FAF9F6] border border-[#C7C2BA]/60 rounded-xl text-center min-w-[100px]">
                <div className="text-[24px] font-bold text-[#142446] leading-none">{igotCount}</div>
                <div className="text-[10px] font-bold text-[#475A6F] uppercase tracking-wider mt-1">iGOT Courses</div>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#C7C2BA]/60 rounded-xl text-center min-w-[100px]">
                <div className="text-[24px] font-bold text-[#142446] leading-none">{nsstaCount}</div>
                <div className="text-[10px] font-bold text-[#475A6F] uppercase tracking-wider mt-1">NSSTA TPAC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Personalized Recommendations (Open layout, no nested box) */}
        {topRecommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#C7C2BA]/40">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#142446] text-white">
                  Personalized Recommendations
                </span>
                <h2 className="text-xl font-bold text-[#142446] mt-1.5">
                  Recommended for {activeOfficerName}
                </h2>
                <p className="text-xs text-[#475A6F] mt-0.5">
                  Courses mapped directly to bridge your priority skill gaps.
                </p>
              </div>
              <Link
                href={`/dashboard/learner?user=${activeUserId}`}
                className="text-xs font-bold text-[#142446] hover:text-[#475A6F] transition-colors shrink-0"
              >
                View Full Roadmap →
              </Link>
            </div>

            {/* Spotlight Grid (Clean 3-column rows without outer container cage) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142446] border-t-transparent" />
        </div>
      }
    >
      <CourseCatalogContent />
    </Suspense>
  );
}
