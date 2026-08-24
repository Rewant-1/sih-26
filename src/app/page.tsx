import Link from "next/link";
import { repository } from "@/lib/storage/repository";
import {
  Compass,
  GraduationCap,
  Sparkles,
  BarChart3,
  Building2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";

export default async function HomePage() {
  const competencies = await repository.getCompetencies();
  const courses = await repository.getCourses();
  const quizzes = await repository.getQuizzes();
  const divisions = await repository.getDivisionAggregateData();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top National Header Bar */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-amber-400">
              Government of India
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Ministry of Statistics and Programme Implementation (MoSPI)
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded text-[11px] font-medium">
              Mission Karmayogi FRAC
            </span>
            <span>DIID • SIH 26101</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-md border border-blue-800">
              M
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-2">
                <span>MoSPI Skill Intelligence Platform</span>
                <span className="hidden sm:inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                  FRAC 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Capacity Building & Assessment Engine for Official Statistics Cadres
              </p>
            </div>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/assessment"
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Self-Assessment
            </Link>
            <Link
              href="/catalog"
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Course Catalog
            </Link>
            <Link
              href="/quiz-studio"
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              AI Quiz Studio
            </Link>
            <Link
              href="/dashboard/learner"
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Learner Hub
            </Link>
            <Link
              href="/dashboard/admin"
              className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 rounded-md transition-colors shadow-sm"
            >
              Admin Heatmap
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mission Karmayogi FRAC Framework for National Statistical System</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Empowering India&apos;s Statistical Cadres with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-blue-300">
              AI-Driven Skill Intelligence
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            Multi-domain competency assessment across {competencies.length} official MoSPI skills, transparent cadre-gap analysis, dual-source recommendations (iGOT Karmayogi &amp; NSSTA TPAC), and AI-generated assessments from survey manuals.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <span>Start Competency Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quiz-studio"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium px-6 py-3 rounded-lg border border-slate-700 shadow-md backdrop-blur-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Document-to-Quiz Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Data Summary Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {competencies.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                FRAC Competencies (4 Domains)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {courses.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                iGOT &amp; NSSTA Courses
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {quizzes.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Official Standard Quizzes
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {divisions.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                MoSPI Divisions Monitored
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Core Architectural Capabilities
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2">
            Integrated end-to-end framework aligning individual statistical officer capacity with national strategic data priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                FRAC Gap Engine (R1)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                29 MoSPI competencies across 4 domains (Statistical, Technical, Digital Governance, Behavioural) with Level 1-5 rubrics mapped to ISS AD, SSO, and JSO cadre benchmarks.
              </p>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              <span>Explore Self-Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Sunbird &amp; NSSTA Adapter (R2)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Dual-source catalog architecture uniting iGOT Karmayogi micro-courses and NSSTA TPAC residential training with competency-matched gap closure algorithms.
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              <span>Browse Course Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                AI Doc-to-Quiz Studio (R3)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Extracts text from NSS survey manuals, CPI circulars, and methodology PDFs to generate Bloom-weighted MCQs with Gemini AI and air-gapped offline fallback.
              </p>
            </div>
            <Link
              href="/quiz-studio"
              className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              <span>Launch Quiz Studio</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Role-Based Analytics (R4)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Interactive Learner 4-domain radar charts, prioritized skill-gap cards, division heatmaps (FOD, ESD, NAD, DIID, SDRD), and automated ACBP training planning.
              </p>
            </div>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              <span>View Admin Heatmap</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-semibold text-white">
              MoSPI Skill Intelligence Platform
            </span>{" "}
            • Smart India Hackathon (SIH 26101)
          </div>
          <div className="flex items-center space-x-4">
            <span>Mission Karmayogi FRAC Standard</span>
            <span>•</span>
            <span>National Statistical Systems Training Academy (NSSTA)</span>
            <span>•</span>
            <span>Data Informatics and Innovation Division (DIID)</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
