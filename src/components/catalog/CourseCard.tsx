"use client";

import React, { useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Info,
  MapPin,
  Star,
  Target,
  Users,
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
    }, 300);
  };

  const isNSSTA = course.source === "NSSTA TPAC";

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden border-[#C7C2BA] bg-white shadow-xs relative">
        {/* Top Solid Highlight Stripe (No gradient) */}
        <div
          className={`h-1.5 w-full ${
            isNSSTA ? "bg-[#142446]" : "bg-[#D8921E]"
          }`}
        />

        <div className="p-5 flex-1 flex flex-col">
          {/* Header Bar: Badges & Relevance */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Source Badge */}
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                  isNSSTA
                    ? "bg-[#142446] text-white"
                    : "bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]"
                }`}
              >
                {isNSSTA ? (
                  <Building2 className="w-3 h-3" />
                ) : (
                  <GraduationCap className="w-3 h-3" />
                )}
                <span>{course.source}</span>
              </span>

              {/* Delivery Mode Badge */}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475A6F] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#C7C2BA]/60">
                <Clock className="w-2.5 h-2.5 text-[#475A6F]" />
                <span>{course.deliveryMode.split("(")[0].trim()}</span>
              </span>
            </div>

            {/* Relevance Score Pill if passed */}
            {typeof relevanceScore === "number" && (
              <div className="flex items-center gap-1 bg-[#F3E7D1] border border-[#C7C2BA] text-[#142446] px-2 py-0.5 rounded text-xs font-bold">
                <Target className="w-3 h-3 text-[#D8921E]" />
                <span>{relevanceScore}% Match</span>
              </div>
            )}
          </div>

          {/* Course Code & Title */}
          <div className="mb-2">
            <span className="text-[11px] font-mono font-semibold text-[#475A6F] block mb-0.5">
              {course.code}
            </span>
            <h3 className="font-bold text-[#142446] text-base leading-snug line-clamp-2">
              {course.name}
            </h3>
          </div>

          {/* Organisation */}
          <p className="text-xs font-medium text-[#475A6F] mb-2.5 flex items-center gap-1.5">
            <span className="truncate">{course.organisation}</span>
          </p>

          {/* Course Description */}
          <p className="text-xs text-[#475A6F] line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>

          {/* Recommendation Reason Banner if present */}
          {recommendationReason && (
            <div className="mb-3.5 p-2 rounded-lg bg-[#FAF9F6] border border-[#C7C2BA] text-[11px] text-[#142446] leading-snug flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#D8921E] shrink-0 mt-0.5" />
              <span>{recommendationReason}</span>
            </div>
          )}

          {/* Competency Chips */}
          <div className="space-y-1.5 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#475A6F]">
              Competencies Covered ({course.competencies.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {course.competencies.map((comp) => (
                <span
                  key={comp.id}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]/60 px-2 py-0.5 rounded-md"
                >
                  <span className="truncate max-w-[180px]">{comp.name}</span>
                  <span className="bg-[#142446] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                    L{comp.level}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* NSSTA Residential Calendar Notice if applicable */}
          {course.tpacMetadata && (
            <div className="mb-4 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#C7C2BA] text-xs text-[#142446] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#142446] text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#D8921E]" />
                <span>Batch: {course.tpacMetadata.batchSchedule}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#475A6F] text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#475A6F]" />
                <span className="truncate">{course.tpacMetadata.venue}</span>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="mt-auto pt-3 border-t border-[#C7C2BA]/40 grid grid-cols-3 gap-2 text-center text-xs text-[#475A6F]">
            <div className="flex flex-col items-center justify-center p-1 rounded bg-[#FAF9F6]">
              <span className="text-[10px] text-[#475A6F] font-medium">Duration</span>
              <span className="font-semibold text-[#142446] text-[11px] truncate w-full">
                {course.duration}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 rounded bg-[#FAF9F6]">
              <span className="text-[10px] text-[#475A6F] font-medium">Rating</span>
              <span className="font-semibold text-[#142446] text-[11px] flex items-center gap-0.5 justify-center">
                <Star className="w-3 h-3 fill-[#D8921E] text-[#D8921E]" />
                {course.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 rounded bg-[#FAF9F6]">
              <span className="text-[10px] text-[#475A6F] font-medium">Enrolled</span>
              <span className="font-semibold text-[#142446] text-[11px]">
                {course.enrolledCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 pt-2 pb-4 bg-[#FAF9F6] border-t border-[#C7C2BA]/40 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailsModal(true)}
            className="text-xs font-semibold text-[#142446] border-[#C7C2BA] bg-white hover:bg-[#FAF9F6] flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#475A6F]" />
            <span>Syllabus</span>
          </Button>

          <Button
            variant={enrolled ? "outline" : isNSSTA ? "navy" : "saffron"}
            size="sm"
            onClick={handleEnrollClick}
            disabled={enrolled || isEnrolling}
            isLoading={isEnrolling}
            className={`text-xs font-bold flex items-center gap-1.5 min-w-[110px] ${
              enrolled
                ? "bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]"
                : isNSSTA
                ? "bg-[#142446] text-white hover:bg-[#1e3460]"
                : "bg-[#D8921E] text-white hover:bg-[#c27f14]"
            }`}
          >
            {enrolled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#142446]" />
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#142446]/40 p-4 backdrop-blur-xs"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-[#C7C2BA] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#C7C2BA]/40 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                    {course.source}
                  </span>
                  <span className="text-xs font-mono text-[#475A6F]">
                    {course.code}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#142446]">
                  {course.name}
                </h2>
                <p className="text-xs text-[#475A6F] mt-1">
                  {course.organisation} · {course.deliveryMode}
                </p>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="rounded-lg p-1.5 text-[#475A6F] hover:bg-[#FAF9F6] hover:text-[#142446]"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Course Overview
              </h3>
              <p className="text-xs text-[#142446] leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Competency Alignment */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Aligned FRAC Competencies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.competencies.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-2.5 rounded-lg border border-[#C7C2BA]/60 bg-[#FAF9F6] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#142446]">{comp.name}</p>
                      <p className="text-[10px] text-[#475A6F] font-mono">{comp.id}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#142446] text-white">
                      Target L{comp.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                Target Cadres
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {course.targetAudience.map((aud, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446]"
                  >
                    {aud.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Syllabus Modules */}
            {course.modules && course.modules.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
                  Curriculum & Modules ({course.modules.length})
                </h3>
                <div className="space-y-2">
                  {course.modules.map((mod, i) => (
                    <div
                      key={`mod-${i}-${mod.title}`}
                      className="p-3 rounded-lg border border-[#C7C2BA]/60 bg-[#FAF9F6] flex items-start gap-3"
                    >
                      <span className="text-xs font-bold text-[#142446] font-mono w-5">
                        0{i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#142446]">{mod.title}</p>
                        {mod.learningOutcomes && mod.learningOutcomes.length > 0 && (
                          <p className="text-[11px] text-[#475A6F] mt-0.5">{mod.learningOutcomes[0]}</p>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-[#475A6F]">
                        {mod.durationMinutes}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#C7C2BA]/40 flex items-center justify-between">
              <a
                href={(course as any).url || "https://igotkarmayogi.gov.in"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142446] hover:text-[#D8921E]"
              >
                <span>Open in iGOT Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button
                variant={enrolled ? "outline" : isNSSTA ? "navy" : "saffron"}
                size="sm"
                onClick={handleEnrollClick}
                disabled={enrolled || isEnrolling}
                className="text-xs font-bold"
              >
                {enrolled ? "Already Enrolled" : isNSSTA ? "Nominate / Apply" : "Enroll Free"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
