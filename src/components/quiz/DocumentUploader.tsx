"use client";

import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  FileCheck,
  Sparkles,
  Cpu,
  AlertCircle,
  BookOpen,
  Settings,
  Layers,
  BarChart2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import type { CompetencyDomain, Quiz, QuestionDifficulty } from "../../lib/types";

const SAMPLE_DOCS = [
  {
    title: "NSS 79th Round - Sampling & Listing Manual",
    domain: "Statistical Competencies" as CompetencyDomain,
    fileName: "NSS_79th_Round_Instructions.pdf",
    description: "Concepts of First Stage Unit (FSU), hamlet-group formation, circular systematic sampling, and PPSWR multipliers.",
    content: `NATIONAL SAMPLE SURVEY OFFICE (NSSO)
INSTRUCTIONS TO FIELD STAFF: 79TH ROUND
CHAPTER THREE: CONCEPTS, DEFINITIONS AND PROCEDURES

3.1 First Stage Unit (FSU): In the rural sector, the First Stage Units (FSUs) are the 2011 Census villages (Panchayat wards in Kerala). In the urban sector, the FSUs are the latest Urban Frame Survey (UFS) blocks.

3.2 Formation of Hamlet-groups (hg) / Sub-blocks (sb): Large FSUs with high population need to be subdivided to reduce listing workload. If the estimated present population of the rural FSU is:
- Less than 1,200: No hamlet-group formation (1 hg).
- 1,200 to 1,799: 2 hamlet-groups are formed.
- 1,800 to 2,399: 3 hamlet-groups are formed.
- 2,400 to 2,999: 4 hamlet-groups are formed.
Hamlet-groups must have roughly equal population content and clear geographic boundaries.

3.3 Selection of Ultimate Stage Units (Households): In each selected FSU/hg, exactly 8 sample households shall be selected by Circular Systematic Sampling with a random start for canvassing Schedule 10.3.

3.4 Estimation and Multipliers: For PPSWR sampling of FSUs, the sampling weight (multiplier) in the estimation formula is given by M_i = Z / (n_s * Z_si), where Z is the total size of the stratum and Z_si is the size of the selected FSU.`,
  },
  {
    title: "CPI Compilation Methodology (Base 2012=100)",
    domain: "Statistical Competencies" as CompetencyDomain,
    fileName: "CPI_Compilation_Methodology_Circular.pdf",
    description: "Modified Laspeyres index formulation, item baskets, weighting diagrams, and COICOP classifications.",
    content: `CENTRAL STATISTICS OFFICE (CSO), MoSPI
METHODOLOGY FOR COMPILATION OF CONSUMER PRICE INDEX (BASE 2012=100)

1. Scope and Weighting Diagram: The Consumer Price Index (CPI) measures the change over time in the general price level of consumer goods and services acquired by households. The current series uses Base Year 2012=100. Weighting diagrams are derived from the 68th Round Consumer Expenditure Survey (CES 2011-12).

2. Compilation Formula: The index is compiled at the subgroup, group, and all-items levels using the Modified Laspeyres Index formula:
   I = ( Sum ( W_i * (P_it / P_i0) ) ) / ( Sum ( W_i ) )
where W_i is the base period expenditure weight of item i, P_it is the current month price relative, and P_i0 is the base year average price.

3. Classification: Items are categorized using the COICOP (Classification of Individual Consumption According to Purpose) structure divided into 6 major groups: (1) Food & Beverages, (2) Pan, Tobacco & Intoxicants, (3) Clothing & Footwear, (4) Housing, (5) Fuel & Light, (6) Miscellaneous. Food and Beverages carries the highest weight of 45.86% in the All-India Combined basket.

4. Seasonal Adjustment: Economic time series are seasonally adjusted using the X-13ARIMA-SEATS protocol. The regARIMA pre-treatment models deterministic calendar effects, moving holidays, and outlier interventions prior to seasonal filter application.`,
  },
  {
    title: "National Data Governance (NDGFP) Standards",
    domain: "Digital Governance & Data Stewardship" as CompetencyDomain,
    fileName: "NDGFP_Data_Governance_Guidelines.docx",
    description: "Microdata anonymization, k-anonymity (k >= 5), SDMX 2.1 schemas, and GSBPM production phases.",
    content: `MINISTRY OF ELECTRONICS & IT / MoSPI
NATIONAL DATA GOVERNANCE FRAMEWORK POLICY (NDGFP) - DATA QUALITY AND STEWARDSHIP STANDARDS

Section 4. Data Stewardship and Quality Assurance:
4.1 Every participating Department shall designate a Data Protection and Stewardship Officer (DPSO) responsible for lifecycle dataset integrity.
4.2 Microdata Anonymization Standards: Prior to releasing official microdata into the India Data Management Office (IDMO) portal, departments must apply k-anonymity (k >= 5) and l-diversity algorithms to prevent re-identification of survey respondents or enterprise establishments.
4.3 Metadata Standards: All datasets must be cataloged using ISO 19115 and SDMX 2.1 schemas, containing complete Data Structure Definitions (DSD) and variable data dictionaries.
4.4 Process Auditing: Division workflows shall adhere to the Generic Statistical Business Process Model (GSBPM) spanning the 8 canonical production phases.`,
  },
];

