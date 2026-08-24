import React from "react";
import Link from "next/link";
import Image from "next/image";
import { repository } from "@/lib/storage/repository";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { KarmasarthiHubs } from "@/components/home/KarmasarthiHubs";
import { CompetencyMatrix } from "@/components/home/CompetencyMatrix";
import { AssessmentWorkflow } from "@/components/home/AssessmentWorkflow";
import { CadrePathways } from "@/components/home/CadrePathways";
import {
  BarChart3,
  Building2,
  FileCheck2,
  ShieldCheck,
  Globe2,
  Award,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react";

export default async function HomePage() {
  const competencies = await repository.getCompetencies();
  const courses = await repository.getCourses();
  const quizzes = await repository.getQuizzes();
  const divisions = await repository.getDivisionAggregateData();

  const stats = [
    {
      value: `${competencies.length}`,
      label: "FRAC Competencies",
      sub: "Across 4 MoSPI domains",
    },
    {
      value: `${courses.length}`,
      label: "Curated Courses",
      sub: "iGOT & NSSTA TPAC calendar",
    },
    {
      value: `${quizzes.length}`,
      label: "Standard Assessments",
      sub: "Bloom-weighted question banks",
    },
    {
      value: `${divisions.length}`,
      label: "Divisions Monitored",
      sub: "FOD, ESD, NAD, DIID, SDRD",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f5]">
      {/* Universal Navigation Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        competencyCount={competencies.length}
        courseCount={courses.length}
      />

      {/* Live Statistics Ribbon Bar */}
      <section className="bg-[#F3E7D1]/50 border-y border-[#e8d8b8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#e8d8b8]">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="px-6 sm:px-10 py-2 text-center first:pl-0 last:pr-0"
              >
                <div className="text-[36px] sm:text-[48px] font-light text-[#142446] leading-none tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[13px] font-semibold text-[#142446] mt-1.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[#475A6F] mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Karmasarthi Hubs (Radial Orbital System) */}
      <KarmasarthiHubs />

      {/* 4-Domain FRAC Competency Matrix */}
      <CompetencyMatrix />

      {/* AI Assessment Engine & Document to Quiz */}
      <AssessmentWorkflow />

      {/* Cadre-Specific Career Pathways */}
      <CadrePathways />

      {/* Division Workforce Intelligence & Heatmap Preview */}
      <section className="bg-white border-t border-[#e8e4dc] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Explanatory Copy */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E7D1]/70 border border-[#e8d8b8] text-[#142446] text-[11px] font-semibold tracking-wider uppercase">
                <BarChart3 className="w-3.5 h-3.5 text-[#D8921E]" />
                <span>Leadership Intelligence</span>
              </div>
              <h2
                className="text-[32px] sm:text-[40px] font-light text-[#142446] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Workforce Competency Heatmaps Across All MoSPI Divisions.
              </h2>
              <p className="text-[14px] text-[#475A6F] leading-relaxed">
                Empower division heads and training managers with real-time visibility into cadre skill levels, critical knowledge deficits, and training compliance across Field Operations (FOD), Economic Statistics (ESD), National Accounts (NAD), DIID, and SDRD.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/admin"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#142446] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1e3460] transition-colors shadow-sm"
                >
                  <Building2 className="w-4 h-4 text-[#D8921E]" />
                  <span>Open Division Heatmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/acbp"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[#B7C7D9] text-[#142446] text-[13px] font-semibold rounded-lg hover:bg-[#F3E7D1]/40 transition-colors"
                >
                  <FileCheck2 className="w-4 h-4 text-[#475A6F]" />
                  <span>ACBP 2026–27 Planner</span>
                </Link>
              </div>
            </div>

            {/* Right: Interactive Division Summary Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {divisions.map((div) => (
                <div
                  key={div.divisionCode}
                  className="p-5 rounded-xl border border-[#e8e4dc] bg-[#f9f8f5] hover:border-[#B7C7D9] transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#D8921E] px-2 py-0.5 bg-white rounded border border-[#e8e4dc]">
                      {div.divisionCode}
                    </span>
                    <span className="text-[11px] font-semibold text-[#142446]">
                      {div.totalOfficers} Officers Monitored
                    </span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#142446] mb-1">
                    {div.divisionName}
                  </h3>
                  <div className="flex items-center justify-between text-[11.5px] text-[#475A6F] mb-3">
                    <span>Overall Proficiency:</span>
                    <span className="font-semibold text-[#142446]">
                      {div.overallProficiency}%
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#f0ece4] flex items-center justify-between text-[11px]">
                    <span className="text-[#475A6F]">Top Critical Gap:</span>
                    <span className="font-medium text-[#142446] truncate max-w-[150px]">
                      {div.topDeficientCompetencies[0]?.competencyName || "Sampling Design"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Institutional Framework & Standard Compliance */}
      <section className="bg-[#F3E7D1]/40 border-t border-[#e8d8b8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-2">
              Institutional Governance
            </p>
            <h3
              className="text-[24px] sm:text-[28px] font-light text-[#142446]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Built for India&apos;s Digital Public Infrastructure Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Capacity Building Commission",
                desc: "100% compliant with Mission Karmayogi FRAC competency rubrics and ACBP annual planning guidelines.",
                icon: ShieldCheck,
              },
              {
                title: "iGOT Karmayogi Bharat",
                desc: "Direct integration via Sunbird APIs for live course catalogue retrieval, enrollment, and score sync.",
                icon: Globe2,
              },
              {
                title: "NSSTA Greater Noida",
                desc: "Curated residential, online, and mid-career training programmes under the TPAC national training calendar.",
                icon: Award,
              },
              {
                title: "MoSPI / DIID",
                desc: "Administered by the Data Informatics and Innovation Division ensuring strict data privacy and GIGW compliance.",
                icon: Building2,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-[#e8d8b8] shadow-sm space-y-2.5"
                >
                  <div className="p-2 rounded-lg bg-[#142446] text-[#F3E7D1] inline-block">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#142446] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[12.5px] text-[#475A6F] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#142446] text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F3E7D1] text-[11px] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#D8921E]" />
            <span>Karmasarthi &nbsp;·&nbsp; कर्मसारथी</span>
          </div>

          <h2
            className="text-[34px] sm:text-[46px] font-light text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Start Your Cadre Competency Journey Today.
          </h2>

          <p className="text-[15px] text-[#B7C7D9] max-w-2xl mx-auto leading-relaxed">
            Take a 10-minute self-assessment to identify your competency gaps and receive a personalized learning roadmap curated from iGOT Karmayogi and NSSTA.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D8921E] text-white text-[14px] font-semibold rounded-lg hover:bg-[#e8a835] transition-all shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Begin Self-Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quiz-studio"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#475A6F] text-white text-[14px] font-medium rounded-lg hover:border-[#B7C7D9] hover:bg-white/5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D8921E]" />
              <span>Generate Quiz from Manual</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
