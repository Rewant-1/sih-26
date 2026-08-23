"use client";

import React, { useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Info,
  MapPin,
  Sparkles,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SunbirdCBCourse } from "@/lib/types/sunbird";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface CourseCardProps {
  course: SunbirdCBCourse;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  relevanceScore?: number;
  recommendationReason?: string;
  matchedCompetenciesCount?: number;
}

export function CourseCard({
  course,
  isEnrolled = false,
  onEnroll,
  relevanceScore,
  recommendationReason,
  matchedCompetenciesCount,
}: CourseCardProps) {
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOutcomes, setShowOutcomes] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enrolled) return;

    setIsEnrolling(true);
    setTimeout(() => {
      setEnrolled(true);
      setIsEnrolling(false);
      if (onEnroll) {
        onEnroll(course.identifier);
      }
    }, 400);
  };

  const isNSSTA = course.source === "NSSTA TPAC";

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 relative group">
        {/* Top Highlight Stripe */}
        <div
          className={`h-1.5 w-full ${
            isNSSTA
              ? "bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900"
              : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
          }`}
        />

        <div className="p-5 flex-1 flex flex-col">
          {/* Header Bar: Badges & Relevance */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Source Badge */}
              <Badge
                variant={isNSSTA ? "nssta" : "igot"}
                size="sm"
                className="font-bold flex items-center gap-1"
              >
                {isNSSTA ? (
                  <Building2 className="w-3 h-3 text-blue-800" />
                ) : (
                  <GraduationCap className="w-3 h-3 text-orange-700" />
                )}
                <span>{course.source}</span>
              </Badge>

              {/* Delivery Mode Badge */}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                <Clock className="w-2.5 h-2.5 text-slate-400" />
                <span>{course.deliveryMode.split("(")[0].trim()}</span>
              </span>
            </div>

            {/* Relevance Score Pill if passed */}
            {typeof relevanceScore === "number" && (
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{relevanceScore}% Match</span>
              </div>
            )}
          </div>

          {/* Course Code & Title */}
          <div className="mb-2">
            <span className="text-[11px] font-mono font-semibold text-slate-400 block mb-0.5">
              {course.code}
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors line-clamp-2">
              {course.name}
            </h3>
          </div>

          {/* Organisation */}
          <p className="text-xs font-medium text-slate-500 mb-2.5 flex items-center gap-1.5">
            <span className="truncate">{course.organisation}</span>
          </p>

          {/* Course Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>

          {/* Recommendation Reason Banner if present */}
          {recommendationReason && (
            <div className="mb-3.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-snug flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{recommendationReason}</span>
            </div>
          )}

          {/* Competency Chips */}
          <div className="space-y-1.5 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Competencies Covered ({course.competencies.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {course.competencies.map((comp) => (
                <span
                  key={comp.id}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <span className="truncate max-w-[180px]">{comp.name}</span>
                  <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    L{comp.level}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* NSSTA Residential Calendar Notice if applicable */}
          {course.tpacMetadata && (
            <div className="mb-4 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-blue-900 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>Batch: {course.tpacMetadata.batchSchedule}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{course.tpacMetadata.venue}</span>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
            <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-50">
              <span className="text-[10px] text-slate-400 font-medium">Duration</span>
              <span className="font-semibold text-slate-800 text-[11px] truncate w-full">
                {course.duration}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-50">
              <span className="text-[10px] text-slate-400 font-medium">Rating</span>
              <span className="font-semibold text-amber-700 text-[11px] flex items-center gap-0.5 justify-center">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                {course.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-50">
              <span className="text-[10px] text-slate-400 font-medium">Enrolled</span>
              <span className="font-semibold text-slate-800 text-[11px]">
                {course.enrolledCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 pt-2 pb-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailsModal(true)}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Syllabus</span>
          </Button>

          <Button
            variant={enrolled ? "success" : isNSSTA ? "navy" : "saffron"}
            size="sm"
            onClick={handleEnrollClick}
            disabled={enrolled || isEnrolling}
            isLoading={isEnrolling}
            className="text-xs font-semibold flex items-center gap-1.5 min-w-[110px]"
          >
            {enrolled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enrolled</span>
              </>
            ) : isNSSTA ? (
              <>
                <Building2 className="w-3.5 h-3.5" />
                <span>Nominate / Apply</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Enroll Free</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Course Details / Syllabus Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in-50">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={isNSSTA ? "nssta" : "igot"} size="sm">
                    {course.source}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    {course.code}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {course.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provided by {course.organisation} • Framework: {course.framework}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Overview & Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Course Overview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Target Audience Cadres */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Cadres
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.targetAudience.map((cadre) => (
                  <span
                    key={cadre}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200"
                  >
                    <Users className="w-3 h-3 text-indigo-700" />
                    <span>{cadre.replace(/_/g, " ")}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Learning Outcomes
                </h4>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modules / Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Curriculum &amp; Modules ({course.modules.length} Modules)
                </h4>
                <div className="space-y-2.5">
                  {course.modules.map((mod, idx) => (
                    <div
                      key={mod.moduleId || idx}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/80"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                        <span>
                          Module {idx + 1}: {mod.title}
                        </span>
                        <span className="text-slate-500 font-normal">
                          {mod.durationMinutes} mins
                        </span>
                      </div>
                      {mod.learningOutcomes && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {mod.learningOutcomes.map((o, oIdx) => (
                            <span
                              key={oIdx}
                              className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200"
                            >
                              • {o}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NSSTA Institutional Details */}
            {course.tpacMetadata && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                <div className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>NSSTA Greater Noida Training Facility</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-500">Batch Schedule:</span>{" "}
                    <strong>{course.tpacMetadata.batchSchedule}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Venue:</span>{" "}
                    <strong>{course.tpacMetadata.venue}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Course Director:</span>{" "}
                    <strong>{course.tpacMetadata.courseDirector}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Nomination Deadline:</span>{" "}
                    <strong>{course.tpacMetadata.nominationDeadline}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button
                variant={enrolled ? "success" : isNSSTA ? "navy" : "saffron"}
                size="md"
                onClick={handleEnrollClick}
                disabled={enrolled || isEnrolling}
                isLoading={isEnrolling}
              >
                {enrolled ? "Already Enrolled" : isNSSTA ? "Apply for Nomination" : "Direct Enrollment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
