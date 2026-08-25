"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Info,
  Layers,
  MapPin,
  PlayCircle,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CourseRecommendation } from "@/lib/types";

interface LearningRoadmapProps {
  recommendations: CourseRecommendation[];
  enrolledCourseIds?: string[];
  completedCourseIds?: string[];
  userId?: string;
}

export function LearningRoadmap({
  recommendations,
  enrolledCourseIds = [],
  completedCourseIds = [],
  userId = "usr-jso-rajesh",
}: LearningRoadmapProps) {
  const [enrolledState, setEnrolledState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    enrolledCourseIds.forEach((id) => {
      initial[id] = true;
    });
    return initial;
  });

  const handleToggleEnroll = (courseId: string) => {
    setEnrolledState((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const totalEffortHours = recommendations.reduce(
    (acc, r) => acc + (r.estimatedEffortHours || r.course.durationMinutes / 60 || 0),
    0
  );

  return (
    <Card className="w-full border-[#C7C2BA] bg-white">
      <CardHeader className="pb-3 border-b border-[#C7C2BA]/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg text-[#142446] font-bold">
                Personalized Learning Roadmap
              </CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                iGOT + NSSTA TPAC
              </span>
            </div>
            <CardDescription className="text-xs text-[#475A6F]">
              Curated course sequence targeted at closing your priority FRAC gaps
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-[#475A6F] bg-[#FAF9F6] px-3 py-1.5 rounded-lg border border-[#C7C2BA]">
            <span className="flex items-center gap-1 font-semibold text-[#142446]">
              <BookOpen className="h-3.5 w-3.5 text-[#D8921E]" />
              {recommendations.length} Courses
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#475A6F]" />
              ~{Math.round(totalEffortHours)} Hours
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF9F6] rounded-xl border border-dashed border-[#C7C2BA]">
            <GraduationCap className="h-8 w-8 text-[#475A6F] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#142446]">
              No Course Recommendations Needed
            </p>
            <p className="text-xs text-[#475A6F] mt-1">
              You are currently meeting or exceeding benchmarks for all assessed competencies.
            </p>
            <div className="mt-4">
              <Link href={`/catalog?user=${userId}`}>
                <Button size="sm" variant="outline" className="border-[#C7C2BA] text-[#142446]">
                  Browse Full Course Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#C7C2BA] ml-4 space-y-6 py-2">
            {recommendations.map((rec, index) => {
              const { course } = rec;
              const isEnrolled = enrolledState[course.identifier];
              const isCompleted = completedCourseIds.includes(course.identifier);
              const isNSSTA = course.source === "NSSTA TPAC";

              return (
                <div key={course.identifier} className="relative pl-6">
                  {/* Step Timeline Number Icon */}
                  <div
                    className={`absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                      isCompleted
                        ? "border-[#142446] bg-[#142446] text-white"
                        : isEnrolled
                        ? "border-[#D8921E] bg-[#D8921E] text-white"
                        : "border-[#C7C2BA] bg-white text-[#142446]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Course Card */}
                  <div className="rounded-xl border border-[#C7C2BA] bg-white p-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isNSSTA
                                ? "bg-[#142446] text-white"
                                : "bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]"
                            }`}
                          >
                            {course.source}
                          </span>
                          <span className="text-[11px] font-mono text-[#475A6F]">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-[#142446] font-semibold bg-[#FAF9F6] border border-[#C7C2BA] px-2 py-0.5 rounded">
                            Target: {rec.targetCompetencyName}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-[#142446] leading-snug">
                          {course.name}
                        </h4>

                        <p className="text-xs text-[#475A6F] line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475A6F] pt-1 font-medium">
                          <span className="flex items-center gap-1 text-[#142446]">
                            <Clock className="h-3.5 w-3.5 text-[#475A6F]" />
                            {course.duration}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5 text-[#475A6F]" />
                            {course.deliveryMode}
                          </span>
                          {course.tpacMetadata?.venue && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1 text-[#142446]">
                                <MapPin className="h-3.5 w-3.5 text-[#475A6F]" />
                                {course.tpacMetadata.venue.split(",")[0]}
                              </span>
                            </>
                          )}
                          {course.tpacMetadata?.batchSchedule && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1 text-[#142446]">
                                <Calendar className="h-3.5 w-3.5 text-[#D8921E]" />
                                {course.tpacMetadata.batchSchedule}
                              </span>
                            </>
                          )}
                        </div>

                        {rec.recommendationReason && (
                          <p className="text-[11px] text-[#142446] bg-[#FAF9F6] border border-[#C7C2BA] rounded-md px-2.5 py-1 font-medium mt-2">
                            Reason: {rec.recommendationReason}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#142446] bg-[#F3E7D1] px-3 py-1.5 rounded-lg border border-[#C7C2BA]">
                            <CheckCircle2 className="h-4 w-4 text-[#142446]" />
                            Completed
                          </span>
                        ) : isEnrolled ? (
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleToggleEnroll(course.identifier)}
                              className="text-xs font-bold bg-[#142446] hover:bg-[#1e3460] text-white flex items-center gap-1.5"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              <span>Continue Learning</span>
                            </Button>
                            <span className="text-[10px] text-[#475A6F]">
                              Enrolled on {isNSSTA ? "NSSTA" : "iGOT"}
                            </span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleToggleEnroll(course.identifier)}
                            className="text-xs font-bold bg-[#D8921E] hover:bg-[#c27f14] text-white"
                          >
                            {isNSSTA ? "Nominate Batch" : "Enroll on iGOT"}
                          </Button>
                        )}

                        <Link
                          href={`/catalog?q=${encodeURIComponent(course.name)}`}
                          className="text-[11px] text-[#475A6F] hover:text-[#142446] font-medium"
                        >
                          Course details ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
