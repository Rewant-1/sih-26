"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
    cadreFocus: "Field Operations (FOD) & National Accounts (NAD)",
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
    cadreFocus: "Data Informatics and Innovation Division (DIID)",
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
    cadreFocus: "Universal requirement across all statistical divisions",
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
    cadreFocus: "Mid-level and senior officers leading statistical teams",
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
    <section className="bg-[#142446] text-white py-16 lg:py-24 border-t border-[#1e3460]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Open Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#B7C7D9] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8921E]" />
              <span>FRAC Competency Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Four Core Domains of Official Statistics
            </h2>
            <p className="text-xs sm:text-sm text-[#B7C7D9] pt-1 leading-relaxed">
              29 structured competencies spanning methodology, technical pipelines, digital governance, and administrative leadership under Mission Karmayogi.
            </p>
          </div>

          {/* Domain Selection Tabs with Saffron Gold & Dusty Blue */}
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((domain) => {
              const isActive = domain.id === activeDomainId;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white text-[#142446] shadow-sm ring-2 ring-[#D8921E]"
                      : "bg-white/10 text-[#B7C7D9] hover:text-white hover:bg-white/15"
                  }`}
                >
                  {domain.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expansive Domain Content Area */}
        <div className="space-y-8">
          
          {/* Domain Overview Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
                  {activeDomain.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {activeDomain.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#B7C7D9] mt-1 leading-relaxed max-w-3xl">
                {activeDomain.description}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#B7C7D9] text-[#142446] shrink-0 self-start md:self-center">
              {activeDomain.cadreFocus}
            </span>
          </div>

          {/* Structured Competencies List with Saffron and Dusty Blue Accents */}
          <div className="divide-y divide-white/10">
            {activeDomain.competencies.map((comp, idx) => (
              <div
                key={idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#B7C7D9] text-[#142446] flex items-center justify-center text-xs font-bold shrink-0">
                      0{idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {comp.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#B7C7D9] pl-9">
                    {comp.focus}
                  </p>
                </div>

                <div className="pl-9 sm:pl-0 shrink-0">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-[#F3E7D1] border border-white/20">
                    {comp.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#B7C7D9]">
              Ready to evaluate your competency level against official benchmarks?
            </span>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D8921E] text-white text-xs font-bold rounded-xl hover:bg-[#c48218] transition-colors shadow-sm"
            >
              <span>Take Domain Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
