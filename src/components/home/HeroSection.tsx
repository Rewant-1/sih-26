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
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Authoritative & Clear Editorial Content */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* National Framework Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#B7C7D9] text-[11.5px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8921E]" />
              <span>Mission Karmayogi · Capacity Building Framework</span>
            </div>

            {/* Bilingual Platform Title */}
            <div className="flex items-baseline gap-3 pt-0.5">
              <span
                className="text-[28px] sm:text-[36px] font-devanagari font-bold text-[#F3E7D1] tracking-wide"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                कर्मसारथी
              </span>
              <span className="text-white/30 text-xl font-light select-none">|</span>
              <span className="text-[24px] sm:text-[30px] font-sans font-bold text-white tracking-wider uppercase">
                Karmasarthi
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[30px] sm:text-[40px] lg:text-[44px] font-light text-white leading-[1.15] tracking-tight">
              Skill Intelligence & Capacity Building for India&apos;s{" "}
              <span className="font-semibold text-[#F3E7D1]">
                Statistical System
              </span>
            </h1>

            {/* Concise Value Proposition */}
            <p className="text-[14.5px] sm:text-[15.5px] text-[#B7C7D9] font-normal leading-relaxed max-w-2xl">
              An intelligent learning companion that evaluates your role-based skill gaps, recommends targeted courses from <strong>iGOT Karmayogi</strong> and <strong>NSSTA</strong>, and creates instant practice quizzes from official survey manuals.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#D8921E] text-white text-[13px] font-semibold rounded-lg hover:bg-[#c48218] transition-colors"
              >
                <span>Check Your Skill Scores</span>
                <span>→</span>
              </Link>
              
              <Link
                href="/quiz-studio"
                className="inline-flex items-center gap-2 px-4 py-3 border border-[#B7C7D9]/40 hover:border-white text-white text-[13px] font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                <span>AI Quiz Studio</span>
              </Link>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-1 px-3 py-3 text-[#B7C7D9] hover:text-white text-[13px] font-medium transition-colors"
              >
                <span>Explore Courses →</span>
              </Link>
            </div>

            {/* Cadre Quick Selectors */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#B7C7D9]/70 font-medium mr-1">Choose Cadre:</span>
              {[
                { label: "ISS Officers", href: "/dashboard/learner?user=usr-ad-amit" },
                { label: "Senior Statistical Officers (SSO)", href: "/dashboard/learner?user=usr-sso-priya" },
                { label: "Junior Statistical Officers (JSO)", href: "/dashboard/learner?user=usr-jso-rajesh" },
              ].map((cadre) => (
                <Link
                  key={cadre.label}
                  href={cadre.href}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[#B7C7D9] hover:text-white transition-colors text-[11.5px]"
                >
                  {cadre.label}
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: Orbital Circle Design with Circular Nodes (Non-Boxy) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
              
              {/* Outer Orbit Rings */}
              <div className="absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-8 rounded-full border border-dashed border-[#B7C7D9]/25" />
              <div className="absolute inset-16 rounded-full border border-[#F3E7D1]/20" />

              {/* Center Emblem Disc */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white border-4 border-[#F3E7D1] shadow-2xl flex flex-col items-center justify-center p-3 z-10">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                  <Image
                    src="/karma.png"
                    alt="Karmasarthi Emblem"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <div className="text-center mt-1">
                  <span className="text-[11.5px] font-devanagari font-bold text-[#142446] leading-none block">
                    कर्मसारथी
                  </span>
                </div>
              </div>

              {/* Orbital Node 1: Top-Right (Angle ~ 30°) */}
              <div className="absolute top-2 right-4 sm:-right-2 bg-[#142446] border border-[#B7C7D9]/60 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
                <span className="w-5 h-5 rounded-full bg-[#F3E7D1] text-[#142446] flex items-center justify-center font-bold text-[10px]">
                  {competencyCount}
                </span>
                <span className="text-[11px] font-medium text-[#F3E7D1]">
                  FRAC Competencies
                </span>
              </div>

              {/* Orbital Node 2: Bottom-Right (Angle ~ 125°) */}
              <div className="absolute bottom-4 right-2 sm:-right-2 bg-[#142446] border border-[#B7C7D9]/60 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  1–5
                </span>
                <span className="text-[11px] font-medium text-white">
                  Cadre Rubrics
                </span>
              </div>

              {/* Orbital Node 3: Bottom-Left (Angle ~ 220°) */}
              <div className="absolute bottom-6 left-0 sm:-left-4 bg-[#142446] border border-[#B7C7D9]/60 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
                <span className="w-5 h-5 rounded-full bg-[#B7C7D9]/30 text-white flex items-center justify-center font-bold text-[10px]">
                  {courseCount}
                </span>
                <span className="text-[11px] font-medium text-[#B7C7D9]">
                  iGOT & NSSTA Courses
                </span>
              </div>

              {/* Orbital Node 4: Top-Left (Angle ~ 310°) */}
              <div className="absolute top-8 left-2 sm:-left-2 bg-[#142446] border border-[#B7C7D9]/60 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
                <span className="w-5 h-5 rounded-full bg-[#D8921E]/30 text-[#D8921E] flex items-center justify-center font-bold text-[9px]">
                  AI
                </span>
                <span className="text-[11px] font-medium text-white">
                  Doc-to-Quiz Studio
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
