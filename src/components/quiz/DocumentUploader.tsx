"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Layers,
  BarChart2,
  RefreshCw,
  CheckCircle,
  FileCheck,
  AlertCircle,
  Settings,
  BookOpen,
  Check,
} from "lucide-react";
import type { Quiz, CompetencyDomain } from "@/lib/types";

interface DocumentUploaderProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

const SAMPLE_DOCUMENTS = [
  {
    title: "NSS 79th Round – Sampling & Listing Manual",
    domain: "Statistical Competencies",
    snippet:
      "Concepts of First Stage Unit (FSU), hamlet-group formation, circular systematic sampling, and PPSWR multipliers.",
    fullContent: `NATIONAL SAMPLE SURVEY OFFICE - 79TH ROUND INSTRUCTIONS TO FIELD STAFF
CHAPTER TWO: SAMPLING DESIGN AND ESTIMATION PROCEDURE
1.1 The first-stage units (FSUs) are census villages (Panchayat wards in Kerala) in the rural sector and Urban Frame Survey (UFS) blocks in the urban sector.
1.2 Hamlet-group (hg) / sub-block (sb) formation: In large FSUs with population >= 1200, the FSU is divided into two or more equal subdivisions called hamlet-groups in rural sector and sub-blocks in urban sector.
1.3 In each selected FSU/hg/sb, four second-stage strata (SSS) are formed for household surveys based on demographic and economic criteria:
  - SSS 1: Relatively affluent households
  - SSS 2: Households having principal earning from non-agricultural enterprise
  - SSS 3: Households having persons with specific educational qualification
  - SSS 4: Remaining households
1.4 From each SSS, sample households are selected by Circular Systematic Sampling (CSS) with a random start.
1.5 For rural sector, sample selection is conducted with Probability Proportional to Size With Replacement (PPSWR), where size is the census population.`,
  },
  {
    title: "CPI Compilation Methodology (Base 2012=100)",
    domain: "Statistical Competencies",
    snippet:
      "Modified Laspeyres index formulation, item baskets, weighting diagrams, and COICOP classifications.",
    fullContent: `CENTRAL STATISTICS OFFICE - CONSUMER PRICE INDEX (BASE 2012=100) MANUAL
SECTION 3: FORMULATION AND AGGREGATION
3.1 The Consumer Price Index for Rural, Urban and Combined sectors is compiled using the Modified Laspeyres Price Index formula.
3.2 Price relatives (R_i) for item 'i' in market 'm' are computed as the geometric mean of elementary price quotes comparing current month price (P_t) to base year price (P_0): R_im = (P_itm / P_i0m) * 100.
3.3 Item-level indices are aggregated into 6 major COICOP groups using base year consumption expenditure weighting diagrams derived from the 68th Round Consumer Expenditure Survey:
  - Group 1: Food and Beverages (Weight: 45.86% Rural, 36.29% Urban)
  - Group 2: Pan, Tobacco and Intoxicants
  - Group 3: Clothing and Footwear
  - Group 4: Housing (Urban only)
  - Group 5: Fuel and Light
  - Group 6: Miscellaneous (Transport, Education, Health)
3.4 Missing price quotes are imputed using the class-mean method or carry-forward method subject to a maximum duration of two consecutive months.`,
  },
  {
    title: "National Data Governance (NDGFP) Standards",
    domain: "Digital Governance & Data Stewardship",
    snippet:
      "Microdata anonymization, k-anonymity (k >= 5), SDMX 2.1 schemas, and GSBPM production phases.",
    fullContent: `MINISTRY OF ELECTRONICS & IT / MoSPI - NATIONAL DATA GOVERNANCE FRAMEWORK
STANDARD OPERATING PROCEDURE ON STATISTICAL MICRODATA ANONYMIZATION
Rule 1: Direct Identifiers (Name, Aadhaar, PAN, Address, GPS coordinates) must be stripped at Stage 1 of the processing pipeline.
Rule 2: Quasi-identifiers (Age, Gender, District, Occupation, Social Group) must satisfy k-anonymity threshold of k >= 5. Any cell combination with frequency less than 5 must undergo top-coding, bottom-coding, or local suppression.
Rule 3: Numerical variables prone to outlier re-identification (Total Annual Income, Landholding Size, Enterprise Turnover) must be perturbed using additive noise or Micro-aggregation before public release.
Rule 4: All official datasets must be accompanied by SDMX 2.1 Data Structure Definitions (DSD) and Data Documentation Initiative (DDI-Codebook) XML metadata schemas.
Rule 5: Dissemination must adhere to the 8 phases of Generic Statistical Business Process Model (GSBPM Version 5.1).`,
  },
];

