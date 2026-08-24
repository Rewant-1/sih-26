"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function PlatformOverview() {
  const coreFeatures = [
    {
      step: "01",
      title: "Role-Based Skill Assessment",
      description:
        "Evaluate your skills across 29 official statistical competencies mapped to your specific cadre benchmark (JSO, SSO, or ISS AD).",
      linkText: "Check My Score →",
      linkHref: "/assessment",
    },
    {
      step: "02",
      title: "Targeted Learning Pathways",
      description:
        "Get direct course recommendations from iGOT Karmayogi Bharat and NSSTA Academy tailored to bridge your exact skill gaps.",
      linkText: "Explore Courses →",
      linkHref: "/catalog",
    },
    {
      step: "03",
      title: "Instant Document Quizzes",
      description:
        "Upload survey manuals or circulars to generate practice questions and verify your understanding with official citations.",
      linkText: "Try Quiz Studio →",
      linkHref: "/quiz-studio",
    },
    {
      step: "04",
      title: "Workforce Skill Analytics",
      description:
        "Empower ministry leadership with division-wide skill heatmaps, training progress tracking, and capacity building plans.",
      linkText: "View Analytics →",
      linkHref: "/dashboard/admin",
    },
  ];

  return (
    <section className="bg-[#FAF9F6] text-[#142446] py-16 lg:py-24 border-t border-[#C7C2BA]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Brand Showcase Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-12 border-b border-[#C7C2BA]/60">
          
          {/* Large Logo & Brand Identity */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#C7C2BA]/60 inline-block">
              <Image
                src="/karmasarthi.png"
                alt="Karmasarthi Platform Logo"
                width={280}
                height={80}
                priority
                className="h-[64px] w-auto object-contain"
              />
            </div>
            
            <div className="pt-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#475A6F]">
                Official Statistical Learning Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight mt-1">
                How Karmasarthi Powers Your Upskilling
              </h2>
            </div>
          </div>

          {/* Simple, Human-Understandable Platform Overview */}
          <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
            <p className="text-base sm:text-lg font-medium text-[#142446] leading-relaxed">
              Designed as an intelligent companion for the <strong>Mission Karmayogi</strong> ecosystem, Karmasarthi eliminates guesswork in professional upskilling for statistical officers.
            </p>
            <p className="text-xs sm:text-sm text-[#475A6F] leading-relaxed">
              From field survey enumeration in FOD to national accounts modeling in NAD, every officer receives a clear, transparent pathway: assess your competencies, discover recommended courses, and test your mastery.
            </p>
          </div>

        </div>

        {/* 4 Core Features Flow (Open, Spacious, Non-Boxy) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
          {coreFeatures.map((feat) => (
            <div key={feat.step} className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#142446] text-white">
                  {feat.step}
                </span>
                <div className="h-px flex-1 bg-[#C7C2BA]/60" />
              </div>

              <h3 className="text-base font-bold text-[#142446] leading-snug">
                {feat.title}
              </h3>

              <p className="text-xs text-[#475A6F] leading-relaxed">
                {feat.description}
              </p>

              <div className="pt-1">
                <Link
                  href={feat.linkHref}
                  className="text-xs font-bold text-[#142446] hover:text-[#475A6F] transition-colors"
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
