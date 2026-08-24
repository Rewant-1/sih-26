"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Code2,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface DomainData {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
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
    badge: "Core Domain",
    icon: Compass,
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
        title: "National Accounts Statistics (SNA)",
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
    badge: "Emerging Tech",
    icon: Code2,
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
    badge: "Compliance",
    icon: ShieldCheck,
    description:
      "Ensuring compliance with the Digital Personal Data Protection Act (DPDPA), cybersecurity protocols, government cloud infrastructure, and Open Data standards.",
    cadreFocus: "Universal requirement across all statistical divisions and regional offices",
    competencies: [
      {
        title: "Data Privacy & DPDPA Compliance",
        level: "Level 4 (Proficient)",
        focus: "Anonymization techniques, microdata privacy rules, and consent management frameworks.",
      },
      {
        title: "Cybersecurity & Information Security",
        level: "Level 3 (Working)",
        focus: "CERT-In guidelines, phishing defense, role-based access, and secure data transfer.",
      },
      {
        title: "Government Cloud Infrastructure (MeghRaj)",
        level: "Level 3 (Working)",
        focus: "Cloud-native data architecture, NIC cloud storage, and secure API gateways.",
      },
      {
        title: "Open Data & NDSAP Standards",
        level: "Level 4 (Proficient)",
        focus: "data.gov.in publishing protocols, machine-readable datasets, and API metadata compliance.",
      },
    ],
  },
  {
    id: "behavioural",
    name: "Behavioural & Leadership Competencies",
    badge: "Leadership",
    icon: HeartHandshake,
    description:
      "Institutional leadership, stakeholder communication, cross-cadre team collaboration, project management, and ethical statistical dissemination.",
    cadreFocus: "Key driver for Senior Statistical Officers and ISS Leadership transitions",
    competencies: [
      {
        title: "Statistical Leadership & Vision",
        level: "Level 4 (Proficient)",
        focus: "Transforming national data priorities into actionable multi-year survey workplans.",
      },
      {
        title: "Effective Policy Communication",
        level: "Level 4 (Proficient)",
        focus: "Drafting ministerial briefs, statistical releases, and infographics for policymakers.",
      },
      {
        title: "Field Team & Project Management",
        level: "Level 3 (Working)",
        focus: "Managing primary enumerators, tracking inspection schedules, and conflict resolution.",
      },
      {
        title: "Public Sector Ethics & Integrity",
        level: "Level 5 (Advanced)",
        focus: "Adherence to UN Fundamental Principles of Official Statistics and national codes.",
      },
    ],
  },
];

export function CompetencyMatrix() {
  const [activeDomainId, setActiveDomainId] = useState<string>("statistical");

  const activeDomain =
    DOMAINS.find((d) => d.id === activeDomainId) || DOMAINS[0];
  const DomainIcon = activeDomain.icon;

  return (
    <section className="bg-[#f9f8f5] border-t border-[#e8e4dc] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-2">
              FRAC Competency Framework
            </p>
            <h2
              className="text-[32px] sm:text-[40px] font-light text-[#142446] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Four Domains. Standardized MoSPI Rubrics.
            </h2>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#142446] hover:text-[#D8921E] transition-colors self-start md:self-auto"
          >
            <span>Take All-Domain Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Domain Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomainId(domain.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? "bg-[#142446] text-white border-[#142446] shadow-md ring-2 ring-[#D8921E]"
                    : "bg-white text-[#475A6F] border-[#e8e4dc] hover:border-[#B7C7D9] hover:bg-[#F3E7D1]/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-white/15 text-[#F3E7D1]"
                        : "bg-[#F3E7D1]/50 text-[#142446]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isActive
                        ? "bg-[#D8921E] text-white"
                        : "bg-[#e8e4dc] text-[#475A6F]"
                    }`}
                  >
                    {domain.badge}
                  </span>
                </div>
                <h3
                  className={`text-[14px] font-semibold leading-tight ${
                    isActive ? "text-white" : "text-[#142446]"
                  }`}
                >
                  {domain.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail Content */}
        <div className="bg-white border border-[#e8e4dc] rounded-2xl p-7 sm:p-9 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f0ece4]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#142446] text-[#F3E7D1]">
                <DomainIcon className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="text-[22px] font-semibold text-[#142446] leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {activeDomain.name}
                </h3>
                <p className="text-[12.5px] text-[#475A6F] mt-0.5">
                  {activeDomain.cadreFocus}
                </p>
              </div>
            </div>

            <Link
              href={`/catalog?domain=${activeDomain.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3E7D1]/60 hover:bg-[#F3E7D1] text-[#142446] text-[12.5px] font-semibold rounded-lg border border-[#e8d8b8] transition-colors"
            >
              <span>View Matching Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-[14px] text-[#475A6F] py-5 leading-relaxed">
            {activeDomain.description}
          </p>

          {/* Competencies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {activeDomain.competencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#f0ece4] bg-[#f9f8f5] hover:border-[#B7C7D9] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-[13.5px] font-semibold text-[#142446] leading-tight">
                    {comp.title}
                  </h4>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-white border border-[#e8e4dc] rounded text-[#D8921E] shrink-0">
                    {comp.level}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#475A6F] leading-relaxed">
                  {comp.focus}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
