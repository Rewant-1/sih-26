"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DomainData {
  id: string;
  name: string;
  badge: string;
  description: string;
  cadreFocus: string;
  competencies: {
    title: string;
    level: string;
    focus: string;
  }[];
}

const DOMAINS: DomainData[] = [
  {
    id: "statistical",
    name: "Statistical Competencies",
    badge: "Core Methodology",
    description:
      "Methodological rigor covering national sample surveys, price indices, national accounting matrices, agricultural statistics, and SDG indicator tracking.",
    cadreFocus: "High priority for Field Operations (FOD) & National Accounts (NAD)",
    competencies: [
      {
        title: "Survey Design & Sampling Methods",
        level: "Level 4 (Proficient)",
        focus: "Stratified multi-stage sampling, sampling frame curation, and non-sampling error minimization.",
      },
      {
        title: "National Accounts Statistics (SNA 2008)",
        level: "Level 4 (Proficient)",
        focus: "Gross Value Added (GVA), Supply-Use Tables (SUT), and institutional sector accounts.",
      },
      {
        title: "Price Indices & Index Number Theory",
        level: "Level 3 (Working)",
        focus: "CPI, WPI, IIP compilation, Laspeyres-Paasche weighting, and chain-linking methods.",
      },
      {
        title: "Data Quality Assurance Framework (NDQAF)",
        level: "Level 4 (Proficient)",
        focus: "MoSPI data quality dimensions, standard metadata curation, and validation workflows.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical & Analytics Competencies",
    badge: "Modern Analytics",
    description:
      "Modern programming, big data analytics, automated pipelines, GIS spatial statistics, and machine learning methodologies for official data processing.",
    cadreFocus: "High priority for Data Informatics and Innovation Division (DIID)",
    competencies: [
      {
        title: "Python & R for Statistical Computing",
        level: "Level 3 (Working)",
        focus: "Pandas, NumPy, Tidyverse, automated data ingestion, and econometric modeling.",
      },
      {
        title: "SQL & Enterprise Data Warehousing",
        level: "Level 4 (Proficient)",
        focus: "Complex joins, analytical window functions, indexing, and pipeline orchestration.",
      },
      {
        title: "GIS & Spatial Statistical Mapping",
        level: "Level 3 (Working)",
        focus: "QGIS, ESRI, thematic cartography, and spatial autocorrelation for village-level analytics.",
      },
      {
        title: "AI/ML for Official Statistics",
        level: "Level 2 (Foundational)",
        focus: "Supervised classification, satellite imagery imputation, and predictive data validation.",
      },
    ],
  },
  {
    id: "governance",
    name: "Digital Governance & Security",
    badge: "Compliance & Trust",
    description:
      "Ensuring compliance with the Digital Personal Data Protection Act (DPDPA), cybersecurity protocols, government cloud infrastructure, and Open Data standards.",
    cadreFocus: "Universal requirement across all statistical divisions and regional offices",
    competencies: [
      {
        title: "DPDPA 2023 Compliance & Data Ethics",
        level: "Level 4 (Proficient)",
        focus: "Consent management, anonymization protocols, respondent rights, and audit trails.",
      },
      {
        title: "Cybersecurity & Information Security",
        level: "Level 3 (Working)",
        focus: "Government security guidelines, encrypted data transmission, and incident reporting.",
      },
      {
        title: "National Data Sharing & Accessibility (NDSAP)",
        level: "Level 4 (Proficient)",
        focus: "Open data publishing, metadata standards, and data dissemination API protocols.",
      },
      {
        title: "Government Cloud Infrastructure (MeghRaj)",
        level: "Level 3 (Working)",
        focus: "Cloud security architectures, compute scaling, and secure data storage.",
      },
    ],
  },
  {
    id: "management",
    name: "Behavioural & Management Competencies",
    badge: "Leadership & Delivery",
    description:
      "Public sector leadership, cross-divisional project management, technical drafting, stakeholder communication, and high-impact policy briefs.",
    cadreFocus: "Crucial for mid-level and senior officers leading teams and managing surveys",
    competencies: [
      {
        title: "Technical Drafting & Analytical Reporting",
        level: "Level 4 (Proficient)",
        focus: "Cabinet notes, technical reports, press releases, and executive summaries.",
      },
      {
        title: "Statistical Survey Project Management",
        level: "Level 4 (Proficient)",
        focus: "Resource planning, timeline management, field supervisor coordination, and quality control.",
      },
      {
        title: "Inter-Ministerial Stakeholder Coordination",
        level: "Level 3 (Working)",
        focus: "Working with line ministries, state statistical bureaus, and international bodies.",
      },
      {
        title: "Team Leadership & Capacity Development",
        level: "Level 4 (Proficient)",
        focus: "Mentoring junior staff, performance feedback, and continuous learning culture.",
      },
    ],
  },
];

export function CompetencyMatrix() {
  const [activeDomainId, setActiveDomainId] = useState<string>("statistical");

  const activeDomain =
    DOMAINS.find((d) => d.id === activeDomainId) || DOMAINS[0];

  return (
    <section className="bg-[#FAF9F6] border-t border-[#C7C2BA]/60 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C7C2BA]/60 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
              FRAC Competency Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight mt-1">
              Four Core Domains of Official Statistics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#475A6F] max-w-xl">
            29 structured competencies spanning methodology, technical pipelines, digital governance, and administrative leadership under Mission Karmayogi.
          </p>
        </div>

        {/* Domain Selection Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {DOMAINS.map((domain) => {
            const isActive = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomainId(domain.id)}
                className={`p-4 rounded-xl text-left border transition-colors ${
                  isActive
                    ? "bg-[#142446] text-white border-[#142446] shadow-sm"
                    : "bg-white text-[#142446] border-[#C7C2BA] hover:bg-[#FAF9F6]"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F3E7D1] text-[#142446]"
                }`}>
                  {domain.badge}
                </span>
                <p className="text-sm font-bold mt-2 leading-snug">
                  {domain.name}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expansive Domain Content Area */}
        <div className="bg-white border border-[#C7C2BA] rounded-2xl p-6 sm:p-10 space-y-8">
          
          {/* Domain Overview */}
          <div className="pb-6 border-b border-[#C7C2BA]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#142446]">
                {activeDomain.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#475A6F] mt-1.5 leading-relaxed max-w-3xl">
                {activeDomain.description}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA] shrink-0 self-start md:self-center">
              {activeDomain.cadreFocus}
            </span>
          </div>

          {/* Structured Competencies Table/List (No generic cards) */}
          <div className="divide-y divide-[#C7C2BA]/40">
            {activeDomain.competencies.map((comp, idx) => (
              <div
                key={idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#142446] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-[#142446]">
                      {comp.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#475A6F] pl-8">
                    {comp.focus}
                  </p>
                </div>

                <div className="pl-8 sm:pl-0 shrink-0">
                  <span className="text-xs font-semibold px-3 py-1 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                    {comp.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="pt-6 border-t border-[#C7C2BA]/60 flex items-center justify-between">
            <span className="text-xs text-[#475A6F]">
              Ready to assess your proficiency in this domain?
            </span>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#142446] text-white text-xs font-bold rounded-lg hover:bg-[#1e3460] transition-colors"
            >
              <span>Take Domain Assessment</span>
              <span>→</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
