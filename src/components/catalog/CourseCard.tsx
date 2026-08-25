"use client";

import React, { useState } from "react";
import {
  Building2,
  Clock,
  ExternalLink,
  GraduationCap,
  Target,
} from "lucide-react";
import type { SunbirdCBCourse } from "@/lib/types/sunbird";
import { Button } from "@/components/ui/Button";

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
      {/* Spacious, Structured Course Item (Decluttered, Non-AI Look) */}
      <div className="rounded-2xl border border-[#C7C2BA] bg-white p-6 flex flex-col justify-between space-y-4 hover:border-[#142446]/40 transition-colors">
        
        {/* Top Metadata Row */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isNSSTA
                    ? "bg-[#142446] text-white"
                    : "bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]"
                }`}
              >
                {isNSSTA ? (
                  <Building2 className="w-3 h-3" />
                ) : (
                  <GraduationCap className="w-3 h-3" />
                )}
                <span>{course.source}</span>
              </span>

              <span className="text-[11px] text-[#475A6F] font-medium">
                {course.deliveryMode.split("(")[0].trim()} · {course.duration}
              </span>
            </div>

            {typeof relevanceScore === "number" && (
              <span className="text-[11px] font-bold text-[#142446] px-2 py-0.5 rounded bg-[#F3E7D1] border border-[#C7C2BA] shrink-0">
                {relevanceScore}% Gap Fit
              </span>
            )}
          </div>

          {/* Title and Organization */}
          <div>
            <span className="text-[11px] font-mono text-[#475A6F] block">
              {course.code}
            </span>
            <h3 className="text-base font-bold text-[#142446] leading-snug mt-0.5">
              {course.name}
            </h3>
            <p className="text-xs text-[#475A6F] mt-1">
              {course.organisation}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-[#475A6F] leading-relaxed line-clamp-2">
            {course.description}
          </p>

          {/* Recommendation Note */}
          {recommendationReason && (
            <p className="text-[11px] text-[#142446] font-medium p-2 rounded-lg bg-[#FAF9F6] border border-[#C7C2BA]/60">
              Role Recommendation: {recommendationReason}
            </p>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-4 border-t border-[#C7C2BA]/40 flex items-center justify-between gap-4">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="text-xs font-semibold text-[#142446] hover:text-[#D8921E] transition-colors"
          >
            View Syllabus & Modules →
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant={enrolled ? "outline" : isNSSTA ? "navy" : "saffron"}
              size="sm"
              onClick={handleEnrollClick}
              disabled={enrolled || isEnrolling}
              className="text-xs font-bold"
            >
              {enrolled ? "Enrolled" : isNSSTA ? "Nominate / Apply" : "Enroll Free"}
            </Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 bg-[#142446]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#C7C2BA]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#C7C2BA]/50">
              <div>
                <span className="text-xs font-mono text-[#475A6F]">{course.code}</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#142446] mt-0.5">
                  {course.name}
                </h2>
                <p className="text-xs text-[#475A6F] mt-1">{course.organisation}</p>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-[#475A6F] hover:text-[#142446] text-xl font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Course Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446]">
                Course Overview
              </h4>
              <p className="text-xs text-[#475A6F] leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Modules List */}
            {course.modules && course.modules.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446]">
                  Curriculum Modules ({course.modules.length})
                </h4>
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
