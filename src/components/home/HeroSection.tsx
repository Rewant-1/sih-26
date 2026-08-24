"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection({
  competencyCount,
  courseCount,
}: {
  competencyCount: number;
  courseCount: number;
}) {
  return (
    <section className="bg-[#142446] text-white relative overflow-hidden">
      {/* Subtle geometric grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authoritative Editorial & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* National Framework Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#B7C7D9] text-[12px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D8921E]" />
              <span>Mission Karmayogi FRAC Framework · MoSPI DIID</span>
            </div>

            {/* Bilingual Platform Title */}
            <div className="flex items-baseline gap-3 pt-1">
              <span
                className="text-[32px] sm:text-[42px] font-devanagari font-bold text-[#F3E7D1] tracking-wide"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                कर्मसारथी
              </span>
              <span className="text-white/40 text-2xl font-light select-none">|</span>
              <span className="text-[28px] sm:text-[36px] font-sans font-bold text-white tracking-widest uppercase">
                Karmasarthi
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[36px] sm:text-[46px] lg:text-[52px] font-light text-white leading-[1.14] tracking-tight">
              Skill Intelligence & Capacity Building for India&apos;s{" "}
              <span className="font-semibold text-[#F3E7D1]">
                Statistical Cadre.
              </span>
            </h1>

            {/* Concise Value Proposition */}
            <p className="text-[15px] sm:text-[16px] text-[#B7C7D9] font-normal leading-relaxed max-w-2xl">
              Automated FRAC competency gap assessment, personalized learning pathways
              integrated with <strong>iGOT Karmayogi</strong> and <strong>NSSTA TPAC</strong>, and an
              instant <strong>Document-to-Quiz Engine</strong> for official survey manuals and circulars.
            </p>

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D8921E] text-white text-[13.5px] font-semibold rounded-lg hover:bg-[#c48218] transition-colors"
              >
                <span>Begin Competency Assessment</span>
                <span>→</span>
              </Link>
              
              <Link
                href="/quiz-studio"
                className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#B7C7D9]/40 hover:border-white text-white text-[13.5px] font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                <span>AI Quiz Studio</span>
              </Link>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-[#B7C7D9] hover:text-white text-[13.5px] font-medium transition-colors"
              >
                <span>Course Catalog →</span>
              </Link>
            </div>

            {/* Cadre Quick Selectors */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#B7C7D9]/70 font-medium mr-1">Direct Role Pathways:</span>
              {[
                { label: "ISS Officers", href: "/dashboard/learner?user=usr-ad-amit" },
                { label: "Senior Statistical Officers (SSO)", href: "/dashboard/learner?user=usr-sso-priya" },
                { label: "Junior Statistical Officers (JSO)", href: "/dashboard/learner?user=usr-jso-rajesh" },
              ].map((cadre) => (
                <Link
                  key={cadre.label}
                  href={cadre.href}
                  className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[#B7C7D9] hover:text-white transition-colors text-[12px]"
                >
                  {cadre.label}
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: Karmasarthi Crest & Orbital Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              
              {/* Outer Decorative Border Ring */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-8 rounded-full border border-dashed border-[#B7C7D9]/20" />

              {/* Center Emblem Disc */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white border-4 border-[#F3E7D1] shadow-2xl flex flex-col items-center justify-center p-4 z-10">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                  <Image
                    src="/karma.png"
                    alt="Karmasarthi Emblem"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-[12px] font-devanagari font-bold text-[#142446] leading-none block">
                    कर्मसारथी
                  </span>
                </div>
              </div>

              {/* Floating Pill 1: FRAC Competency Metric */}
              <div className="absolute top-2 left-0 bg-[#142446] border border-[#C7C2BA]/40 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-md bg-[#F3E7D1] text-[#142446] flex items-center justify-center font-bold text-xs">
                  {competencyCount}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">FRAC Competencies</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">4 MoSPI Domains</p>
                </div>
              </div>

              {/* Floating Pill 2: iGOT & NSSTA Integration */}
              <div className="absolute bottom-2 left-2 bg-[#142446] border border-[#C7C2BA]/40 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-md bg-[#B7C7D9]/30 text-white flex items-center justify-center font-bold text-xs">
                  {courseCount}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">iGOT & NSSTA Courses</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">Synchronized Catalog</p>
                </div>
              </div>

              {/* Floating Pill 3: AI Engine */}
              <div className="absolute top-6 right-0 bg-[#142446] border border-[#C7C2BA]/40 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-md bg-[#F3E7D1] text-[#142446] flex items-center justify-center font-bold text-[10px]">
                  AI
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Quiz Engine</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">Manuals to MCQs</p>
                </div>
              </div>

              {/* Floating Pill 4: Cadre Benchmark Match */}
              <div className="absolute bottom-4 right-0 bg-[#142446] border border-[#C7C2BA]/40 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-md bg-white/10 text-white flex items-center justify-center font-bold text-[10px]">
                  1–5
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Cadre Rubric</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">100% CBC Aligned</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
