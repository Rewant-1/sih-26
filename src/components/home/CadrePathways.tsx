"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

interface CadrePathway {
  id: string;
  name: string;
  cadre: string;
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
    typicalRoles:
      "Primary data collection, field enumeration, schedule verification, survey scrutiny in Field Operations Division (FOD) and regional sub-offices.",
    coreGapsTargeted: [
      "Survey Design & Sampling Verification (Rubric L2 → L3)",
      "Python & R for Automated Scrutiny",
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
    typicalRoles:
      "Inspection of field units, compilation of price indices (CPI/WPI/IIP), secondary data harmonization, and technical scrutiny in ESD & NAD.",
    coreGapsTargeted: [
      "Price Index Number Compilation & Chain-linking (L3 → L4)",
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
    typicalRoles:
      "National Accounts compilation, survey sampling frame design, AI/ML adoption, inter-ministerial statistical coordination, and policy briefs.",
    coreGapsTargeted: [
      "System of National Accounts (SNA 2008 / L4 → L5)",
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
    <section className="bg-[#f9f8f5] border-t border-[#e8e4dc] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-2">
              Cadre-Specific Pathways
            </p>
            <h2
              className="text-[32px] sm:text-[40px] font-light text-[#142446] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Tailored Capacity Building for Every Rank.
            </h2>
          </div>
          <p className="text-[13.5px] text-[#475A6F] max-w-md">
            Customized gap analysis and training pathways aligned with Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) career trajectories.
          </p>
        </div>

        {/* Cadre Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {CADRE_DATA.map((item) => {
            const isActive = item.id === activeCadreId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCadreId(item.id)}
                className={`p-5 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? "bg-[#142446] text-white border-[#142446] shadow-md ring-2 ring-[#D8921E]"
                    : "bg-white text-[#475A6F] border-[#e8e4dc] hover:border-[#B7C7D9] hover:bg-[#F3E7D1]/20"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                    isActive ? "text-[#D8921E]" : "text-[#475A6F]"
                  }`}
                >
                  {item.cadre}
                </span>
                <h3
                  className={`text-[15px] font-semibold leading-tight ${
                    isActive ? "text-white" : "text-[#142446]"
                  }`}
                >
                  {item.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Selected Cadre Detail Card */}
        <div className="bg-white border border-[#e8e4dc] rounded-2xl p-7 sm:p-9 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f0ece4]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#D8921E]">
                  {activeCadre.cadre}
                </span>
              </div>
              <h3
                className="text-[24px] font-semibold text-[#142446] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {activeCadre.name}
              </h3>
              <p className="text-[13.5px] text-[#475A6F] mt-2 max-w-3xl leading-relaxed">
                {activeCadre.typicalRoles}
              </p>
            </div>

            <Link
              href={`/dashboard/learner?user=${activeCadre.simulationUserId}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#142446] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1e3460] transition-colors shadow-sm self-start lg:self-auto shrink-0"
            >
              <span>Simulate Cadre Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Left: Core Skill Gaps Targeted */}
            <div className="lg:col-span-6 space-y-3">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#142446]">
                Priority Competency Gaps Addressed
              </h4>
              <div className="space-y-2.5">
                {activeCadre.coreGapsTargeted.map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#f9f8f5] border border-[#f0ece4] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D8921E] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-[#142446] font-medium leading-snug">
                      {gap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recommended Courses */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#142446] mb-2">
                  iGOT Karmayogi Bharat Modules
                </h4>
                <div className="space-y-2">
                  {activeCadre.recommendedIGOT.map((course, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#F3E7D1]/30 border border-[#e8d8b8] flex items-center justify-between"
                    >
                      <span className="text-[12.5px] text-[#142446] font-medium">
                        {course}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-white rounded text-[#D8921E] border border-[#e8d8b8]">
                        iGOT
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#142446] mb-2">
                  NSSTA Greater Noida Programmes
                </h4>
                <div className="space-y-2">
                  {activeCadre.recommendedNSSTA.map((course, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#B7C7D9]/20 border border-[#B7C7D9]/40 flex items-center justify-between"
                    >
                      <span className="text-[12.5px] text-[#142446] font-medium">
                        {course}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-white rounded text-[#142446] border border-[#B7C7D9]/40">
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
