"use client";

import React, { useState } from "react";
import Link from "next/link";

interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  highlights: string[];
  href: string;
  actionText: string;
  metric: string;
  metricLabel: string;
}

const HUBS: HubItem[] = [
  {
    id: "competency",
    title: "FRAC Competency Hub",
    subtitle: "29 MoSPI Competencies · 4 Domains",
    category: "Cadre Gap Intelligence",
    description:
      "Automated evaluation of official profiles against predefined FRAC competency benchmarks across Statistical, Technical, Digital Governance, and Behavioural domains with Level 1–5 rubrics.",
    highlights: [
      "ISS AD, SSO, and JSO cadre-specific benchmark mapping",
      "Dynamic skill-gap score calculation across 29 competencies",
      "Transparent readiness scoring for career progression",
    ],
    href: "/assessment",
    actionText: "Launch Competency Hub",
    metric: "29",
    metricLabel: "Competencies Mapped",
  },
  {
    id: "learning",
    title: "iGOT & NSSTA Learning Hub",
    subtitle: "Dual-Source Course Ecosystem",
    category: "Personalized Pathways",
    description:
      "Integrates micro-courses from iGOT Karmayogi Bharat with residential and online training programmes from the National Statistical Systems Training Academy (NSSTA).",
    highlights: [
      "Sunbird API catalog sync with real-time completion tracking",
      "Priority course ranking mapped directly to identified skill gaps",
      "Self-paced e-learning & residential training calendar",
    ],
    href: "/catalog",
    actionText: "Explore Learning Hub",
    metric: "120+",
    metricLabel: "Curated Modules",
  },
  {
    id: "quiz",
    title: "AI Doc-to-Quiz Studio",
    subtitle: "Bloom-Weighted Assessment Engine",
    category: "Automated Evaluation",
    description:
      "Upload survey manuals, CPI circulars, or methodology PDFs. The AI engine extracts core concepts and generates objective MCQs with instant evaluation and verified rationale.",
    highlights: [
      "Automated MCQ generation from NSS manuals and guidelines",
      "Instant evaluation with detailed rationale for every answer",
      "Standard and custom assessment difficulty tiers",
    ],
    href: "/quiz-studio",
    actionText: "Open Quiz Studio",
    metric: "Instant",
    metricLabel: "MCQ Generation",
  },
  {
    id: "admin",
    title: "Division Heatmap & Analytics",
    subtitle: "MoSPI Workforce Intelligence",
    category: "Leadership Dashboard",
    description:
      "Comprehensive workforce analytics across FOD, ESD, NAD, DIID, and SDRD. Track training effectiveness, competency distributions, and emerging skill deficits.",
    highlights: [
      "Multi-division competency heatmaps and gap radars",
      "Predictive capacity building for emerging tech (AI, Big Data)",
      "Cadre-wise training completion and learning hour metrics",
    ],
    href: "/dashboard/admin",
    actionText: "View Analytics Hub",
    metric: "5 Divisions",
    metricLabel: "Workforce Visibility",
  },
];

export function KarmasarthiHubs() {
  const [activeHubId, setActiveHubId] = useState<string>("competency");

  const activeHub = HUBS.find((h) => h.id === activeHubId) || HUBS[0];

  return (
    <section className="bg-[#FAF9F6] border-t border-[#C7C2BA]/60 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C7C2BA]/60 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
              Core Intelligence Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight mt-1">
              Integrated Modules of Karmasarthi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#475A6F] max-w-xl">
            A unified platform architecture connecting self-assessments, tailored learning catalogs, document-to-quiz generation, and leadership analytics.
          </p>
        </div>

        {/* Hub Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {HUBS.map((hub) => {
            const isActive = hub.id === activeHubId;
            return (
              <button
                key={hub.id}
                onClick={() => setActiveHubId(hub.id)}
                className={`p-4 rounded-xl text-left border transition-colors ${
                  isActive
                    ? "bg-[#142446] text-white border-[#142446] shadow-sm"
                    : "bg-white text-[#142446] border-[#C7C2BA] hover:bg-[#FAF9F6]"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F3E7D1] text-[#142446]"
                }`}>
                  {hub.category}
                </span>
                <p className="text-sm font-bold mt-2 leading-snug">
                  {hub.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expansive Hub Detail View */}
        <div className="bg-white border border-[#C7C2BA] rounded-2xl p-6 sm:p-10 space-y-8">
          
          {/* Header Row with Metric */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#C7C2BA]/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
                {activeHub.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#142446] mt-0.5">
                {activeHub.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#475A6F] mt-1.5 leading-relaxed max-w-2xl">
                {activeHub.description}
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-xl bg-[#FAF9F6] border border-[#C7C2BA] shrink-0">
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-[#142446] leading-none">
                  {activeHub.metric}
                </p>
                <p className="text-[11px] text-[#475A6F] font-medium mt-1">
                  {activeHub.metricLabel}
                </p>
              </div>

              <Link
                href={activeHub.href}
                className="px-4 py-2.5 bg-[#142446] text-white text-xs font-bold rounded-lg hover:bg-[#1e3460] transition-colors shrink-0"
              >
                <span>{activeHub.actionText} →</span>
              </Link>
            </div>
          </div>

          {/* Highlights List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446]">
              Key Capabilities & Outcomes:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeHub.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF9F6] border border-[#C7C2BA]/60 space-y-1.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#F3E7D1] text-[#142446] flex items-center justify-center text-[10px] font-bold">
                    0{idx + 1}
                  </span>
                  <p className="text-xs font-medium text-[#142446] leading-snug">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
