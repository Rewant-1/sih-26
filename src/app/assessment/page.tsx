import React from "react";
import { repository } from "@/lib/storage/repository";
import { SelfAssessmentWizard } from "@/components/assessment/SelfAssessmentWizard";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const competencies = await repository.getCompetencies();
  const benchmarks = await repository.getAllCadreBenchmarks();
  const user = await repository.getUserProfile("usr_001");

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f5]">
      <Header />

      {/* Page Title Bar */}
      <div className="bg-white border-b border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center gap-2 text-[12px] text-[#475A6F] mb-2">
            <Link href="/" className="hover:text-[#D8921E] transition-colors">Home</Link>
            <span className="text-[#C7C2BA]">/</span>
            <span className="text-[#142446] font-medium">Self-Assessment</span>
          </div>
          <h1 className="text-[28px] font-light text-[#142446]">
            FRAC Competency Self-Assessment
          </h1>
          <p className="text-[14px] text-[#475A6F] mt-1">
            Evaluate your competency levels across 29 MoSPI domains and generate a personalized skill-gap report.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-10">
        <SelfAssessmentWizard
          initialTaxonomy={competencies}
          initialBenchmarks={benchmarks}
          initialUser={user}
        />
      </div>

      <Footer />
    </div>
  );
}
