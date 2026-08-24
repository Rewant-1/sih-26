"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SampleDocument {
  id: string;
  title: string;
  division: string;
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
    title: "NSS 79th Round Manual",
    division: "Field Operations Division (FOD)",
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
      bloomLevel: "Bloom: Conceptual Understanding",
      rationale:
        "According to Chapter 2 of the NSS 79th Round Manual, 2011 Census villages constitute the FSUs in rural sectors, with hamlet-group formation where village population exceeds 1200.",
    },
  },
  {
    id: "cpi-manual",
    title: "Consumer Price Index Methodology",
    division: "Economic Statistics Division (ESD)",
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
      bloomLevel: "Bloom: Methodological Application",
      rationale:
        "MoSPI compiles CPI using the Modified Laspeyres Price Index formula with base-year consumption expenditure weights derived from the Consumer Expenditure Survey.",
    },
  },
  {
    id: "sna-guide",
    title: "National Accounts Compilation Guide",
    division: "National Accounts Division (NAD)",
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
      bloomLevel: "Bloom: Analytical Derivation",
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
    <section className="bg-white py-16 lg:py-24 border-t border-[#C7C2BA]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Open Editorial Section Header */}
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#142446]">
            Interactive AI Studio Feature
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142446] tracking-tight">
            Turn Any Official Manual into Instant Practice Quizzes
          </h2>
          <p className="text-sm sm:text-base text-[#475A6F] leading-relaxed pt-1">
            Test yourself on real survey manuals and guidelines. Karmasarthi extracts core concepts, creates multiple choice questions, and verifies answers with official citations.
          </p>
        </div>

        {/* Two-Column Open Product Demo (No Heavy Outer Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Document Switcher */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#475A6F]">
              Select a Manual to Preview:
            </p>
            <div className="space-y-2">
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
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#142446] text-white shadow-sm"
                        : "bg-[#FAF9F6] text-[#142446] hover:bg-[#B7C7D9]/20"
                    }`}
                  >
                    <p className="text-sm font-bold leading-tight">
                      {doc.title}
                    </p>
                    <p className={`text-xs mt-1 ${isActive ? "text-[#B7C7D9]" : "text-[#475A6F]"}`}>
                      {doc.division}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#C7C2BA]/40">
              <Link
                href="/quiz-studio"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#142446] hover:text-[#475A6F] transition-colors"
              >
                <span>Upload your own PDF in AI Studio</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Interactive Question Sandbox */}
          <div className="lg:col-span-8 space-y-6 bg-[#FAF9F6] p-6 sm:p-8 rounded-2xl">
            
            {/* Question Header */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#C7C2BA]/40">
              <span className="text-xs font-bold text-[#142446] uppercase tracking-wider">
                {q.bloomLevel}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#475A6F] border border-[#C7C2BA]/60">
                Official Benchmark Question
              </span>
            </div>

            {/* Question Stem */}
            <p className="text-base sm:text-lg font-bold text-[#142446] leading-snug">
              {q.question}
            </p>

            {/* Options with Proper Green for Correct Answers */}
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === q.correctIdx;

                let optionStyle = "bg-white text-[#142446] border border-[#C7C2BA]/60 hover:border-[#142446]";
                
                // Show clean Green for correct answers
                if (showAnswer && isCorrect) {
                  optionStyle = "bg-[#E8F5E9] text-[#1B5E20] border-2 border-[#2E7D32] font-semibold";
                } else if (showAnswer && isSelected && !isCorrect) {
                  optionStyle = "bg-white text-[#B71C1C] border border-[#B71C1C]";
                } else if (isSelected) {
                  optionStyle = "bg-white text-[#142446] border-2 border-[#142446] font-semibold";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedOption(idx);
                      setShowAnswer(true);
                    }}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {showAnswer && isCorrect && (
                      <span className="text-xs font-bold text-[#1B5E20] bg-white px-2 py-0.5 rounded-md border border-[#2E7D32]/40 ml-2 shrink-0">
                        ✓ Correct Key
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official Rationale & Source Excerpt */}
            {showAnswer && (
              <div className="p-4 rounded-xl bg-white border-l-4 border-[#2E7D32] text-xs text-[#475A6F] space-y-1">
                <p className="font-bold text-[#142446]">
                  Verified Pedagogical Rationale:
                </p>
                <p className="leading-relaxed">
                  {q.rationale}
                </p>
              </div>
            )}

            {/* Action CTA */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#475A6F]">
                Click any option to test your understanding.
              </span>
              <Link
                href="/quiz-studio"
                className="px-5 py-2.5 bg-[#142446] text-white text-xs font-bold rounded-lg hover:bg-[#1e3460] transition-colors"
              >
                Open Full Quiz Studio →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
