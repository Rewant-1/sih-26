"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, GraduationCap } from "lucide-react";

interface CadrePathway {
  id: string;
  name: string;
  cadre: string;
  badge: string;
  typicalRoles: string;
  coreGapsTargeted: string[];
  recommendedIGOT: string[];
  recommendedNSSTA: string[];
  simulationUserId: string;
}

const CADRE_DATA: CadrePathway[] = [
  {
    id: "jso",
    name: "Junior Statistical Officer (JSO)",
    cadre: "Subordinate Statistical Service (SSS)",
    badge: "Group B Non-Gazetted",
    typicalRoles:
      "Primary data collection, field enumeration, schedule verification, survey scrutiny in Field Operations Division (FOD) and regional sub-offices.",
    coreGapsTargeted: [
      "Survey Design & Sampling Verification (Level 2 → Level 3)",
      "Python & R for Automated Field Scrutiny",
      "Field Data Quality & Non-Sampling Error Minimization",
      "DPDPA Data Privacy Protocols in Household Surveys",
    ],
    recommendedIGOT: [
      "Foundations of Official Statistics in India",
      "Digital Data Capture & CAPI Operations",
      "Cyber Hygiene for Field Officers",
    ],
    recommendedNSSTA: [
      "NSSTA Residential Induction for Junior Officers",
      "Hands-on Workshop on R and Spatial Sampling",
    ],
    simulationUserId: "usr-jso-rajesh",
  },
  {
    id: "sso",
    name: "Senior Statistical Officer (SSO)",
    cadre: "Subordinate Statistical Service (SSS / Senior)",
    badge: "Group B Gazetted",
    typicalRoles:
      "Inspection of field units, compilation of price indices (CPI/WPI/IIP), secondary data harmonization, and technical scrutiny in ESD & NAD.",
    coreGapsTargeted: [
      "Price Index Number Compilation & Chain-linking (Level 3 → Level 4)",
      "SQL & Big Data Warehousing in MoSPI Pipelines",
      "Data Quality Assurance Framework (NDQAF)",
      "Technical Drafting & Analytical Report Writing",
    ],
    recommendedIGOT: [
      "Advanced Index Number Methodology",
      "National Data Quality Framework Implementation",
      "Public Sector Leadership & Inspection Scrutiny",
    ],
    recommendedNSSTA: [
      "Mid-Career Training Programme (MCTP) for SSOs",
      "Advanced Econometric Modeling with Stata & Python",
    ],
    simulationUserId: "usr-sso-priya",
  },
  {
    id: "iss-ad",
    name: "Assistant Director (ISS AD)",
    cadre: "Indian Statistical Service (Group A Central Service)",
    badge: "Group A Gazetted",
    typicalRoles:
      "National Accounts compilation, survey sampling frame design, AI/ML adoption, inter-ministerial statistical coordination, and policy briefs.",
    coreGapsTargeted: [
      "System of National Accounts (SNA 2008 / Level 4 → Level 5)",
      "AI/ML Applications in Remote Sensing & Official Data",
      "Government Cloud Architecture & MeghRaj Integration",
      "Strategic Statistical Vision & Cabinet Note Formulation",
    ],
    recommendedIGOT: [
      "Executive Leadership in Digital Public Infrastructure",
      "Macroeconomic Modeling & GVA Estimation",
      "Data Governance & Open Data Stewardship",
    ],
    recommendedNSSTA: [
      "Senior Officers Residential Programme on Emerging AI in Statistics",
      "International Statistical Standards & SDG Harmonization",
    ],
    simulationUserId: "usr-ad-amit",
  },
];

export function CadrePathways() {
  const [activeCadreId, setActiveCadreId] = useState<string>("jso");

  const activeCadre =
    CADRE_DATA.find((c) => c.id === activeCadreId) || CADRE_DATA[0];

  return (
    <section className="bg-white py-16 lg:py-24 border-t border-[#C7C2BA]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Open Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C7C2BA]/40 mb-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#B7C7D9] text-[#142446] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8921E]" />
              <span>Cadre Pathways & Capacity Building</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142446] tracking-tight">
              Role-Calibrated Learning Progression
            </h2>
            <p className="text-xs sm:text-sm text-[#475A6F] pt-1 leading-relaxed">
              Every cadre has customized FRAC benchmarks and direct course pathways across iGOT Karmayogi and NSSTA Academy.
            </p>
          </div>

          {/* Cadre Selection Tabs (Harmonized with Deep Navy, Saffron, Dusty Blue) */}
          <div className="flex flex-wrap gap-2">
            {CADRE_DATA.map((cadre) => {
              const isActive = cadre.id === activeCadreId;
              return (
                <button
                  key={cadre.id}
                  onClick={() => setActiveCadreId(cadre.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#142446] text-white shadow-sm ring-2 ring-[#D8921E]"
                      : "bg-[#FAF9F6] text-[#475A6F] border border-[#B7C7D9] hover:text-[#142446] hover:bg-[#B7C7D9]/20"
                  }`}
                >
                  {cadre.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expansive Cadre Detail (Rich Color Accents, Non-Boxy) */}
        <div className="space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase text-[#475A6F]">
                  {activeCadre.cadre}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA]">
                  {activeCadre.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#142446]">
                {activeCadre.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#475A6F] mt-1.5 leading-relaxed max-w-3xl">
                {activeCadre.typicalRoles}
              </p>
            </div>

            <Link
              href={`/assessment?user=${activeCadre.simulationUserId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D8921E] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#c48218] transition-colors shadow-sm shrink-0"
            >
              <span>Assess This Cadre</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Two-Column Structured Info with Saffron, Dusty Blue, and Slate Blue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
            
            {/* Core Competencies Target Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#B7C7D9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446]">
                  Key Competencies & Target Levels
                </h4>
                <span className="text-[11px] font-semibold text-[#475A6F]">
                  FRAC Rubrics
                </span>
              </div>

              <div className="divide-y divide-[#C7C2BA]/40">
                {activeCadre.coreGapsTargeted.map((gap, i) => (
                  <div
                    key={i}
                    className="py-3.5 flex items-start gap-3 first:pt-0"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#B7C7D9] text-[#142446] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-[#142446]/20">
                      0{i + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#142446] leading-snug">
                      {gap}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Learning Pathways Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* iGOT Karmayogi Courses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#B7C7D9]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446]">
                    Recommended iGOT Karmayogi e-Learning
                  </h4>
                  <span className="text-[11px] font-semibold text-[#D8921E]">
                    Self-Paced
                  </span>
                </div>

                <div className="divide-y divide-[#C7C2BA]/40">
                  {activeCadre.recommendedIGOT.map((course, i) => (
                    <div
                      key={i}
                      className="py-3 flex items-center justify-between gap-3 first:pt-0"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#475A6F] shrink-0" />
                        <p className="text-xs sm:text-sm font-semibold text-[#142446]">
                          {course}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#142446] border border-[#B7C7D9] shrink-0">
                        iGOT Free
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NSSTA TPAC Residential Modules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#B7C7D9]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446]">
                    NSSTA Academy Training Programmes
                  </h4>
                  <span className="text-[11px] font-semibold text-[#142446]">
                    Greater Noida
                  </span>
                </div>

                <div className="divide-y divide-[#C7C2BA]/40">
                  {activeCadre.recommendedNSSTA.map((course, i) => (
                    <div
                      key={i}
                      className="py-3 flex items-center justify-between gap-3 first:pt-0"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#142446] shrink-0" />
                        <p className="text-xs sm:text-sm font-semibold text-[#142446]">
                          {course}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#142446] text-white shrink-0">
                        NSSTA TPAC
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
