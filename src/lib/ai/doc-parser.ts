import type { CompetencyDomain, DocumentType } from "../types";

export interface DocumentChunk {
  chunkIndex: number;
  sectionTitle: string;
  content: string;
  tokenEstimate: number;
}

export interface ExtractedDocumentMetadata {
  round?: string;
  baseYear?: string;
  schedule?: string;
  detectedDomain: CompetencyDomain;
  documentType: DocumentType;
  estimatedTokens: number;
  wordCount: number;
}

export interface ParsedDocument {
  fileName: string;
  documentType: DocumentType;
  rawText: string;
  sanitizedText: string;
  chunks: DocumentChunk[];
  metadata: ExtractedDocumentMetadata;
}

/**
 * Sanitizes official MoSPI / Government documents:
 * - Normalizes line endings
 * - Strips repetitive government gazette headers and footers
 * - Strips page numbers (e.g. "Page 14 of 120", "— 14 —")
 * - Unwraps hyphenated line breaks in running text (e.g. "sam-\npling" -> "sampling")
 * - Collapses redundant whitespace
 */
export function sanitizeDocumentText(rawText: string): string {
  if (!rawText || typeof rawText !== "string") {
    return "";
  }

  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove repetitive government headers and footers
    .replace(/^.*?(Government of India|Ministry of Statistics and Programme Implementation|Ministry of Statistics|MoSPI|National Statistical Office|National Sample Survey Office|Central Statistics Office).*?$/gim, "")
    .replace(/^.*?Page\s+\d+\s+of\s+\d+.*?$/gim, "")
    .replace(/^.*?[—–-]\s*\d+\s*[—–-].*?$/gm, "")
    .replace(/^.*?Confidential\s+-\s+For\s+Official\s+Use\s+Only.*?$/gim, "")
    // Rejoin hyphenated line breaks in running text (e.g. "sam-\npling" -> "sampling")
    .replace(/(\b[a-zA-Z]+)-\n([a-zA-Z]+\b)/g, "$1$2")
    // Clean multiple redundant newlines and whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Splits sanitized document into semantic chunks anchored on MoSPI hierarchical markers.
 */
export function chunkDocument(
  sanitizedText: string,
  maxChunkTokens = 1200,
  overlapTokens = 200
): DocumentChunk[] {
  if (!sanitizedText || sanitizedText.trim().length === 0) {
    return [];
  }

  // Regex splitting on official MoSPI hierarchical markers:
  // e.g. "Chapter 1", "Section 2.1", "Block 4", "1.1 Introduction", "Item 5:"
  const sectionSplitRegex = /(?=\n(?:Chapter\s+\d+|Section\s+\d+|Block\s+[A-Z0-9]+|\d+\.\d+\s+[A-Z]))/i;
  const sections = sanitizedText.split(sectionSplitRegex).filter((s) => s.trim().length > 30);

  // If no specific section headers matched, split into paragraphs
  const rawSections = sections.length > 0 ? sections : sanitizedText.split(/\n\n+/).filter((s) => s.trim().length > 0);

  const chunks: DocumentChunk[] = [];
  let currentChunkText = "";
  let currentSectionTitle = "General Overview";
  let chunkCounter = 0;

  for (const sec of rawSections) {
    const lines = sec.trim().split("\n");
    const firstLine = lines[0].slice(0, 80).trim();
    if (/^(Chapter|Section|Block|\d+\.\d+)/i.test(firstLine)) {
      currentSectionTitle = firstLine;
    }

    const estimatedTokens = Math.ceil(sec.length / 4);
    if (
      currentChunkText.length > 0 &&
      Math.ceil(currentChunkText.length / 4) + estimatedTokens > maxChunkTokens
    ) {
      chunks.push({
        chunkIndex: chunkCounter++,
        sectionTitle: currentSectionTitle,
        content: currentChunkText.trim(),
        tokenEstimate: Math.ceil(currentChunkText.length / 4),
      });

      // Retain sliding window overlap
      const words = currentChunkText.split(" ");
      const overlapWords = words
        .slice(Math.max(0, words.length - overlapTokens))
        .join(" ");
      currentChunkText = overlapWords + "\n\n" + sec;
    } else {
      currentChunkText += (currentChunkText ? "\n\n" : "") + sec;
    }
  }

  if (currentChunkText.trim().length > 0) {
    chunks.push({
      chunkIndex: chunkCounter++,
      sectionTitle: currentSectionTitle,
      content: currentChunkText.trim(),
      tokenEstimate: Math.ceil(currentChunkText.length / 4),
    });
  }

  return chunks;
}

/**
 * Extracts metadata and detects the primary MoSPI FRAC competency domain.
 */
export function extractDocumentMetadata(
  text: string,
  fileName?: string
): ExtractedDocumentMetadata {
  const roundMatch = text.match(/(\d+(?:st|nd|rd|th)\s+Round)/i);
  const baseYearMatch = text.match(/Base\s+(?:Year\s+)?(\d{4}(?:-\d{2})?|\d{4}=\d+)/i);
  const scheduleMatch = text.match(/Schedule\s+(\d+\.\d+|\w+)/i);

  const lower = (text + " " + (fileName || "")).toLowerCase();

  let detectedDomain: CompetencyDomain = "Statistical Competencies";

  // Keyword score weighting for robust domain classification
  let statScore = 0;
  let techScore = 0;
  let govScore = 0;
  let behScore = 0;

  // Statistical keywords
  if (/cpi|consumer price index|laspeyres|paasche|price relative|inflation/i.test(lower)) statScore += 4;
  if (/nss|sampling|fsu|ssu|multiplier|stratum|psu|sample survey/i.test(lower)) statScore += 4;
  if (/gva|gdp|national accounts|sna|factor cost|basic prices|sut/i.test(lower)) statScore += 4;
  if (/asi|annual survey of industries|factories act|manufacturing|nic-2008/i.test(lower)) statScore += 4;
  if (/plfs|labour force|wpr|lfpr|upss|cws|unemployment/i.test(lower)) statScore += 3;
  if (/time series|arima|x-13arima|seasonality|forecasting/i.test(lower)) statScore += 3;
  if (/seea|envistats|natural capital|ecosystem/i.test(lower)) statScore += 3;

  // Technical keywords
  if (/r package|tidyverse|dplyr|srvyr|rsdmx|ggplot/i.test(lower)) techScore += 4;
  if (/python|pandas|polars|numpy|statsmodels|fastapi/i.test(lower)) techScore += 4;
  if (/sql|postgresql|postgis|database|query|window function/i.test(lower)) techScore += 4;
  if (/capi|cspro|blaise|tablet|skip logic|paradata/i.test(lower)) techScore += 4;
  if (/validation|imputation|hot-deck|fellegi-holt|scrutiny/i.test(lower)) techScore += 4;
  if (/gis|qgis|shapefile|geospatial|choropleth|ufs digitization/i.test(lower)) techScore += 4;

  // Digital Governance keywords
  if (/sdmx|data structure definition|dsd|metadata registry|codelist/i.test(lower)) govScore += 4;
  if (/anonymization|k-anonymity|l-diversity|sdcmicro|disclosure control|microdata/i.test(lower)) govScore += 4;
  if (/dqaf|data quality|nqaf|imf dqaf|quality assurance/i.test(lower)) govScore += 4;
  if (/ndgfp|national data governance|open data|data\.gov\.in/i.test(lower)) govScore += 4;
  if (/collection of statistics act|un-fpos|confidentiality|ethics/i.test(lower)) govScore += 4;
  if (/gsbpm|statistical audit|process model|iso/i.test(lower)) govScore += 3;

  // Behavioural keywords
  if (/supervision|field staff|leadership|mentorship|stakeholder/i.test(lower)) behScore += 3;
  if (/project monitoring|ipmd|storytelling|dispute resolution/i.test(lower)) behScore += 3;

  const maxScore = Math.max(statScore, techScore, govScore, behScore);
  if (maxScore > 0) {
    if (maxScore === statScore) detectedDomain = "Statistical Competencies";
    else if (maxScore === techScore) detectedDomain = "Technical Competencies";
    else if (maxScore === govScore) detectedDomain = "Digital Governance & Data Stewardship";
    else detectedDomain = "Behavioural & Managerial Competencies";
  }

  // Determine doc type from filename extension if available
  let documentType: DocumentType = "TEXT_PASTE";
  if (fileName) {
    const ext = fileName.toLowerCase().split(".").pop();
    if (ext === "pdf") documentType = "PDF";
    else if (ext === "docx" || ext === "doc") documentType = "DOCX";
  }

  const words = text.trim().split(/\s+/).filter(Boolean);

  return {
    round: roundMatch ? roundMatch[1] : undefined,
    baseYear: baseYearMatch ? baseYearMatch[1] : undefined,
    schedule: scheduleMatch ? scheduleMatch[0] : undefined,
    detectedDomain,
    documentType,
    estimatedTokens: Math.ceil(text.length / 4),
    wordCount: words.length,
  };
}

/**
 * End-to-end parser pipeline for any uploaded document text or paste.
 */
export function parseDocument(
  rawText: string,
  fileName = "document.txt"
): ParsedDocument {
  const sanitized = sanitizeDocumentText(rawText);
  const metadata = extractDocumentMetadata(rawText, fileName);
  const chunks = chunkDocument(sanitized);

  return {
    fileName,
    documentType: metadata.documentType,
    rawText,
    sanitizedText: sanitized,
    chunks,
    metadata,
  };
}
