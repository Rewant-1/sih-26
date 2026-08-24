import React from "react";
import Link from "next/link";
import { repository } from "@/lib/storage/repository";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CadrePathways } from "@/components/home/CadrePathways";
import { PlatformOverview } from "@/components/home/PlatformOverview";
import { CompetencyMatrix } from "@/components/home/CompetencyMatrix";
import { AssessmentWorkflow } from "@/components/home/AssessmentWorkflow";

export default async function HomePage() {
  const competencies = await repository.getCompetencies();
  const courses = await repository.getCourses();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Universal Header with Embedded Capsule Navbar & Large Logo */}
      <Header />

      <main className="flex-1">
        {/* ── 1. HERO SECTION (Deep Navy) ── */}
        <HeroSection
          competencyCount={competencies.length}
          courseCount={courses.length}
        />

        {/* ── 2. METRICS RIBBON (Clean, Minimal Dividers) ── */}
        <section className="bg-[#FAF9F6] border-b border-[#C7C2BA]/60 py-8">
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
                  className="space-y-0.5 border-l-2 border-[#142446] pl-4"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight">
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

        {/* ── 3. CADRE PATHWAYS & ROLE PROGRESSION (Light / White) ── */}
        <CadrePathways />

        {/* ── 4. BRAND & CORE FEATURES SHOWCASE (Alternating Deep Navy with Logo) ── */}
        <PlatformOverview />

        {/* ── 5. OFFICIAL FRAC COMPETENCY ARCHITECTURE (Light / Soft Canvas) ── */}
        <CompetencyMatrix />

        {/* ── 6. INTERACTIVE DOCUMENT-TO-QUIZ SANDBOX (Light / White) ── */}
        <AssessmentWorkflow />

        {/* ── 7. FINAL CALL-TO-ACTION SECTION (Light White/Ivory contrasting with Navy Footer) ── */}
        <section className="bg-[#FAF9F6] text-[#142446] py-16 lg:py-20 border-t border-[#C7C2BA]/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white text-[#142446] text-xs font-semibold border border-[#C7C2BA]">
              Capacity Building Commission Aligned
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight">
              Ready to Discover Your Official Competency Profile?
            </h2>

            <p className="text-xs sm:text-sm text-[#475A6F] max-w-xl mx-auto leading-relaxed">
              Complete your self-assessment in minutes to receive instant course recommendations from iGOT Karmayogi and NSSTA.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/assessment"
                className="px-6 py-3 bg-[#D8921E] text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-[#c48218] transition-colors"
              >
                Begin Self-Assessment Now →
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3 bg-white border border-[#C7C2BA] hover:bg-[#FAF9F6] text-[#142446] text-xs sm:text-sm font-semibold rounded-lg transition-colors"
              >
                Browse Course Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Deep Navy Footer */}
      <Footer />
    </div>
  );
}
