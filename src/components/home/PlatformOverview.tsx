"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function PlatformOverview() {
  const coreFeatures = [
    {
      step: "01",
      title: "Role-Based Competency Assessment",
      description:
        "Evaluate your skills across 29 official statistical competencies mapped to your specific cadre benchmark (JSO, SSO, or ISS AD).",
      linkText: "Check My Score →",
      linkHref: "/assessment",
    },
    {
      step: "02",
      title: "Personalized Course Pathways",
      description:
        "Get instant course recommendations from iGOT Karmayogi Bharat and NSSTA Academy tailored directly to close your identified skill gaps.",
      linkText: "Explore Catalog →",
      linkHref: "/catalog",
    },
    {
      step: "03",
      title: "AI Document-to-Quiz Studio",
      description:
        "Upload any official survey manual or statistical guideline PDF to generate verified practice questions and test your conceptual readiness.",
      linkText: "Try Quiz Studio →",
      linkHref: "/quiz-studio",
    },
    {
      step: "04",
      title: "Workforce Intelligence & ACBP",
      description:
        "Empower ministry leadership with division-wide skill heatmaps, training progress tracking, and automated capacity building planning.",
      linkText: "View Analytics →",
      linkHref: "/dashboard/admin",
    },
  ];

  return (
    <section className="bg-[#142446] text-white py-16 lg:py-24 border-t border-[#1e3460]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Brand Showcase Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-14 border-b border-white/10">
          
          {/* Large Logo & Brand Identity */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="bg-white p-3 rounded-2xl shadow-xl inline-block">
              <Image
                src="/karmasarthi.png"
                alt="Karmasarthi Platform Logo"
                width={280}
                height={80}
                priority
                className="h-[60px] w-auto object-contain"
              />
            </div>
            
            <div className="pt-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D8921E]">
                Official Statistical Learning Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                How Karmasarthi Powers Your Upskilling
              </h2>
            </div>
          </div>

          {/* Simple, Human-Understandable Platform Overview */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <p className="text-sm sm:text-base text-[#B7C7D9] leading-relaxed">
              Designed as an intelligent extension of the <strong>Mission Karmayogi</strong> ecosystem, Karmasarthi eliminates the guesswork in professional development for statistical officers across India.
            </p>
            <p className="text-xs sm:text-sm text-[#B7C7D9]/80 leading-relaxed">
              From field data collection in FOD to national accounts modeling in NAD, every officer receives a clear roadmap of what to learn, where to learn it, and how to verify their mastery.
            </p>
          </div>

        </div>

        {/* 4 Core Features Flow (Spacious, Non-Boxy Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
          {coreFeatures.map((feat) => (
            <div key={feat.step} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-[#F3E7D1] border border-white/15">
                  {feat.step}
                </span>
                <div className="h-px flex-1 bg-white/15" />
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {feat.title}
              </h3>

              <p className="text-xs text-[#B7C7D9] leading-relaxed">
                {feat.description}
              </p>

              <div className="pt-1">
                <Link
                  href={feat.linkHref}
                  className="text-xs font-semibold text-[#F3E7D1] hover:text-white transition-colors"
                >
                  {feat.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
