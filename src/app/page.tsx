import Link from "next/link";
import Image from "next/image";
import { repository } from "@/lib/storage/repository";

export default async function HomePage() {
  const competencies = await repository.getCompetencies();
  const courses = await repository.getCourses();
  const quizzes = await repository.getQuizzes();
  const divisions = await repository.getDivisionAggregateData();

  const stats = [
    { value: competencies.length, label: "Competencies Mapped", sub: "across 4 FRAC domains" },
    { value: courses.length, label: "Courses Curated", sub: "iGOT & NSSTA TPAC" },
    { value: quizzes.length, label: "Standard Quizzes", sub: "objective assessments" },
    { value: divisions.length, label: "Divisions Monitored", sub: "MoSPI coverage" },
  ];

  const capabilities = [
    {
      number: "01",
      title: "Competency Gap Analysis",
      body: "Evaluates each official's profile against predefined FRAC competency benchmarks across Statistical, Technical, Digital Governance, and Behavioural domains — producing a precise skill-gap map.",
      href: "/assessment",
      linkText: "Begin Self-Assessment",
    },
    {
      number: "02",
      title: "Personalized Learning Pathways",
      body: "AI-driven recommendations pull from the iGOT Karmayogi course repository and NSSTA TPAC training calendar, matched to designation, cadre, and identified gap priorities.",
      href: "/catalog",
      linkText: "Explore Course Catalog",
    },
    {
      number: "03",
      title: "AI Assessment Generation",
      body: "Upload survey manuals, circulars, or methodology PDFs. The AI engine extracts content and generates Bloom-weighted MCQs and quizzes with instant evaluation and explanations.",
      href: "/quiz-studio",
      linkText: "Open Quiz Studio",
    },
    {
      number: "04",
      title: "Analytics and Workforce Intelligence",
      body: "Role-based dashboards surface competency radars for individual officers and division-level heatmaps for administrators — enabling data-driven ACBP planning and predictive capacity building.",
      href: "/dashboard/admin",
      linkText: "View Analytics",
    },
  ];

  const domains = [
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
  ];

  const ecosystem = [
    {
      name: "iGOT Karmayogi Bharat",
      role: "Primary course repository. Platform retrieves course catalogues, tracks enrolment and completion, and syncs competency scores via Sunbird APIs.",
    },
    {
      name: "NSSTA TPAC",
      role: "Residential and online training programmes from the National Statistical Systems Training Academy are surfaced alongside iGOT recommendations.",
    },
    {
      name: "FRAC Framework",
      role: "Roles, Activities, and Competencies framework published by the Capacity Building Commission underpins every assessment rubric and gap-closure recommendation.",
    },
    {
      name: "MoSPI / DIID",
      role: "The Data Informatics and Innovation Division drives the platform strategy, administers ACBP planning, and maintains the competency taxonomy.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#f9f8f5]">

      {/* ── Government top bar ─────────────────────────────────── */}
      <div className="bg-[#142446]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
          <span className="text-[11px] text-[#B7C7D9] tracking-wide font-medium">
            Government of India &nbsp;·&nbsp; Ministry of Statistics and Programme Implementation
          </span>
          <span className="text-[11px] text-[#475A6F] hidden sm:block">
            Mission Karmayogi &nbsp;·&nbsp; SIH 26101
          </span>
        </div>
      </div>

      {/* Tricolor */}
      <div className="tricolor-bar">
        <span />
        <span />
        <span />
      </div>

      {/* ── Navbar ────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/karmasarthi.png"
              alt="Karmasarthi"
              width={36}
              height={36}
              className="object-contain"
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-semibold text-[#142446] text-[13px]"
                  style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                >
                  कर्मसारथी
                </span>
                <span className="text-[#C7C2BA] text-xs select-none">|</span>
                <span className="font-semibold text-[#142446] text-[13px] tracking-widest uppercase">
                  Karmasarthi
                </span>
              </div>
              <p className="text-[10px] text-[#475A6F] hidden sm:block tracking-wide mt-0.5">
                AI Skill Intelligence Platform · MoSPI
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-0.5">
            {[
              { href: "/assessment", label: "Self-Assessment" },
              { href: "/catalog", label: "Course Catalog" },
              { href: "/quiz-studio", label: "AI Quiz Studio" },
              { href: "/dashboard/learner", label: "Learner Hub" },
              { href: "/dashboard/admin", label: "Admin" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-[12.5px] font-medium text-[#475A6F] hover:text-[#142446] rounded-md hover:bg-[#f3f1ec] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-2 px-4 py-1.5 bg-[#142446] text-white text-[12.5px] font-medium rounded-md hover:bg-[#1e3460] transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-[#142446] text-white overflow-hidden relative">
        {/* Very subtle texture — no gradient */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(183,199,217,1) 39px, rgba(183,199,217,1) 40px)`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D8921E] mb-6 animate-section">
              India&apos;s Official Statistical System · Capacity Building
            </p>

            {/* Platform name — bilingual */}
            <div className="mb-2 animate-section-delay-1">
              <span
                className="text-[28px] sm:text-[36px] font-semibold text-[#F3E7D1] leading-none tracking-wide"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                कर्मसारथी
              </span>
              <span className="mx-3 text-[#475A6F] font-light">·</span>
              <span className="text-[28px] sm:text-[36px] font-semibold text-[#F3E7D1] leading-none tracking-[0.06em] uppercase">
                Karmasarthi
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[38px] sm:text-[54px] lg:text-[64px] font-light text-white leading-[1.08] tracking-tight mb-6 animate-section-delay-1">
              Empowering India&apos;s
              <br />
              <span className="font-semibold">Statistical Workforce</span>
              <br />
              <span className="text-[#B7C7D9] font-light">through intelligent learning.</span>
            </h1>

            {/* Subtext */}
            <p className="text-[15px] sm:text-[17px] text-[#B7C7D9] font-light leading-relaxed mb-10 max-w-2xl animate-section-delay-2">
              An AI-enabled platform that identifies competency gaps, recommends personalized
              training from iGOT Karmayogi, and generates assessments from your learning materials —
              built for MoSPI officials at every level of the statistical cadre.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-section-delay-3">
              <Link
                href="/login"
                className="px-7 py-3 bg-[#D8921E] text-white text-[14px] font-semibold rounded-md hover:bg-[#e8a835] transition-colors"
              >
                Begin Competency Assessment
              </Link>
              <Link
                href="/quiz-studio"
                className="px-7 py-3 border border-[#475A6F] text-[#B7C7D9] text-[14px] font-medium rounded-md hover:border-[#B7C7D9] hover:text-white transition-colors"
              >
                Try AI Quiz Studio
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom edge — clean cut into ivory */}
        <div className="h-16 bg-[#f9f8f5]" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </section>

      {/* ── PLATFORM STATS ────────────────────────────────────────── */}
      <section className="bg-[#F3E7D1]/50 border-y border-[#e8d8b8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#e8d8b8]">
            {stats.map((stat, i) => (
              <div key={i} className="px-6 sm:px-10 py-2 text-center first:pl-0 last:pr-0">
                <div className="text-[40px] sm:text-[52px] font-light text-[#142446] leading-none tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[13px] font-semibold text-[#142446] mt-1">
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

      {/* ── WHAT IS KARMASARTHI ────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
                The Platform
              </p>
              <h2
                className="text-[32px] sm:text-[40px] font-light text-[#142446] leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The intelligent guide for every statistical officer&apos;s career journey.
              </h2>
              <div className="w-10 h-[2px] bg-[#D8921E] mb-7" />
              <p className="text-[14.5px] text-[#475A6F] leading-relaxed mb-5">
                India&apos;s Official Statistical System is undergoing rapid transformation.
                Officials across MoSPI&apos;s divisions require continuous upskilling — in
                statistics, data science, AI, cloud computing, and digital governance —
                to meet evolving national mandates.
              </p>
              <p className="text-[14.5px] text-[#475A6F] leading-relaxed mb-5">
                Karmasarthi bridges the gap between where officials stand today and where
                they need to be. It builds a comprehensive competency profile for every
                official, identifies precise knowledge gaps against FRAC benchmarks, and
                surfaces the most relevant learning resources from iGOT Karmayogi and NSSTA.
              </p>
              <p className="text-[14.5px] text-[#475A6F] leading-relaxed">
                Trainers can upload PDFs, presentations, and circulars to instantly generate
                MCQs and quizzes — making assessment creation effortless and continuous
                learning measurable.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-0 divide-y divide-[#f0ece4]">
              {capabilities.map((cap) => (
                <div key={cap.number} className="py-7 group">
                  <div className="flex items-start gap-6">
                    <span className="text-[11px] font-mono font-semibold text-[#D8921E] pt-1 shrink-0">
                      {cap.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-[#142446] mb-2">
                        {cap.title}
                      </h3>
                      <p className="text-[13.5px] text-[#475A6F] leading-relaxed mb-3">
                        {cap.body}
                      </p>
                      <Link
                        href={cap.href}
                        className="text-[12.5px] font-medium text-[#142446] hover-underline inline-block"
                      >
                        {cap.linkText}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPETENCY DOMAINS ────────────────────────────────── */}
      <section className="bg-[#f9f8f5] border-t border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
              FRAC Competency Taxonomy
            </p>
            <h2
              className="text-[32px] sm:text-[38px] font-light text-[#142446] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Four domains. Every skill that matters.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e4dc]">
            {domains.map((domain) => (
              <div
                key={domain.label}
                className="bg-white p-8 hover:bg-[#F3E7D1]/20 transition-colors duration-300"
              >
                <div className="mb-5">
                  <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#D8921E]">
                    {domain.label}
                  </span>
                  <div className="w-6 h-[1.5px] bg-[#D8921E] mt-2" />
                </div>
                <ul className="space-y-2.5">
                  {domain.items.map((item) => (
                    <li key={item} className="text-[13px] text-[#475A6F] leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/assessment"
              className="inline-block text-[13px] font-medium text-[#142446] border-b border-[#D8921E] pb-0.5 hover:text-[#D8921E] transition-colors"
            >
              Assess your standing across all domains
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="bg-[#142446] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
              How It Works
            </p>
            <h2
              className="text-[32px] sm:text-[38px] font-light text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              From profile to learning path in minutes.
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px bg-[#1e3460]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "1",
                  title: "Build Your Profile",
                  desc: "Enter your designation, division, educational background, work experience, and prior training history.",
                },
                {
                  step: "2",
                  title: "Competency Assessment",
                  desc: "Complete a structured self-assessment mapped to 29 competencies across 4 FRAC domains with Level 1–5 rubrics.",
                },
                {
                  step: "3",
                  title: "Gap Identification",
                  desc: "The AI engine compares your profile against your cadre benchmark and identifies priority skill gaps.",
                },
                {
                  step: "4",
                  title: "Learning Pathway",
                  desc: "Receive personalized course recommendations from iGOT Karmayogi and NSSTA, ranked by relevance and urgency.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#D8921E] text-[#D8921E] text-[13px] font-semibold mb-4 relative bg-[#142446]">
                    {item.step}
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#B7C7D9] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-[#D8921E] text-white text-[14px] font-semibold rounded-md hover:bg-[#e8a835] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM INTEGRATION ───────────────────────────── */}
      <section className="bg-white border-t border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
                Ecosystem
              </p>
              <h2
                className="text-[32px] sm:text-[38px] font-light text-[#142446] leading-tight mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Built on and for India&apos;s digital governance infrastructure.
              </h2>
              <div className="w-10 h-[2px] bg-[#D8921E] mb-6" />
              <p className="text-[14px] text-[#475A6F] leading-relaxed">
                Karmasarthi integrates with established government platforms through
                standard APIs — ensuring data sovereignty, interoperability, and compliance
                with GIGW and cybersecurity guidelines.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#f0ece4]">
              {ecosystem.map((item) => (
                <div key={item.name} className="py-6 flex gap-8 items-start">
                  <span className="text-[12px] font-semibold text-[#142446] min-w-[180px] shrink-0 pt-0.5">
                    {item.name}
                  </span>
                  <p className="text-[13.5px] text-[#475A6F] leading-relaxed flex-1">
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI QUIZ STUDIO HIGHLIGHT ─────────────────────────── */}
      <section className="bg-[#F3E7D1]/60 border-t border-[#e8d8b8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
              Intelligent Assessment Engine
            </p>
            <h2
              className="text-[32px] sm:text-[40px] font-light text-[#142446] leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Upload a manual. Receive a complete assessment in seconds.
            </h2>
            <div className="w-10 h-[2px] bg-[#D8921E] mb-7" />
            <p className="text-[15px] text-[#475A6F] leading-relaxed mb-6 max-w-2xl">
              Trainers and supervisors can upload NSS survey manuals, CPI circulars, training
              documents, or presentation slides. Karmasarthi&apos;s AI engine — powered by
              Large Language Models and NLP — extracts core concepts, generates Bloom-weighted
              MCQs, and provides instant evaluation with explanations for every answer.
            </p>
            <p className="text-[13.5px] text-[#475A6F] leading-relaxed mb-8">
              Supports PDF, PPTX, DOCX, and video transcripts. Available in multiple languages
              including Hindi, for wider accessibility across statistical offices.
            </p>
            <Link
              href="/quiz-studio"
              className="inline-block px-7 py-3 bg-[#142446] text-white text-[14px] font-semibold rounded-md hover:bg-[#1e3460] transition-colors"
            >
              Open AI Quiz Studio
            </Link>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW CTA ───────────────────────────── */}
      <section className="bg-[#f9f8f5] border-t border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#e8e4dc]">
            <div className="py-8 md:py-0 md:pr-16">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
                For Officers
              </p>
              <h3 className="text-[22px] font-semibold text-[#142446] mb-4 leading-tight">
                Learner Dashboard
              </h3>
              <p className="text-[13.5px] text-[#475A6F] leading-relaxed mb-6">
                Track your competency profile across all four domains, view identified
                skill gaps by priority, monitor learning hours, and access your personalized
                course recommendations — all in one place.
              </p>
              <Link
                href="/dashboard/learner"
                className="text-[13px] font-medium text-[#142446] border-b border-[#D8921E] pb-0.5 hover:text-[#D8921E] transition-colors"
              >
                View Learner Dashboard
              </Link>
            </div>

            <div className="py-8 md:py-0 md:pl-16">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-4">
                For Administrators
              </p>
              <h3 className="text-[22px] font-semibold text-[#142446] mb-4 leading-tight">
                Admin Analytics
              </h3>
              <p className="text-[13.5px] text-[#475A6F] leading-relaxed mb-6">
                View division-level competency heatmaps across FOD, ESD, NAD, DIID, and SDRD.
                Track training effectiveness, predict future skill requirements, and generate
                Annual Capacity Building Plans automatically.
              </p>
              <Link
                href="/dashboard/admin"
                className="text-[13px] font-medium text-[#142446] border-b border-[#D8921E] pb-0.5 hover:text-[#D8921E] transition-colors"
              >
                View Admin Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="bg-[#142446]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8921E] font-semibold mb-6">
            Karmasarthi · कर्मसारथी
          </p>
          <h2
            className="text-[32px] sm:text-[44px] font-light text-white leading-tight mb-5 max-w-2xl mx-auto"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            A future-ready statistical workforce starts here.
          </h2>
          <p className="text-[15px] text-[#B7C7D9] max-w-xl mx-auto mb-10 leading-relaxed">
            Begin your competency assessment today and receive a personalized learning
            pathway aligned with your role in India&apos;s Official Statistical System.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 bg-[#D8921E] text-white text-[14px] font-semibold rounded-md hover:bg-[#e8a835] transition-colors"
            >
              Begin Assessment
            </Link>
            <Link
              href="/catalog"
              className="px-8 py-3 border border-[#475A6F] text-[#B7C7D9] text-[14px] font-medium rounded-md hover:border-[#B7C7D9] hover:text-white transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#0d1a33] text-[#B7C7D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#142446]">

            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <Image
                  src="/karmasarthi.png"
                  alt="Karmasarthi"
                  width={36}
                  height={36}
                  className="object-contain opacity-80"
                />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-semibold text-white text-[13px]"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                    >
                      कर्मसारथी
                    </span>
                    <span className="text-[#475A6F] text-xs select-none">|</span>
                    <span className="font-semibold text-white text-[13px] tracking-widest uppercase">
                      Karmasarthi
                    </span>
                  </div>
                  <p className="text-[10px] text-[#475A6F] mt-0.5 tracking-wide">
                    AI Skill Intelligence Platform
                  </p>
                </div>
              </div>
              <p className="text-[12px] text-[#B7C7D9]/70 leading-relaxed max-w-xs">
                Data Informatics and Innovation Division (DIID), Ministry of Statistics
                and Programme Implementation, Government of India.
              </p>
              <div className="flex gap-2.5 flex-wrap">
                <span className="text-[10px] px-2.5 py-1 border border-[#D8921E]/60 text-[#D8921E] rounded font-medium tracking-wider uppercase">
                  SIH 26101
                </span>
                <span className="text-[10px] px-2.5 py-1 border border-[#1e3460] text-[#475A6F] rounded tracking-wider uppercase">
                  FRAC 2026
                </span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#F3E7D1]">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/dashboard/learner", label: "Learner Dashboard" },
                  { href: "/dashboard/admin", label: "Admin Analytics" },
                  { href: "/acbp", label: "Annual Capacity Building Plan" },
                  { href: "/assessment", label: "Competency Self-Assessment" },
                  { href: "/catalog", label: "Course Catalog" },
                  { href: "/quiz-studio", label: "AI Quiz Studio" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-[#B7C7D9]/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#F3E7D1]">
                Institutional Framework
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Mission Karmayogi (CBC)",
                  "iGOT Karmayogi Bharat",
                  "NSSTA Greater Noida (TPAC)",
                  "FRAC 4-Domain Taxonomy",
                  "MoSPI / DIID",
                ].map((item) => (
                  <li key={item} className="text-[12.5px] text-[#B7C7D9]/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#F3E7D1]">
                Statistical Cadres
              </h4>
              <ul className="space-y-2 text-[12px] text-[#B7C7D9]/70">
                <li>ISS Assistant Director</li>
                <li>Senior Statistical Officer</li>
                <li>Junior Statistical Officer</li>
                <li className="pt-2 text-[10px] font-mono text-[#475A6F]">
                  FOD · ESD · NAD · DIID · SDRD
                </li>
              </ul>
            </div>
          </div>

          <div className="py-5 border-b border-[#142446]">
            <p className="text-[11px] text-[#475A6F] text-center">
              <span className="text-[#D8921E]">Prototype:</span>
              &nbsp;Course catalog uses representative data schema-matched to iGOT Karmayogi and NSSTA TPAC.
              Assessment profiles are simulated for demonstration purposes.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#475A6F]">
              &copy; 2026 Ministry of Statistics and Programme Implementation (MoSPI). All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-[#475A6F]">
              <span>GIGW Compliant</span>
              <span className="text-[#1e3460]">·</span>
              <span>Karmayogi Standard</span>
              <span className="text-[#1e3460]">·</span>
              <span className="font-mono text-[10px]">v1.0.0-beta</span>
            </div>
          </div>
        </div>

        <div className="tricolor-bar">
          <span />
          <span />
          <span />
        </div>
      </footer>

    </main>
  );
}
