"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SampleDocument {
  id: string;
  title: string;
  division: string;
  pages: number;
  sampleQuestion: {
    question: string;
    options: string[];
    correctIdx: number;
    bloomLevel: string;
    rationale: string;
  };
}

const SAMPLE_DOCS: SampleDocument[] = [
  {
    id: "nss-79",
    title: "NSS 79th Round: Survey on AYUSH & Domestic Tourism",
    division: "Field Operations Division (FOD)",
    pages: 48,
    sampleQuestion: {
      question:
        "In NSS Household Survey sampling design, what constitutes the First Stage Unit (FSU) in the rural sector?",
      options: [
        "A. Gram Panchayat Revenue Block",
        "B. 2011 Census Village / Sub-unit (Hamlet group)",
        "C. Block Development Officer Zone",
        "D. Agricultural Holding Cluster",
      ],
      correctIdx: 1,
      bloomLevel: "Bloom: Understand",
      rationale:
        "According to Chapter 2 of the NSS 79th Round Manual, 2011 Census villages constitute the FSUs in rural sectors, with hamlet-group formation where village population exceeds 1200.",
    },
  },
  {
    id: "cpi-manual",
    title: "Consumer Price Index (Base 2012=100) Methodology",
    division: "Economic Statistics Division (ESD)",
    pages: 36,
    sampleQuestion: {
      question:
        "Which aggregation formula is officially adopted by MoSPI for compiling the All-India Consumer Price Index (Rural/Urban)?",
      options: [
        "A. Unweighted Simple Geometric Mean (Jevons)",
        "B. Modified Laspeyres Price Index Formula",
        "C. Paasche Current-Weighted Formula",
        "D. Fisher Ideal Geometric Index",
      ],
      correctIdx: 1,
      bloomLevel: "Bloom: Apply",
      rationale:
        "MoSPI compiles CPI using the Modified Laspeyres Price Index formula with base-year consumption expenditure weights derived from the Consumer Expenditure Survey.",
    },
  },
  {
    id: "sna-guide",
    title: "System of National Accounts: Gross Value Added Compilation",
    division: "National Accounts Division (NAD)",
    pages: 62,
    sampleQuestion: {
      question:
        "Under the revised National Accounts series (2011-12 base), GDP at Market Prices is derived as:",
      options: [
        "A. GVA at Basic Prices + Net Taxes on Products (Taxes – Subsidies)",
        "B. GVA at Factor Cost + Consumption of Fixed Capital",
        "C. Gross National Income – Net Primary Income from Abroad",
        "D. NDP at Basic Prices + Subsidies on Production",
      ],
      correctIdx: 0,
      bloomLevel: "Bloom: Analyze",
      rationale:
        "As per SNA 2008 guidelines adopted by NAD, GDP at Market Prices = GVA at Basic Prices + Product Taxes – Product Subsidies.",
    },
  },
];

export function AssessmentWorkflow() {
  const [selectedDocId, setSelectedDocId] = useState<string>("nss-79");
  const [selectedOption, setSelectedOption] = useState<number | null>(1);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);

  const selectedDoc =
    SAMPLE_DOCS.find((d) => d.id === selectedDocId) || SAMPLE_DOCS[0];
  const q = selectedDoc.sampleQuestion;

  return (
    <section className="bg-white border-t border-[#C7C2BA]/60 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C7C2BA]/60 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
              AI Document-to-Quiz Technology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142446] tracking-tight mt-1">
              Extract Objective Assessments from MoSPI Manuals
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#475A6F] max-w-xl">
            Upload survey instructions, index methodology circulars, or national accounts manuals to automatically generate Bloom-weighted MCQs with verified citations.
          </p>
        </div>

        {/* Interactive Document Selector & Question Preview (Spacious, No Boxy Cards) */}
        <div className="border border-[#C7C2BA] rounded-2xl bg-[#FAF9F6] p-6 sm:p-10 space-y-8">
          
          {/* Document Tabs */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#475A6F] block mb-3">
              Select Sample Official Document:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {SAMPLE_DOCS.map((doc) => {
                const isActive = doc.id === selectedDocId;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setSelectedOption(null);
                      setShowAnswer(false);
                    }}
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors text-left ${
                      isActive
                        ? "bg-[#142446] text-white border-[#142446]"
                        : "bg-white text-[#142446] border-[#C7C2BA] hover:bg-[#F3E7D1]/50"
                    }`}
                  >
                    <span>{doc.title}</span>
                    <span className="text-[10px] opacity-75 ml-2">
                      ({doc.division})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generated MCQ Sandbox */}
          <div className="bg-white border border-[#C7C2BA] rounded-xl p-6 sm:p-8 space-y-6">
            
            {/* Question Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#C7C2BA]/40">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D8921E]">
                {q.bloomLevel}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#FAF9F6] text-[#475A6F] border border-[#C7C2BA]">
                Official Benchmark Question
              </span>
            </div>

            {/* Question Stem */}
            <p className="text-sm sm:text-base font-bold text-[#142446] leading-relaxed">
              {q.question}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === q.correctIdx;

                let optionClasses = "border-[#C7C2BA] bg-white text-[#142446] hover:bg-[#FAF9F6]";
                if (showAnswer && isCorrect) {
                  optionClasses = "border-[#142446] bg-[#F3E7D1] text-[#142446] font-semibold";
                } else if (showAnswer && isSelected && !isCorrect) {
                  optionClasses = "border-[#142446] bg-white text-[#142446]";
                } else if (isSelected) {
                  optionClasses = "border-[#142446] bg-[#FAF9F6] font-semibold";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedOption(idx);
                      setShowAnswer(true);
                    }}
                    className={`p-3.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-between ${optionClasses}`}
                  >
                    <span>{opt}</span>
                    {showAnswer && isCorrect && (
                      <span className="text-xs font-bold text-[#142446] ml-2">
                        ✓ Correct Key
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official Rationale & Source Excerpt */}
            {showAnswer && (
              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#C7C2BA] space-y-1.5 text-xs text-[#475A6F]">
                <p className="font-bold text-[#142446]">
                  Verified Pedagogical Rationale:
                </p>
                <p className="leading-relaxed">
                  {q.rationale}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[#C7C2BA]/40 flex items-center justify-between">
              <span className="text-xs text-[#475A6F]">
                Generate assessments from your own PDF guidelines
              </span>
              <Link
                href="/quiz-studio"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#142446] text-white text-xs font-bold rounded-lg hover:bg-[#1e3460] transition-colors"
              >
                <span>Open AI Quiz Studio</span>
                <span>→</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
