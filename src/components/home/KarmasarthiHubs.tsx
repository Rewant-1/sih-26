"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Sparkles,
  BarChart3,
  FileCheck2,
  Users2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  highlights: string[];
  href: string;
  actionText: string;
  icon: React.ElementType;
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
    icon: Compass,
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
    icon: GraduationCap,
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
      "Bilingual support in English and Hindi for nationwide reach",
    ],
    href: "/quiz-studio",
    actionText: "Open Quiz Studio",
    icon: Sparkles,
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
    icon: BarChart3,
    metric: "5",
    metricLabel: "Divisions Covered",
  },
  {
    id: "acbp",
    title: "ACBP 2026–27 Planning Hub",
    subtitle: "Annual Capacity Building Plan",
    category: "Strategic Planning",
    description:
      "Structured framework for drafting, validating, and submitting the Annual Capacity Building Plan in full compliance with Capacity Building Commission (CBC) guidelines.",
    highlights: [
      "Automated ACBP generation from aggregated division gaps",
      "Prioritized budget and training slot allocation",
      "Alignment with national statistical priorities and SDGs",
    ],
    href: "/acbp",
    actionText: "Access ACBP Planner",
    icon: FileCheck2,
    metric: "100%",
    metricLabel: "CBC Compliant",
  },
  {
    id: "cadre",
    title: "Cadre Progression Hub",
    subtitle: "Role-Based Capacity Building",
    category: "Career Pathways",
    description:
      "Tailored developmental journeys for Indian Statistical Service (ISS) officers, Senior Statistical Officers (SSO), and Junior Statistical Officers (JSO).",
    highlights: [
      "Customized progression roadmaps from JSO to Senior Leadership",
      "Hands-on lab recommendations in Python, R, GIS, and Cloud",
      "Continuous progress sync with Karmayogi Bharat profile",
    ],
    href: "/dashboard/learner",
    actionText: "View Cadre Hub",
    icon: Users2,
    metric: "3",
    metricLabel: "Official Cadres",
  },
];

export function KarmasarthiHubs() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Orbital positions for 6 nodes on circle
  const nodePositions = [
    { top: "6%", left: "50%", transform: "translate(-50%, 0)" }, // Top
    { top: "27%", right: "6%", transform: "translate(0, -50%)" }, // Top Right
    { bottom: "27%", right: "6%", transform: "translate(0, 50%)" }, // Bottom Right
    { bottom: "6%", left: "50%", transform: "translate(-50%, 0)" }, // Bottom
    { bottom: "27%", left: "6%", transform: "translate(0, 50%)" }, // Bottom Left
    { top: "27%", left: "6%", transform: "translate(0, -50%)" }, // Top Left
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HUBS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeHub = HUBS[activeIdx];
  const ActiveIcon = activeHub.icon;

  return (
    <section className="bg-white border-t border-[#e8e4dc] py-20 lg:py-28 overflow-hidden relative">
      {/* Background Decorative Chevrons (echoing Karmayogi government aesthetic) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none hidden xl:block">
        <svg viewBox="0 0 400 400" className="w-full h-full text-[#475A6F]" fill="none" stroke="currentColor" strokeWidth="32">
          <path d="M120 40 L280 200 L120 360" />
          <path d="M220 40 L380 200 L220 360" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E7D1]/60 border border-[#e8d8b8] text-[#142446] text-[11px] font-semibold tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8921E]" />
            Official Statistics Capacity Ecosystem
          </div>
          <h2
            className="text-[32px] sm:text-[42px] font-light text-[#142446] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Karmasarthi Intelligence Hubs
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#475A6F] max-w-2xl mx-auto mt-3 leading-relaxed font-normal">
            An interconnected intelligence network powering every facet of statistical capacity building — from competency mapping to AI-generated assessments.
          </p>
        </div>

        {/* Main Interactive Hub Container */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Left: Orbital Radial System */}
          <div className="lg:col-span-6 flex justify-center items-center py-6">
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]">
              
              {/* Ambient radial glow */}
              <div className="absolute inset-0 rounded-full bg-[#F3E7D1]/30 blur-2xl pointer-events-none" />

              {/* Outer Orbit Ring */}
              <div className="absolute inset-4 rounded-full border border-[#D8921E]/30" />

              {/* Middle Orbit Ring */}
              <div className="absolute inset-16 rounded-full border border-[#D8921E]/40" />

              {/* Inner Orbit Ring */}
              <div className="absolute inset-28 rounded-full border border-[#D8921E]/50" />

              {/* Center Emblem Core */}
              <div className="absolute inset-0 m-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-[#D8921E] shadow-md flex flex-col items-center justify-center p-3 z-10">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                  <Image
                    src="/karmasarthi.png"
                    alt="Karmasarthi Central Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[9px] font-devanagari font-bold text-[#142446] tracking-tight mt-1">
                  कर्मसारथी
                </span>
              </div>

              {/* 6 Orbiting Node Buttons */}
              {HUBS.map((hub, idx) => {
                const IconComponent = hub.icon;
                const isActive = activeIdx === idx;
                const pos = nodePositions[idx];

                return (
                  <button
                    key={hub.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`absolute flex flex-col items-center justify-center rounded-full transition-all duration-300 z-20 ${
                      isActive
                        ? "w-14 h-14 sm:w-16 sm:h-16 bg-[#142446] text-white shadow-lg ring-4 ring-[#D8921E] scale-110"
                        : "w-11 h-11 sm:w-13 sm:h-13 bg-white text-[#142446] border-2 border-[#B7C7D9] hover:border-[#D8921E] hover:scale-105 shadow-sm"
                    }`}
                    style={pos as React.CSSProperties}
                    aria-label={hub.title}
                  >
                    <IconComponent
                      className={`transition-colors ${
                        isActive
                          ? "w-6 h-6 text-[#F3E7D1]"
                          : "w-5 h-5 text-[#475A6F]"
                      }`}
                    />
                    <span className="sr-only">{hub.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Hub Detail Showcase Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#f9f8f5] border border-[#e8e4dc] rounded-2xl p-7 sm:p-9 shadow-sm relative">
              
              {/* Category & Status Bar */}
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#e8e4dc]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#142446] text-[#F3E7D1]">
                    <ActiveIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#D8921E]">
                      {activeHub.category}
                    </span>
                    <p className="text-[12px] text-[#475A6F] font-medium">
                      {activeHub.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[18px] font-bold text-[#142446] leading-none block">
                    {activeHub.metric}
                  </span>
                  <span className="text-[10px] text-[#475A6F] uppercase tracking-wider font-medium">
                    {activeHub.metricLabel}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="py-6 space-y-4">
                <h3
                  className="text-[24px] sm:text-[28px] font-light text-[#142446] leading-snug"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {activeHub.title}
                </h3>
                <p className="text-[14px] text-[#475A6F] leading-relaxed">
                  {activeHub.description}
                </p>
              </div>

              {/* Highlight Bullets */}
              <div className="space-y-2.5 pb-6 border-b border-[#e8e4dc]">
                {activeHub.highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D8921E] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-[#142446] leading-snug font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Controls & CTA */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Pagination Dots */}
                <div className="flex items-center gap-1.5">
                  {HUBS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeIdx === i
                          ? "w-7 bg-[#D8921E]"
                          : "w-2 bg-[#C7C2BA] hover:bg-[#475A6F]"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Direct Action Link */}
                <Link
                  href={activeHub.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#142446] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1e3460] transition-colors shadow-sm"
                >
                  <span>{activeHub.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