interface DocumentUploaderProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

export function DocumentUploader({ onQuizGenerated }: DocumentUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "samples">("samples");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("Official_Document.txt");
  const [targetDomain, setTargetDomain] = useState<string>("auto");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | "all">("medium");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [forceOffline, setForceOffline] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(0);

  // Initialize with the first sample on mount
  React.useEffect(() => {
    if (SAMPLE_DOCS.length > 0) {
      setRawText(SAMPLE_DOCS[0].content);
      setFileName(SAMPLE_DOCS[0].fileName);
      setTargetDomain(SAMPLE_DOCS[0].domain);
    }
  }, []);

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    setRawText(SAMPLE_DOCS[index].content);
    setFileName(SAMPLE_DOCS[index].fileName);
    setTargetDomain(SAMPLE_DOCS[index].domain);
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
      setRawText(content || "");
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read file. Please ensure it is a valid text/document file.");
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!rawText || rawText.trim().length === 0) {
      setErrorMessage("Please upload a document, paste text, or select an official sample.");
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
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-300 text-sm font-medium mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Document-to-Quiz Generator (R3)</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Official Statistics Assessment Studio
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Transform NSS survey manuals, CPI price circulars, and data governance frameworks into
              pedagogically rigorous, Bloom-weighted assessments.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Cpu className="w-3.5 h-3.5 mr-1.5" />
              Gemini AI + Offline Fallback
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 mt-6 border-b border-blue-800/80">
          <button
            onClick={() => {
              setActiveTab("samples");
              if (selectedSampleIndex !== null) {
                handleSelectSample(selectedSampleIndex);
              } else {
                handleSelectSample(0);
              }
            }}
            className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "samples"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-blue-200 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Preloaded MoSPI Manuals</span>
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "paste"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-blue-200 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Raw Text / Excerpt</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "upload"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-blue-200 hover:text-white"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tab 1: Preloaded Official Samples */}
        {activeTab === "samples" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select Official MoSPI Document Fixture:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_DOCS.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(idx)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSampleIndex === idx
                      ? "border-blue-600 bg-blue-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {doc.domain.split(" ")[0]}
                    </span>
                    {selectedSampleIndex === idx && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">{doc.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw Text */}
        {activeTab === "paste" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Paste Document Text (NSS Manuals, CPI Circulars, Methodological Notes):
              </label>
              <span className="text-xs text-slate-400">
                {rawText.length} characters • ~{Math.ceil(rawText.length / 4)} tokens
              </span>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setSelectedSampleIndex(null);
              }}
              placeholder="Paste official statistical manual paragraphs, sampling instructions, price collection guidelines, or governance policies here..."
              className="w-full p-3.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800 bg-slate-50/50"
            />
          </div>
        )}

        {/* Tab 3: File Upload */}
        {activeTab === "upload" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload Survey Manual or Circular:
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-8 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="doc-upload"
                accept=".txt,.pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-12 h-12 text-blue-600 mb-2" />
                <span className="text-sm font-semibold text-slate-700">
                  Click to select a file or drag and drop here
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supported formats: PDF (.pdf), Word (.docx), Plain Text (.txt) up to 15MB
                </span>
              </label>
            </div>
            {fileName && (
              <div className="mt-3 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-blue-900 font-medium">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Loaded File: {fileName}</span>
                </div>
                <span className="text-xs text-blue-700 font-mono">
                  {rawText.length} characters
                </span>
              </div>
            )}
          </div>
        )}

        {/* Configuration Controls */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-semibold text-sm border-b border-slate-200 pb-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span>Generation Parameters & Alignment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Domain Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
                FRAC Competency Domain
              </label>
              <select
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">✨ Auto-Detect from Content</option>
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center">
                <BarChart2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Target Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Mixed (Multi-level Bloom)</option>
                <option value="easy">Easy (Remember / Understand)</option>
                <option value="medium">Medium (Apply / Analyze)</option>
                <option value="hard">Hard (Evaluate / Complex)</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Questions Count: <span className="font-bold text-blue-600">{numQuestions}</span>
              </label>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>3 Qs (Quick)</span>
                <span>8 Qs</span>
                <span>15 Qs (Comprehensive)</span>
              </div>
            </div>
          </div>

          {/* Offline Mode Switch */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="force-offline"
                checked={forceOffline}
                onChange={(e) => setForceOffline(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="force-offline" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-semibold">Force Deterministic Offline Fallback</span>{" "}
                <span className="text-slate-500">
                  (Air-gapped field training mode without Gemini API)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2.5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2.5 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Synthesizing Bloom Assessment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Assessment Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
