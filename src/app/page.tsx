import React from "react";
import Link from "next/link";
import { repository } from "@/lib/storage/repository";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CadrePathways } from "@/components/home/CadrePathways";
import { CompetencyMatrix } from "@/components/home/CompetencyMatrix";
import { AssessmentWorkflow } from "@/components/home/AssessmentWorkflow";
import { KarmasarthiHubs } from "@/components/home/KarmasarthiHubs";

export default async function HomePage() {
  const competencies = await repository.getCompetencies();
  const courses = await repository.getCourses();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Universal Header with Floating Capsule Navbar */}
      <Header />

      <main className="flex-1">
        {/* ── 1. MAJESTIC DEEP NAVY HERO ── */}
        <HeroSection
          competencyCount={competencies.length}
          courseCount={courses.length}
        />

        {/* ── 2. STATISTICAL CAPACITY DIMENSIONS (Clean Metrics Ribbon) ── */}
        <section className="bg-[#FAF9F6] border-b border-[#C7C2BA]/60 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  value: `${competencies.length}`,
                  label: "FRAC Competencies",
                  sub: "4 Official Statistical Domains",
                },
                {
                  value: `${courses.length}`,
                  label: "Curated Courses",
                  sub: "iGOT Karmayogi & NSSTA TPAC",
                },
                {
                  value: "3 Tiers",
                  label: "Official Cadres",
                  sub: "ISS AD · SSO · JSO Benchmarks",
                },
                {
                  value: "5 Divisions",
                  label: "Workforce Visibility",
                  sub: "FOD · ESD · NAD · DIID · SDRD",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-1 border-l-2 border-[#142446] pl-4"
                >
                  <p className="text-3xl font-bold text-[#142446] tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#142446]">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-[#475A6F]">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. CADRE PATHWAYS & ROLE PROGRESSION ── */}
        <CadrePathways />

        {/* ── 4. OFFICIAL FRAC COMPETENCY ARCHITECTURE ── */}
        <CompetencyMatrix />

        {/* ── 5. AI DOCUMENT-TO-QUIZ SANDBOX SHOWCASE ── */}
        <AssessmentWorkflow />

        {/* ── 6. FOUR CORE FUNCTIONAL HUBS ── */}
        <KarmasarthiHubs />

        {/* ── 7. INSTITUTIONAL CALL-TO-ACTION (Deep Navy) ── */}
        <section className="bg-[#142446] text-white py-16 lg:py-20 border-t border-[#1e3460]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#B7C7D9] text-xs font-medium border border-white/15">
              Mission Karmayogi · Capacity Building Commission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Strengthening India&apos;s Official Statistical Architecture
            </h2>
            <p className="text-sm sm:text-base text-[#B7C7D9] max-w-2xl mx-auto leading-relaxed">
              Empowering statistical officers across field operations, economic statistics, national accounts, and data innovation with continuous, competency-aligned upskilling.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/assessment"
                className="px-6 py-3 bg-[#D8921E] text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-[#c48218] transition-colors"
              >
                Begin Self-Assessment Now →
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3 border border-white/30 hover:border-white text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-white/5 transition-colors"
              >
                Browse Course Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
