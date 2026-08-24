"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  BookOpen,
} from "lucide-react";

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
        "According to Chapter 2 of the NSS 79th Round Manual, the 2011 Census villages constitute the FSUs in rural sector, with hamlet-group formation where village population exceeds 1200.",
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
    <section className="bg-white border-t border-[#e8e4dc] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E7D1]/70 border border-[#e8d8b8] text-[#142446] text-[11px] font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D8921E]" />
            <span>AI Document-to-Quiz Studio</span>
          </div>
          <h2
            className="text-[32px] sm:text-[42px] font-light text-[#142446] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Turn Any Survey Manual into a Verified Assessment.
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#475A6F] max-w-2xl mx-auto mt-3 leading-relaxed">
            Upload official PDF circulars, sampling manuals, or methodology reports.
            Karmasarthi extracts technical concepts, formats Bloom-weighted MCQs, and provides verified government rationale.
          </p>
        </div>

        {/* Interactive Document Selector & Assessment Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sample Manuals & Upload Trigger */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#475A6F]">
              Select Official Document
            </p>

            <div className="space-y-2.5">
              {SAMPLE_DOCS.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setSelectedOption(null);
                      setShowAnswer(false);
                    }}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-[#142446] text-white border-[#142446] shadow-md ring-2 ring-[#D8921E]"
                        : "bg-[#f9f8f5] text-[#475A6F] border-[#e8e4dc] hover:border-[#B7C7D9] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-white/15 text-[#F3E7D1]"
                            : "bg-[#F3E7D1]/60 text-[#142446]"
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-[13.5px] font-semibold leading-snug truncate ${
                            isSelected ? "text-white" : "text-[#142446]"
                          }`}
                        >
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[11px] font-medium ${
                              isSelected ? "text-[#B7C7D9]" : "text-[#475A6F]"
                            }`}
                          >
                            {doc.division}
                          </span>
                          <span
                            className={`text-[10px] ${
                              isSelected ? "text-[#B7C7D9]/60" : "text-[#C7C2BA]"
                            }`}
                          >
                            · {doc.pages} pages
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Upload CTA Box */}
            <div className="p-5 rounded-xl border border-dashed border-[#B7C7D9] bg-[#F3E7D1]/20 mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white text-[#D8921E] shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-[#142446]">
                    Upload Your Own Document
                  </h4>
                  <p className="text-[11.5px] text-[#475A6F]">
                    Supports PDF, DOCX, PPTX & circulars
                  </p>
                </div>
              </div>
              <div className="mt-3.5">
                <Link
                  href="/quiz-studio"
                  className="block w-full py-2 bg-[#142446] text-white text-center text-[12.5px] font-semibold rounded-lg hover:bg-[#1e3460] transition-colors"
                >
                  Open Full AI Quiz Studio →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Generated MCQ Card & Rationale */}
          <div className="lg:col-span-7">
            <div className="bg-[#f9f8f5] border border-[#e8e4dc] rounded-2xl p-7 sm:p-8 shadow-sm">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#e8e4dc]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#D8921E] text-white">
                    {q.bloomLevel}
                  </span>
                  <span className="text-[11px] text-[#475A6F] font-medium hidden sm:inline">
                    Auto-Generated from {selectedDoc.title.split(":")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#475A6F]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2 Mins</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-5">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#142446] leading-relaxed">
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {q.options.map((option, idx) => {
                  const isUserSelected = selectedOption === idx;
                  const isCorrect = idx === q.correctIdx;

                  let optionClass =
                    "bg-white border-[#e8e4dc] text-[#142446] hover:border-[#B7C7D9]";
                  if (showAnswer) {
                    if (isCorrect) {
                      optionClass =
                        "bg-emerald-50 border-emerald-500 text-emerald-950 font-medium";
                    } else if (isUserSelected && !isCorrect) {
                      optionClass =
                        "bg-rose-50 border-rose-400 text-rose-950";
                    }
                  } else if (isUserSelected) {
                    optionClass =
                      "bg-[#F3E7D1]/60 border-[#D8921E] text-[#142446] font-medium";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(idx);
                        setShowAnswer(true);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left text-[13px] transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span>{option}</span>
                      {showAnswer && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Verified Government Rationale */}
              {showAnswer && (
                <div className="p-4 rounded-xl bg-[#F3E7D1]/50 border border-[#e8d8b8] space-y-1.5 animate-in fade-in-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#142446]">
                      Verified Official Methodology Rationale
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#475A6F] leading-relaxed">
                    {q.rationale}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="pt-5 mt-4 border-t border-[#e8e4dc] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setShowAnswer(!showAnswer);
                  }}
                  className="text-[12px] font-semibold text-[#475A6F] hover:text-[#142446]"
                >
                  {showAnswer ? "Hide Explanation" : "Reveal Answer & Rationale"}
                </button>

                <Link
                  href="/quiz-studio"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#142446] hover:text-[#D8921E]"
                >
                  <span>Launch Generator with PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
