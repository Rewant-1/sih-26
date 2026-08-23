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
  Layers,
  MapPin,
  PlayCircle,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SunbirdCBCourse, CourseRecommendation } from "@/lib/types";

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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">
                Personalized Learning Roadmap
              </CardTitle>
              <Badge variant="saffron" size="sm">
                iGOT + NSSTA TPAC
              </Badge>
            </div>
            <CardDescription>
              Curated course sequence targeted at closing your priority FRAC gaps
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-[#FF9933]" />
              {recommendations.length} Courses
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#000080]" />
              ~{Math.round(totalEffortHours)} Hours
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <GraduationCap className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No Course Recommendations Needed
            </p>
            <p className="text-xs text-slate-500 mt-1">
              You are currently meeting or exceeding benchmarks for all assessed
              competencies.
            </p>
            <div className="mt-4">
              <Link href={`/catalog?user=${userId}`}>
                <Button size="sm" variant="outline">
                  Browse Full Course Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
            {recommendations.map((rec, index) => {
              const { course } = rec;
              const isEnrolled = enrolledState[course.identifier];
              const isCompleted = completedCourseIds.includes(course.identifier);
              const isNSSTA = course.source === "NSSTA TPAC";

              return (
                <div key={course.identifier} className="relative pl-6">
                  {/* Step Timeline Number Icon */}
                  <div
                    className={`absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-sm ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isEnrolled
                        ? "border-[#FF9933] bg-[#FF9933] text-white"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Course Card */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={isNSSTA ? "nssta" : "igot"}
                            size="sm"
                          >
                            {course.source}
                          </Badge>
                          <span className="text-[11px] font-mono text-slate-500">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                            Target: {rec.targetCompetencyName}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {course.name}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 font-medium">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {course.duration}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                            {course.deliveryMode}
                          </span>
                          {course.tpacMetadata?.venue && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-blue-800">
                                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                {course.tpacMetadata.venue.split(",")[0]}
                              </span>
                            </>
                          )}
                          {course.tpacMetadata?.batchSchedule && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-emerald-700">
                                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                                {course.tpacMetadata.batchSchedule}
                              </span>
                            </>
                          )}
                        </div>

                        {rec.recommendationReason && (
                          <p className="text-[11px] text-indigo-900 bg-indigo-50/70 rounded-md px-2.5 py-1 font-medium mt-2">
                            💡 Why recommended: {rec.recommendationReason}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </span>
                        ) : isEnrolled ? (
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="sm"
                              variant="navy"
                              className="text-xs h-8 px-3"
                              onClick={() => handleToggleEnroll(course.identifier)}
                            >
                              <PlayCircle className="h-3.5 w-3.5 mr-1" />
                              Continue Learning
                            </Button>
                            <span className="text-[10px] text-emerald-600 font-medium">
                              Enrolled on iGOT/NSSTA
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="sm"
                              variant={isNSSTA ? "navy" : "saffron"}
                              className="text-xs h-8 px-3"
                              onClick={() => handleToggleEnroll(course.identifier)}
                            >
                              {isNSSTA ? "Nominate Batch" : "Enroll on iGOT"}
                            </Button>
                            {course.tpacMetadata?.nominationDeadline && (
                              <span className="text-[10px] text-slate-400">
                                Deadline: {course.tpacMetadata.nominationDeadline}
                              </span>
                            )}
                          </div>
                        )}

                        <Link
                          href={`/catalog?search=${encodeURIComponent(
                            course.code
                          )}&user=${userId}`}
                          className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline flex items-center gap-0.5"
                        >
                          Course details <ExternalLink className="h-2.5 w-2.5" />
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
