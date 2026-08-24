"use client";

import React, { useState } from "react";
import Link from "next/link";

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
      "Survey Design & Sampling Verification (Rubric Level 2 → Level 3)",
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
    <section className="bg-white border-t border-[#C7C2BA]/60 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C7C2BA]/60 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
              Cadre Pathways & Capacity Building
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight mt-1">
              Role-Calibrated Learning Progression
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#475A6F] max-w-xl">
            Each statistical cadre features predefined FRAC competency benchmarks, target proficiencies, and direct course pathways across iGOT Karmayogi and NSSTA TPAC.
          </p>
        </div>

        {/* Cadre Selection Tabs (Clean Pill Style) */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {CADRE_DATA.map((cadre) => {
            const isActive = cadre.id === activeCadreId;
            return (
              <button
                key={cadre.id}
                onClick={() => setActiveCadreId(cadre.id)}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors text-left border ${
                  isActive
                    ? "bg-[#142446] text-white border-[#142446]"
                    : "bg-[#FAF9F6] text-[#142446] border-[#C7C2BA] hover:bg-[#F3E7D1]/50"
                }`}
              >
                <span>{cadre.name}</span>
                <span className={`ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F3E7D1] text-[#142446]"
                }`}>
                  {cadre.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expansive Cadre Detail View (No generic card grids) */}
        <div className="border border-[#C7C2BA] rounded-2xl bg-[#FAF9F6] p-6 sm:p-10 space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#C7C2BA]/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#475A6F]">
                {activeCadre.cadre}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#142446] mt-0.5">
                {activeCadre.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#475A6F] mt-2 leading-relaxed max-w-3xl">
                {activeCadre.typicalRoles}
              </p>
            </div>

            <Link
              href={`/assessment?user=${activeCadre.simulationUserId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#142446] text-white text-xs font-bold rounded-lg hover:bg-[#1e3460] transition-colors shrink-0"
            >
              <span>Assess This Cadre</span>
              <span>→</span>
            </Link>
          </div>

          {/* Two-Column Structured Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Core Competencies Target Column */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446] pb-2 border-b border-[#C7C2BA]/40">
                Key Competencies & Target Rubrics
              </h4>
              <div className="space-y-2.5">
                {activeCadre.coreGapsTargeted.map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white border border-[#C7C2BA]/60 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#F3E7D1] text-[#142446] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <p className="text-xs font-medium text-[#142446] leading-snug">
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446] pb-2 border-b border-[#C7C2BA]/40">
                  Recommended iGOT Karmayogi e-Learning
                </h4>
                <div className="space-y-2">
                  {activeCadre.recommendedIGOT.map((course, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white border border-[#C7C2BA]/60 flex items-center justify-between gap-3"
                    >
                      <p className="text-xs font-semibold text-[#142446]">
                        {course}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA] shrink-0">
                        iGOT Free
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NSSTA TPAC Residential Modules */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#142446] pb-2 border-b border-[#C7C2BA]/40">
                  NSSTA Academy Training Programmes (TPAC)
                </h4>
                <div className="space-y-2">
                  {activeCadre.recommendedNSSTA.map((course, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white border border-[#C7C2BA]/60 flex items-center justify-between gap-3"
                    >
                      <p className="text-xs font-semibold text-[#142446]">
                        {course}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3E7D1] text-[#142446] border border-[#C7C2BA] shrink-0">
                        NSSTA Greater Noida
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
