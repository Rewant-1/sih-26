"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import type { Quiz } from "../../lib/types";
import { DocumentUploader } from "../../components/quiz/DocumentUploader";
import { QuizRunner } from "../../components/quiz/QuizRunner";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import Link from "next/link";

export default function QuizStudioPage() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleQuizGenerated = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f5]">
      <Header />

      {/* Page Title Bar */}
      <div className="bg-white border-b border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[#475A6F] mb-2">
              <Link href="/" className="hover:text-[#D8921E] transition-colors">Home</Link>
              <span className="text-[#C7C2BA]">/</span>
              <span className="text-[#142446] font-medium">AI Quiz Studio</span>
            </div>
            <h1 className="text-[28px] font-light text-[#142446]">
              AI Document-to-Quiz Studio
            </h1>
            <p className="text-[14px] text-[#475A6F] mt-1 max-w-2xl">
              Upload official survey manuals, circulars, or methodology notes to generate Bloom-weighted MCQs aligned with the FRAC framework.
            </p>
          </div>
          {activeQuiz && (
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-4 py-2 text-[13px] font-medium text-[#142446] border border-[#e8e4dc] rounded-lg hover:border-[#B7C7D9] hover:bg-white transition-colors self-start"
            >
              ← Back to Studio
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-10 space-y-8">
        {activeQuiz ? (
          <QuizRunner
            quiz={activeQuiz}
            userId="usr-jso-rajesh"
            userCadre="JUNIOR_STATISTICAL_OFFICER"
          />
        ) : (
          <>
            <DocumentUploader onQuizGenerated={handleQuizGenerated} />

            {/* Pre-seeded Assessment Bank */}
            <div className="bg-white border border-[#e8e4dc] rounded-xl p-7">
              <div className="flex items-center justify-between pb-5 border-b border-[#e8e4dc]">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#142446]">
                    Official MoSPI Assessment Bank
                  </h2>
                  <p className="text-[13px] text-[#475A6F] mt-0.5">
                    Validated benchmark quizzes — NSS 79th Round, CPI Base 2012, and NDGFP standards.
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F3E7D1] text-[#D8921E] border border-[#e4d0a0]">
                  Ready to Practice
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
                {[
                  {
                    domain: "Statistical",
                    title: "NSS 79th Round: Listing & Sampling",
                    desc: "First Stage Unit delineation, hamlet-group formation, circular systematic sampling, and PPSWR multipliers.",
                    questions: 5,
                    time: "10 mins",
                    href: "/quiz-runner/quiz-nss79-listing",
                  },
                  {
                    domain: "Statistical",
                    title: "CPI (Base 2012=100) Methodology",
                    desc: "Modified Laspeyres formulation, COICOP basket weights, seasonal adjustment, and price collection protocols.",
                    questions: 4,
                    time: "8 mins",
                    href: "/quiz-runner/quiz-cpi-methodology",
                  },
                  {
                    domain: "Governance",
                    title: "National Data Governance (NDGFP)",
                    desc: "Microdata anonymization, k-anonymity standards, SDMX DSDs, Collection of Statistics Act, and GSBPM.",
                    questions: 4,
                    time: "8 mins",
                    href: "/quiz-runner/quiz-ndgfp-governance",
                  },
                ].map((quiz, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between p-5 rounded-xl border border-[#e8e4dc] hover:border-[#B7C7D9] transition-colors bg-[#f9f8f5]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#F3E7D1] text-[#D8921E] border border-[#e4d0a0]">
                          {quiz.domain}
                        </span>
                        <span className="text-[12px] text-[#475A6F] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {quiz.time}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#142446] leading-snug">
                        {quiz.title}
                      </h3>
                      <p className="text-[12.5px] text-[#475A6F] leading-relaxed">
                        {quiz.desc}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#e8e4dc] flex items-center justify-between">
                      <span className="text-[12px] text-[#475A6F] font-medium">
                        {quiz.questions} Questions
                      </span>
                      <Link
                        href={quiz.href}
                        className="px-3.5 py-1.5 bg-[#142446] hover:bg-[#1e3460] text-white text-[12px] font-semibold rounded-lg transition-colors"
                      >
                        Take Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
