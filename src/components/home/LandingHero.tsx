"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  FileCheck2,
  FileText,
  Layers,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

interface CadrePreview {
  id: string;
  name: string;
  cadre: string;
  division: string;
  focusDomains: string[];
  keyCompetencies: { code: string; name: string; targetLevel: number }[];
  primaryPath: string;
  assessmentUrl: string;
}

const CADRE_PREVIEWS: CadrePreview[] = [
  {
    id: "jso",
    name: "Junior Statistical Officer (JSO)",
    cadre: "Subordinate Statistical Service",
    division: "Field Operations Division (FOD)",
    focusDomains: ["Field Data Capture", "CAPI Tools", "Primary Data Validation"],
    keyCompetencies: [
      { code: "TECH_VAL_05", name: "CAPI Survey Instrument & Field Deployment", targetLevel: 4 },
      { code: "STAT_SMPL_01", name: "Sampling Design & Survey Methodology", targetLevel: 3 },
      { code: "GOV_SDC_02", name: "Data Confidentiality & Microdata Scrutiny", targetLevel: 3 },
    ],
    primaryPath: "CAPI Survey Instrument Design & Mobile Field Deployment (iGOT)",
    assessmentUrl: "/assessment?user=usr-jso-rajesh",
  },
  {
    id: "sso",
    name: "Senior Statistical Officer (SSO)",
    cadre: "Subordinate Statistical Service",
    division: "Economic Statistics Division (ESD)",
    focusDomains: ["Index Numbers", "Enterprise Statistics", "Quality Assurance"],
    keyCompetencies: [
      { code: "STAT_TSA_06", name: "Time Series Analysis & Seasonal Adjustment", targetLevel: 4 },
      { code: "STAT_ASI_04", name: "Annual Survey of Industries Schedule Analysis", targetLevel: 4 },
      { code: "TECH_R_01", name: "Statistical Computing with R / Python", targetLevel: 3 },
    ],
    primaryPath: "Consumer Price Index (CPI) & Inflation Compilation (iGOT)",
    assessmentUrl: "/assessment?user=usr-sso-priya",
  },
  {
    id: "iss_ad",
    name: "Assistant Director (ISS)",
    cadre: "Indian Statistical Service (Group A)",
    division: "National Accounts Division (NAD)",
    focusDomains: ["Macroeconomic Modeling", "National Accounts (SNA 2008)", "Policy Analysis"],
    keyCompetencies: [
      { code: "STAT_NAT_02", name: "Supply & Use Tables (SUT) Compilation", targetLevel: 5 },
      { code: "BEH_GOV_01", name: "Evidence-Based Policy Advisory & Reporting", targetLevel: 4 },
      { code: "TECH_AI_03", name: "Big Data & Machine Learning in Official Stats", targetLevel: 4 },
    ],
    primaryPath: "Advanced National Accounts & Supply-Use Tables Masterclass (NSSTA)",
    assessmentUrl: "/assessment?user=usr-ad-amit",
  },
];

export function LandingHero() {
  const [activeCadreId, setActiveCadreId] = useState<string>("jso");
  const activeCadre = CADRE_PREVIEWS.find((c) => c.id === activeCadreId) || CADRE_PREVIEWS[0];

  return (
    <section className="relative w-full bg-white border-b border-[#C7C2BA]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446]">
              <ShieldCheck className="w-4 h-4 text-[#D8921E]" />
              <span className="text-[12px] font-semibold tracking-wide">
                Mission Karmayogi · Capacity Building Extension
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-[34px] sm:text-[44px] lg:text-[48px] font-bold text-[#142446] leading-[1.12] tracking-tight">
                Capacity Building & Competency Intelligence for{" "}
                <span className="text-[#142446] underline decoration-[#D8921E] decoration-2 underline-offset-4">
                  India&apos;s Statistical Cadre
                </span>
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#475A6F] leading-relaxed max-w-2xl">
                An AI-enabled learning intelligence platform for MoSPI officers. Mapped to the official FRAC competency framework to diagnose skill gaps, personalize iGOT courses, and generate instant assessments from official statistical manuals.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#D8921E] text-white text-[14px] font-bold shadow-xs hover:bg-[#c27f14] transition-colors"
              >
                <span>Begin Competency Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#C7C2BA] bg-[#FAF9F6] text-[#142446] text-[14px] font-semibold hover:bg-white transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#475A6F]" />
                <span>Explore Course Catalog</span>
              </Link>
              <Link
                href="/quiz-studio"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#C7C2BA] bg-white text-[#475A6F] text-[14px] font-medium hover:text-[#142446] hover:bg-[#FAF9F6] transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>AI Quiz Studio</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#C7C2BA]/40 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-[18px] font-bold text-[#142446]">29 Skills</p>
                <p className="text-[11px] text-[#475A6F]">4 FRAC Domains</p>
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#142446]">iGOT + NSSTA</p>
                <p className="text-[11px] text-[#475A6F]">20 Curated Courses</p>
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#142446]">5 Divisions</p>
                <p className="text-[11px] text-[#475A6F]">FOD · ESD · NAD · DIID</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Cadre Personalization Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#C7C2BA] bg-white shadow-sm overflow-hidden">
              
              {/* Cadre Selector Header */}
              <div className="p-4 bg-[#FAF9F6] border-b border-[#C7C2BA]/60">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#D8921E]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#142446]">
                      Personalized Cadre Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]/60">
                    FRAC Mapped
                  </span>
                </div>

                {/* Cadre Pills */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-lg border border-[#C7C2BA]/60">
                  {CADRE_PREVIEWS.map((cadre) => (
                    <button
                      key={cadre.id}
                      onClick={() => setActiveCadreId(cadre.id)}
                      className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition-colors text-center ${
                        activeCadreId === cadre.id
                          ? "bg-[#142446] text-white shadow-xs"
                          : "text-[#475A6F] hover:text-[#142446] hover:bg-[#FAF9F6]"
                      }`}
                    >
                      {cadre.id.toUpperCase().replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cadre Profile Content */}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[#142446]">
                      {activeCadre.name}
                    </h3>
                    <span className="text-[11px] text-[#475A6F] font-medium">
                      {activeCadre.division}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475A6F] mt-0.5">
                    Cadre Track: <span className="font-semibold text-[#142446]">{activeCadre.cadre}</span>
                  </p>
                </div>

                {/* Target Competencies */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#475A6F]">
                    Priority FRAC Competencies
                  </p>
                  <div className="space-y-2">
                    {activeCadre.keyCompetencies.map((comp) => (
                      <div
                        key={comp.code}
                        className="p-2.5 rounded-lg border border-[#C7C2BA]/40 bg-[#FAF9F6] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-[#142446] truncate">
                            {comp.name}
                          </p>
                          <p className="text-[10px] text-[#475A6F] font-mono">
                            {comp.code}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#142446] text-white">
                          Target L{comp.targetLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended iGOT Course */}
                <div className="p-3 rounded-lg border border-[#D8921E]/40 bg-[#F3E7D1]/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#142446]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D8921E]" />
                    <span>Recommended Pathway</span>
                  </div>
                  <p className="text-[12px] text-[#142446] font-medium leading-snug">
                    {activeCadre.primaryPath}
                  </p>
                </div>

                {/* CTA Link */}
                <Link
                  href={activeCadre.assessmentUrl}
                  className="block w-full py-2.5 px-4 rounded-lg bg-[#142446] text-white text-[12px] font-bold text-center hover:bg-[#1e3460] transition-colors"
                >
                  Evaluate Profile as {activeCadre.name.split(" ")[0]} →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
