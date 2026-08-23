import React from "react";
import { repository } from "@/lib/storage/repository";
import { SelfAssessmentWizard } from "@/components/assessment/SelfAssessmentWizard";
import Link from "next/link";
import { ChevronRight, Home, Shield, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  // Fetch initial data from zero-config repository
  const competencies = await repository.getCompetencies();
  const benchmarks = await repository.getAllCadreBenchmarks();
  const user = await repository.getUserProfile("usr_001");

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top MoSPI Header Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 tracking-tight block">
                  MoSPI Skill Intelligence Platform
                </span>
                <span className="text-[11px] text-slate-500 block font-medium">
                  Official Statistics Competency Framework (CBC / FRAC)
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Navigation Links */}
          <nav className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link
              href="/dashboard/learner"
              className="hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Learner Dashboard
            </Link>
            <Link
              href="/catalog"
              className="hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Course Catalog
            </Link>
            <Link
              href="/quiz-studio"
              className="hover:text-indigo-600 transition-colors hidden md:block"
            >
              AI Quiz Studio
            </Link>
            <Link
              href="/dashboard/admin"
              className="hover:text-indigo-600 transition-colors hidden lg:block"
            >
              Leadership Analytics
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            FRAC Self-Assessment & Skill Gap Engine
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SelfAssessmentWizard
          initialTaxonomy={competencies}
          initialBenchmarks={benchmarks}
          initialUser={user}
        />
      </div>
    </main>
  );
}
