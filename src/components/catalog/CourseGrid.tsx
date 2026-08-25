"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  FilterX,
  Grid3X3,
  List,
  Target,
} from "lucide-react";
import type { SunbirdCBCourse, CourseRecommendation } from "@/lib/types/sunbird";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/Button";

export type SortOption =
  | "RELEVANCE"
  | "RATING_DESC"
  | "ENROLLED_DESC"
  | "DURATION_ASC"
  | "DURATION_DESC"
  | "NAME_ASC";

export interface CourseGridProps {
  courses: SunbirdCBCourse[];
  recommendations?: CourseRecommendation[];
  enrolledCourseIds?: string[];
  onEnroll?: (courseId: string) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export function CourseGrid({
  courses,
  recommendations = [],
  enrolledCourseIds = [],
  onEnroll,
  onResetFilters,
  isLoading = false,
}: CourseGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>(
    recommendations.length > 0 ? "RELEVANCE" : "RATING_DESC"
  );

  // Map recommendation data for quick lookup
  const recMap = useMemo(() => {
    const map = new Map<string, CourseRecommendation>();
    for (const rec of recommendations) {
      map.set(rec.course.identifier, rec);
    }
    return map;
  }, [recommendations]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    const list = [...courses];

    switch (sortBy) {
      case "RELEVANCE":
        return list.sort((a, b) => {
          const scoreA = recMap.get(a.identifier)?.relevanceScore ?? 0;
          const scoreB = recMap.get(b.identifier)?.relevanceScore ?? 0;
          if (scoreB !== scoreA) {
            return scoreB - scoreA;
          }
          return b.rating - a.rating;
        });

      case "RATING_DESC":
        return list.sort((a, b) => b.rating - a.rating);

      case "ENROLLED_DESC":
        return list.sort((a, b) => b.enrolledCount - a.enrolledCount);

      case "DURATION_ASC":
        return list.sort((a, b) => a.durationMinutes - b.durationMinutes);

      case "DURATION_DESC":
        return list.sort((a, b) => b.durationMinutes - a.durationMinutes);

      case "NAME_ASC":
        return list.sort((a, b) => a.name.localeCompare(b.name));

      default:
        return list;
    }
  }, [courses, sortBy, recMap]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 rounded-2xl bg-[#FAF9F6] border border-[#C7C2BA]"
          />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#C7C2BA] bg-white">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#C7C2BA] flex items-center justify-center text-[#475A6F] mb-4">
          <FilterX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#142446] mb-1">
          No courses match your filter criteria
        </h3>
        <p className="text-xs text-[#475A6F] max-w-md mx-auto mb-6">
          Try expanding your search query, switching between iGOT Karmayogi and NSSTA TPAC sources, or selecting &ldquo;All Domains&rdquo;.
        </p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters} className="border-[#C7C2BA] text-[#142446]">
            Reset Filter Options
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Bar: Results Counter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#142446] text-sm">
            Showing {sortedCourses.length} Courses
          </span>
          {recommendations.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#F3E7D1] text-[#142446] font-semibold px-2 py-0.5 rounded-full border border-[#C7C2BA]">
              <Target className="w-3 h-3 text-[#D8921E]" />
              <span>{recommendations.length} Recommended for Profile</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#475A6F]" />
            <span className="text-[#475A6F] font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="py-1.5 px-2.5 bg-white border border-[#C7C2BA] rounded-lg text-xs font-semibold text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
            >
              {recommendations.length > 0 && (
                <option value="RELEVANCE">Relevance / Gap Fit</option>
              )}
              <option value="RATING_DESC">Highest Rated</option>
              <option value="ENROLLED_DESC">Most Popular</option>
              <option value="DURATION_ASC">Duration (Shortest First)</option>
              <option value="DURATION_DESC">Duration (Longest First)</option>
              <option value="NAME_ASC">Course Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards Grid (Spacious 2-column institutional layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCourses.map((course) => {
          const rec = recMap.get(course.identifier);
          const isEnrolled = enrolledCourseIds.includes(course.identifier);

          return (
            <CourseCard
              key={course.identifier}
              course={course}
              isEnrolled={isEnrolled}
              onEnroll={onEnroll}
              relevanceScore={rec?.relevanceScore}
              recommendationReason={rec?.recommendationReason}
              matchedCompetenciesCount={rec?.targetCompetencyId ? 1 : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
