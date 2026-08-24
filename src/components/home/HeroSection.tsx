"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Compass,
  GraduationCap,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";

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
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px)`,
        }}
      />

      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#B7C7D9]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#D8921E]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Authoritative Editorial & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* National Framework Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#B7C7D9] text-[11.5px] font-medium backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D8921E] animate-pulse" />
              <span>Mission Karmayogi FRAC Framework &nbsp;·&nbsp; MoSPI DIID</span>
            </div>

            {/* Bilingual Platform Title */}
            <div className="flex items-baseline gap-3 pt-1">
              <span
                className="text-[30px] sm:text-[40px] font-devanagari font-bold text-[#F3E7D1] tracking-wide"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                कर्मसारथी
              </span>
              <span className="text-[#475A6F] text-xl font-light select-none">|</span>
              <span className="text-[28px] sm:text-[38px] font-sans font-bold text-white tracking-widest uppercase">
                Karmasarthi
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] font-light text-white leading-[1.12] tracking-tight">
              AI-Powered Skill Intelligence for India&apos;s{" "}
              <span className="font-semibold text-[#F3E7D1]">
                Statistical Cadre.
              </span>
            </h1>

            {/* Concise Value Proposition */}
            <p className="text-[15px] sm:text-[16px] text-[#B7C7D9] font-normal leading-relaxed max-w-2xl">
              Automated FRAC competency gap assessment, personalized learning pathways
              integrated with <strong>iGOT Karmayogi</strong> and <strong>NSSTA</strong>, and an
              instant <strong>AI Document-to-Quiz Engine</strong> for official survey manuals and circulars.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#D8921E] text-white text-[13.5px] font-semibold rounded-lg hover:bg-[#e8a835] transition-all shadow-md hover:shadow-lg"
              >
                <Compass className="w-4 h-4" />
                <span>Begin Competency Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/quiz-studio"
                className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#475A6F] hover:border-[#B7C7D9] text-white text-[13.5px] font-medium rounded-lg hover:bg-white/5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D8921E]" />
                <span>AI Quiz Studio</span>
              </Link>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-[#B7C7D9] hover:text-white text-[13.5px] font-medium transition-colors"
              >
                <span>Course Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cadre Quick Selectors */}
            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#B7C7D9]/70 font-medium mr-1">Target Cadres:</span>
              {[
                { label: "ISS Officers", href: "/dashboard/learner?user=usr-ad-amit" },
                { label: "Senior Statistical Officers (SSO)", href: "/dashboard/learner?user=usr-sso-priya" },
                { label: "Junior Statistical Officers (JSO)", href: "/dashboard/learner?user=usr-jso-rajesh" },
              ].map((cadre) => (
                <Link
                  key={cadre.label}
                  href={cadre.href}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[#B7C7D9] hover:text-white transition-all text-[11.5px]"
                >
                  {cadre.label}
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: Majestic Karmasarthi Crest & Orbital Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border border-[#D8921E]/30 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-[#B7C7D9]/20" />
              <div className="absolute inset-14 rounded-full border border-[#F3E7D1]/25" />

              {/* Center Emblem Disc */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-white border-4 border-[#D8921E] shadow-2xl flex flex-col items-center justify-center p-4 z-10 transition-transform duration-500 hover:scale-105">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <Image
                    src="/karmasarthi.png"
                    alt="Karmasarthi National Emblem"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <div className="text-center mt-1">
                  <span className="text-[11px] font-devanagari font-bold text-[#142446] leading-none block">
                    कर्मसारथी
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#475A6F] uppercase">
                    SIH 26101
                  </span>
                </div>
              </div>

              {/* Floating Pill 1: FRAC Competency Metric */}
              <div className="absolute top-2 left-2 sm:-left-4 bg-[#142446]/95 border border-[#D8921E]/60 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-[#D8921E]/20 text-[#D8921E] flex items-center justify-center font-bold text-xs">
                  {competencyCount}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">FRAC Competencies</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">4 MoSPI Domains</p>
                </div>
              </div>

              {/* Floating Pill 2: iGOT & NSSTA Integration */}
              <div className="absolute bottom-4 left-0 bg-[#142446]/95 border border-[#B7C7D9]/40 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-[#B7C7D9]/20 text-[#B7C7D9] flex items-center justify-center font-bold text-xs">
                  {courseCount}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">iGOT & NSSTA Courses</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">Synchronized Catalog</p>
                </div>
              </div>

              {/* Floating Pill 3: AI Engine */}
              <div className="absolute top-8 right-0 sm:-right-4 bg-[#142446]/95 border border-[#F3E7D1]/40 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-[#F3E7D1]/20 text-[#F3E7D1] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#D8921E]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">AI Assessment Engine</p>
                  <p className="text-[9.5px] text-[#B7C7D9]">NSS Manuals to MCQs</p>
                </div>
              </div>

              {/* Floating Pill 4: Cadre Benchmark Match */}
              <div className="absolute -bottom-2 right-4 sm:-right-2 bg-[#142446]/95 border border-[#D8921E]/60 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Cadre Rubric 1–5</p>
                  <p className="text-[9.5px] text-emerald-400 font-mono">100% CBC Aligned</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Clean Bottom Slant Cut into Ivory */}
      <div className="h-8 bg-[#f9f8f5]" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
    </section>
  );
}
