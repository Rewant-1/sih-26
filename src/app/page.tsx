import React from "react";
import Link from "next/link";
import { repository } from "@/lib/storage/repository";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage() {
  const competencies = await repository.getCompetencies();
  const courses = await repository.getCourses();
  const quizzes = await repository.getQuizzes();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ── HERO ── */}
      <section className="bg-[#142446] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8921E] font-semibold mb-6">
            India&apos;s Official Statistical System · Capacity Building
          </p>
          <h1 className="text-[42px] sm:text-[56px] lg:text-[64px] font-light text-white leading-[1.08] tracking-tight max-w-4xl">
            Empowering India&apos;s{" "}
            <span className="font-semibold">Statistical Workforce</span>{" "}
            <br className="hidden sm:block" />
            through intelligent learning.
          </h1>
          <p className="mt-6 text-[16px] text-[#B7C7D9] max-w-2xl leading-relaxed font-normal">
            An AI-enabled platform that identifies competency gaps, recommends personalized
            training from iGOT Karmayogi, and generates assessments from your learning materials
            — built for MoSPI officials at every level of the statistical cadre.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D8921E] text-white text-[14px] font-semibold rounded-lg hover:bg-[#c47f18] transition-colors"
            >
              Begin Competency Assessment
            </Link>
            <Link
              href="/quiz-studio"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#475A6F] text-white text-[14px] font-medium rounded-lg hover:border-[#B7C7D9] transition-colors"
            >
              Try AI Quiz Studio
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#F3E7D1] border-y border-[#e4d8c0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e4d8c0]">
            {[
              { value: `${competencies.length}`, label: "FRAC Competencies", sub: "Across 4 domains" },
              { value: `${courses.length}`, label: "Curated Courses", sub: "iGOT & NSSTA TPAC" },
              { value: `${quizzes.length}`, label: "Standard Assessments", sub: "Bloom-weighted" },
              { value: "5", label: "Divisions Covered", sub: "FOD · ESD · NAD · DIID · SDRD" },
            ].map((s, i) => (
              <div key={i} className="bg-[#F3E7D1] px-8 py-8 text-center">
                <div className="text-[48px] font-light text-[#142446] leading-none">{s.value}</div>
                <div className="text-[13px] font-semibold text-[#142446] mt-2">{s.label}</div>
                <div className="text-[11px] text-[#475A6F] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ── */}
      <section className="bg-white border-b border-[#e8e4dc] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#475A6F] font-semibold mb-4">
                The Platform
              </p>
              <h2 className="text-[34px] sm:text-[42px] font-light text-[#142446] leading-tight">
                The intelligent guide for every statistical officer&apos;s career journey.
              </h2>
              <div className="w-10 h-[2px] bg-[#D8921E] mt-6 mb-8" />
              <p className="text-[15px] text-[#475A6F] leading-relaxed mb-5">
                India&apos;s Official Statistical System is undergoing rapid transformation.
                Officials across MoSPI&apos;s divisions require continuous upskilling — in
                statistics, data science, AI, cloud computing, and digital governance —
                to meet evolving national mandates.
              </p>
              <p className="text-[15px] text-[#475A6F] leading-relaxed mb-5">
                Karmasarthi bridges the gap between where officials stand today and
                where they need to be. It builds a comprehensive competency profile
                for every official, identifies precise knowledge gaps against FRAC
                benchmarks, and surfaces the most relevant learning resources from
                iGOT Karmayogi and NSSTA.
              </p>
              <p className="text-[15px] text-[#475A6F] leading-relaxed">
                Trainers can upload PDFs, presentations, and circulars to instantly
                generate MCQs and quizzes — making assessment creation effortless
                and continuous learning measurable.
              </p>
            </div>

            {/* Right — numbered capability list */}
            <div className="space-y-0 divide-y divide-[#e8e4dc]">
              {[
                {
                  n: "01",
                  title: "Competency Gap Analysis",
                  desc: "Evaluates each official's profile against predefined FRAC competency benchmarks across Statistical, Technical, Digital Governance, and Behavioural domains — producing a precise skill-gap map.",
                  link: "/assessment",
                  cta: "Begin Self-Assessment",
                },
                {
                  n: "02",
                  title: "Personalized Learning Pathways",
                  desc: "AI-driven recommendations pull from the iGOT Karmayogi course repository and NSSTA TPAC training calendar, matched to designation, cadre, and identified gap priorities.",
                  link: "/catalog",
                  cta: "Explore Course Catalog",
                },
                {
                  n: "03",
                  title: "AI Assessment Generation",
                  desc: "Upload survey manuals, circulars, or methodology PDFs. The AI engine extracts content and generates Bloom-weighted MCQs and quizzes with instant evaluation and explanations.",
                  link: "/quiz-studio",
                  cta: "Open Quiz Studio",
                },
                {
                  n: "04",
                  title: "Analytics and Workforce Intelligence",
                  desc: "Role-based dashboards surface competency radars for individual officers and division-level heatmaps for administrators — enabling data-driven ACBP planning and predictive capacity building.",
                  link: "/dashboard/admin",
                  cta: "View Analytics",
                },
              ].map((item) => (
                <div key={item.n} className="py-7">
                  <div className="flex items-start gap-5">
                    <span className="text-[12px] font-mono font-bold text-[#D8921E] pt-0.5 shrink-0 w-6">
                      {item.n}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[16px] font-semibold text-[#142446] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[14px] text-[#475A6F] leading-relaxed mb-3">
                        {item.desc}
                      </p>
                      <Link
                        href={item.link}
                        className="text-[13px] font-semibold text-[#142446] hover:text-[#D8921E] transition-colors"
                      >
                        {item.cta} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── FRAC DOMAINS ── */}
      <section className="bg-[#f9f8f5] border-b border-[#e8e4dc] py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8921E] font-semibold mb-3">
              FRAC Competency Taxonomy
            </p>
            <h2 className="text-[34px] sm:text-[40px] font-light text-[#142446]">
              Four domains. Every skill that matters.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e4dc] border border-[#e8e4dc] rounded-xl overflow-hidden">
            {[
              {
                label: "Statistical",
                items: ["Survey Design", "Sampling Methods", "National Accounts", "Price Statistics", "SDG Indicators", "Data Quality Frameworks"],
              },
              {
                label: "Technical",
                items: ["Python & R", "SQL & SPSS", "GIS & Visualization", "AI / ML", "Cloud Computing", "Open Data & APIs"],
              },
              {
                label: "Digital Governance",
                items: ["Cybersecurity", "Data Privacy", "Digital Signatures", "Government Cloud", "Digital Public Infrastructure"],
              },
              {
                label: "Behavioural",
                items: ["Leadership", "Communication", "Project Management", "Ethics", "Decision Making", "Change Management"],
              },
            ].map((domain) => (
              <div key={domain.label} className="bg-white p-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#D8921E] mb-3">
                  {domain.label}
                </p>
                <div className="w-6 h-[2px] bg-[#D8921E] mb-5" />
                <ul className="space-y-2.5">
                  {domain.items.map((item) => (
                    <li key={item} className="text-[13.5px] text-[#142446]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#142446] py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8921E] font-semibold mb-3">
              How It Works
            </p>
            <h2 className="text-[34px] sm:text-[40px] font-light text-white">
              From profile to personalised learning in four steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Build your profile",
                desc: "Enter your designation, division, educational background, work experience, and prior training history.",
              },
              {
                step: "02",
                title: "Complete self-assessment",
                desc: "Complete a structured self-assessment mapped to 29 competencies across 4 FRAC domains with Level 1–5 rubrics.",
              },
              {
                step: "03",
                title: "AI gap analysis",
                desc: "The AI engine compares your profile against your cadre benchmark and identifies priority skill gaps.",
              },
              {
                step: "04",
                title: "Get recommendations",
                desc: "Receive personalized course recommendations from iGOT Karmayogi and NSSTA, ranked by relevance and urgency.",
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="text-[11px] font-mono font-bold text-[#D8921E] mb-3">{step.step}</div>
                <h3 className="text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-[13.5px] text-[#B7C7D9] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D8921E] text-white text-[14px] font-semibold rounded-lg hover:bg-[#c47f18] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ── */}
      <section className="bg-white border-b border-[#e8e4dc] py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#475A6F] font-semibold mb-4">
                Ecosystem
              </p>
              <h2 className="text-[34px] sm:text-[40px] font-light text-[#142446] leading-tight">
                Built on and for India&apos;s digital governance infrastructure.
              </h2>
              <div className="w-10 h-[2px] bg-[#D8921E] mt-6 mb-6" />
              <p className="text-[15px] text-[#475A6F] leading-relaxed">
                Karmasarthi integrates with established government platforms through standard APIs — ensuring data sovereignty, interoperability, and alignment with Mission Karmayogi.
              </p>
            </div>

            <div className="divide-y divide-[#e8e4dc]">
              {[
                {
                  name: "iGOT Karmayogi Bharat",
                  desc: "Primary course repository. Platform retrieves course catalogues, tracks enrolment and completion, and syncs competency scores via Sunbird APIs.",
                },
                {
                  name: "NSSTA TPAC",
                  desc: "Residential and online training programmes from the National Statistical Systems Training Academy are surfaced alongside iGOT recommendations.",
                },
                {
                  name: "FRAC Framework",
                  desc: "Roles, Activities, and Competencies framework published by the Capacity Building Commission underpins every assessment rubric and gap-closure recommendation.",
                },
                {
                  name: "MoSPI / DIID",
                  desc: "Administered by the Data Informatics and Innovation Division. All data processed on government infrastructure under strict privacy protocols.",
                },
              ].map((item) => (
                <div key={item.name} className="py-6 grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <p className="text-[13px] font-semibold text-[#142446]">{item.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[13.5px] text-[#475A6F] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── DASHBOARD GATEWAYS ── */}
      <section className="bg-[#f9f8f5] border-b border-[#e8e4dc] py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#e8e4dc] border border-[#e8e4dc] rounded-xl overflow-hidden">

            {/* Learner */}
            <div className="bg-white p-10 lg:p-14">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#D8921E] mb-4">
                For Officers
              </p>
              <h3 className="text-[26px] font-light text-[#142446] mb-3">
                Learner Dashboard
              </h3>
              <p className="text-[14px] text-[#475A6F] leading-relaxed mb-6">
                View your personal competency radar, skill gaps mapped to FRAC benchmarks, and a prioritized learning roadmap with integrated iGOT course recommendations.
              </p>
              <Link
                href="/dashboard/learner"
                className="text-[13px] font-semibold text-[#142446] hover:text-[#D8921E] transition-colors"
              >
                View Learner Dashboard →
              </Link>
            </div>

            {/* Admin */}
            <div className="bg-[#142446] p-10 lg:p-14">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#D8921E] mb-4">
                For Leadership
              </p>
              <h3 className="text-[26px] font-light text-white mb-3">
                Admin Analytics
              </h3>
              <p className="text-[14px] text-[#B7C7D9] leading-relaxed mb-6">
                Division-level heatmaps, cadre skill distribution, training completion metrics, and workforce intelligence for data-driven ACBP planning.
              </p>
              <Link
                href="/dashboard/admin"
                className="text-[13px] font-semibold text-white hover:text-[#D8921E] transition-colors"
              >
                View Admin Dashboard →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#142446] py-24 lg:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8921E] font-semibold mb-4">
            Karmasarthi
          </p>
          <h2 className="text-[34px] sm:text-[44px] font-light text-white leading-tight mb-4">
            A future-ready statistical workforce starts here.
          </h2>
          <p className="text-[15px] text-[#B7C7D9] leading-relaxed mb-10">
            Begin your competency assessment today and receive a personalized learning
            pathway aligned with your role in India&apos;s Official Statistical System.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D8921E] text-white text-[14px] font-semibold rounded-lg hover:bg-[#c47f18] transition-colors"
            >
              Begin Assessment
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#475A6F] text-white text-[14px] font-medium rounded-lg hover:border-[#B7C7D9] transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