export function DocumentUploader({ onQuizGenerated }: DocumentUploaderProps) {
  const [activeTab, setActiveTab] = useState<"samples" | "text" | "upload">("samples");
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(0);
  const [rawText, setRawText] = useState<string>(SAMPLE_DOCUMENTS[0].fullContent);
  const [fileName, setFileName] = useState<string>(SAMPLE_DOCUMENTS[0].title);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("medium");
  const [targetDomain, setTargetDomain] = useState<string>("Statistical Competencies");
  const [forceOffline, setForceOffline] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    setRawText(SAMPLE_DOCUMENTS[index].fullContent);
    setFileName(SAMPLE_DOCUMENTS[index].title);
    setTargetDomain(SAMPLE_DOCUMENTS[index].domain);
    setErrorMessage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedSampleIndex(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the uploaded document.");
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!rawText.trim()) {
      setErrorMessage("Please enter, paste, or select a source document first.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: rawText,
          fileName,
          numQuestions,
          difficulty,
          targetDomain: targetDomain === "auto" ? undefined : targetDomain,
          forceOffline,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      onQuizGenerated(data.quiz);
    } catch (err: any) {
      console.error("Quiz generation failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#C7C2BA] overflow-hidden">
      {/* Header Banner (Light Theme) */}
      <div className="bg-[#FAF9F6] border-b border-[#C7C2BA] p-6 text-[#142446]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#475A6F] text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#D8921E]" />
              <span>Assessment & MCQ Generation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#142446]">
              Official Statistics Assessment Studio
            </h2>
            <p className="text-[#475A6F] text-xs sm:text-sm mt-1 max-w-2xl">
              Transform NSS survey manuals, CPI price circulars, and data governance frameworks into pedagogically rigorous, Bloom-weighted assessments.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#142446] border border-[#C7C2BA]">
              Gemini AI + Offline Fallback
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 mt-6 border-b border-[#C7C2BA]/60">
          <button
            onClick={() => {
              setActiveTab("samples");
              if (selectedSampleIndex !== null) {
                handleSelectSample(selectedSampleIndex);
              } else {
                handleSelectSample(0);
              }
            }}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === "samples"
                ? "border-[#142446] text-[#142446]"
                : "border-transparent text-[#475A6F] hover:text-[#142446]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Preloaded MoSPI Manuals</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("text");
              setSelectedSampleIndex(null);
            }}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === "text"
                ? "border-[#142446] text-[#142446]"
                : "border-transparent text-[#475A6F] hover:text-[#142446]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Raw Text / Excerpt</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("upload");
              setSelectedSampleIndex(null);
            }}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === "upload"
                ? "border-[#142446] text-[#142446]"
                : "border-transparent text-[#475A6F] hover:text-[#142446]"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-6 space-y-6">
        {/* TAB 1: Sample Documents */}
        {activeTab === "samples" && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475A6F]">
              Select Official MoSPI Document Fixture:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_DOCUMENTS.map((doc, idx) => {
                const isSelected = selectedSampleIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectSample(idx)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#142446] bg-[#FAF9F6] ring-1 ring-[#142446]"
                        : "border-[#C7C2BA] bg-white hover:border-[#475A6F]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#142446] border border-[#C7C2BA]">
                          {doc.domain.split(" ")[0]}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-[#142446]" />
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-[#142446] line-clamp-2">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-[#475A6F] mt-1 line-clamp-2">
                        {doc.snippet}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Raw Text */}
        {activeTab === "text" && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475A6F]">
              Paste Document Text or Instructions:
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setFileName("Custom Text Input");
              }}
              placeholder="Paste training material, operational survey manuals, or circular text here..."
              className="w-full text-xs p-3.5 border border-[#C7C2BA] rounded-xl font-mono focus:outline-hidden focus:ring-1 focus:ring-[#142446] bg-[#FAF9F6]"
            />
          </div>
        )}

        {/* TAB 3: File Upload */}
        {activeTab === "upload" && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475A6F]">
              Upload Survey / Methodology File:
            </label>
            <div className="border-2 border-dashed border-[#C7C2BA] rounded-xl p-8 text-center bg-[#FAF9F6]">
              <input
                type="file"
                id="doc-upload"
                accept=".txt,.pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-[#142446] mb-2" />
                <span className="text-xs font-bold text-[#142446]">
                  Click to select a file or drag and drop here
                </span>
                <span className="text-[11px] text-[#475A6F] mt-1">
                  Supported formats: PDF (.pdf), Word (.docx), Plain Text (.txt) up to 15MB
                </span>
              </label>
            </div>
            {fileName && (
              <div className="mt-3 flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#C7C2BA] rounded-lg">
                <div className="flex items-center space-x-2 text-xs text-[#142446] font-medium">
                  <FileCheck className="w-4 h-4 text-[#D8921E]" />
                  <span>Loaded File: {fileName}</span>
                </div>
                <span className="text-[11px] text-[#475A6F] font-mono">
                  {rawText.length} characters
                </span>
              </div>
            )}
          </div>
        )}

        {/* Configuration Controls */}
        <div className="bg-[#FAF9F6] rounded-xl p-5 border border-[#C7C2BA] space-y-4">
          <div className="flex items-center space-x-2 text-[#142446] font-bold text-xs uppercase tracking-wider border-b border-[#C7C2BA]/40 pb-2">
            <Settings className="w-3.5 h-3.5 text-[#D8921E]" />
            <span>Generation Parameters & Alignment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Domain Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#142446] mb-1.5 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-[#475A6F]" />
                FRAC Competency Domain
              </label>
              <select
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#C7C2BA] rounded-lg text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
              >
                <option value="auto">Auto-Detect from Content</option>
                <option value="Statistical Competencies">Statistical Competencies</option>
                <option value="Technical Competencies">Technical Competencies</option>
                <option value="Digital Governance & Data Stewardship">
                  Digital Governance & Data Stewardship
                </option>
                <option value="Behavioural & Managerial Competencies">
                  Behavioural & Managerial Competencies
                </option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold text-[#142446] mb-1.5 flex items-center">
                <BarChart2 className="w-3.5 h-3.5 mr-1 text-[#475A6F]" />
                Target Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-white border border-[#C7C2BA] rounded-lg text-[#142446] focus:outline-hidden focus:ring-1 focus:ring-[#142446]"
              >
                <option value="all">Mixed (Multi-level Bloom)</option>
                <option value="easy">Easy (Remember / Understand)</option>
                <option value="medium">Medium (Apply / Analyze)</option>
                <option value="hard">Hard (Evaluate / Complex)</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-[#142446] mb-1.5">
                Questions Count: <span className="font-bold text-[#142446]">{numQuestions}</span>
              </label>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-[#142446] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#475A6F] mt-1">
                <span>3 Qs (Quick)</span>
                <span>8 Qs</span>
                <span>15 Qs (Comprehensive)</span>
              </div>
            </div>
          </div>

          {/* Offline Mode Switch */}
          <div className="pt-2 flex items-center justify-between border-t border-[#C7C2BA]/40">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="force-offline"
                checked={forceOffline}
                onChange={(e) => setForceOffline(e.target.checked)}
                className="w-4 h-4 text-[#142446] rounded border-[#C7C2BA] focus:ring-[#142446] cursor-pointer"
              />
              <label htmlFor="force-offline" className="text-xs text-[#142446] cursor-pointer">
                <span className="font-semibold">Force Deterministic Offline Fallback</span>{" "}
                <span className="text-[#475A6F]">
                  (Air-gapped field training mode without Gemini API)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2.5 p-4 rounded-lg bg-[#FAF9F6] border border-[#C7C2BA] text-[#142446] text-xs">
            <AlertCircle className="w-4 h-4 text-[#D8921E] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-[#142446] hover:bg-[#1e3460] text-white font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50 text-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Bloom Assessment...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>Generate Assessment Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
