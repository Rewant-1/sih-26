import { describe, it, expect } from '../runner';
import * as fs from 'fs';
import * as path from 'path';

export interface DocumentChunk {
  chunkIndex: number;
  sectionTitle: string;
  content: string;
  tokenEstimate: number;
}

export function sanitizeDocumentText(rawText: string): string {
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/^.*?(Government of India|Ministry of Statistics|MoSPI|National Statistical Office).*?$/gim, '')
    .replace(/^.*?Page \d+ of \d+.*?$/gim, '')
    .replace(/^.*?—\s*\d+\s*—.*?$/gm, '')
    .replace(/(\b[a-zA-Z]+)-\n([a-zA-Z]+\b)/g, '$1$2')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function chunkDocument(
  sanitizedText: string,
  maxChunkTokens = 1200,
  overlapTokens = 200
): DocumentChunk[] {
  const sectionSplitRegex = /(?=\n(?:Chapter\s+\d+|Section\s+\d+|Block\s+[A-Z0-9]+|\d+\.\d+\s+[A-Z]))/i;
  const sections = sanitizedText.split(sectionSplitRegex).filter(s => s.trim().length > 10);

  const chunks: DocumentChunk[] = [];
  let currentChunkText = '';
  let currentSectionTitle = 'General Overview';
  let chunkCounter = 0;

  for (const sec of sections) {
    const lines = sec.trim().split('\n');
    const firstLine = lines[0].slice(0, 80).trim();
    if (/^(Chapter|Section|Block|\d+\.\d+)/i.test(firstLine)) {
      currentSectionTitle = firstLine;
    }

    const estimatedTokens = Math.ceil(sec.length / 4);
    if (currentChunkText.length > 0 && (Math.ceil(currentChunkText.length / 4) + estimatedTokens > maxChunkTokens)) {
      chunks.push({
        chunkIndex: chunkCounter++,
        sectionTitle: currentSectionTitle,
        content: currentChunkText.trim(),
        tokenEstimate: Math.ceil(currentChunkText.length / 4)
      });
      const words = currentChunkText.split(' ');
      const overlapWords = words.slice(Math.max(0, words.length - overlapTokens)).join(' ');
      currentChunkText = overlapWords + '\n\n' + sec;
    } else {
      currentChunkText += (currentChunkText ? '\n\n' : '') + sec;
    }
  }

  if (currentChunkText.trim().length > 0) {
    chunks.push({
      chunkIndex: chunkCounter++,
      sectionTitle: currentSectionTitle,
      content: currentChunkText.trim(),
      tokenEstimate: Math.ceil(currentChunkText.length / 4)
    });
  }

  return chunks;
}

export function extractDocumentMetadata(text: string) {
  const roundMatch = text.match(/(\d+(?:st|nd|rd|th)\s+Round)/i);
  const baseYearMatch = text.match(/Base\s+(?:Year\s+)?(\d{4}(?:-\d{2})?|\d{4}=\d+)/i);
  const scheduleMatch = text.match(/Schedule\s+(\d+\.\d+|\w+)/i);
  
  let detectedDomain = 'Statistical Competencies';
  const lower = text.toLowerCase();
  if (lower.includes('cpi') || lower.includes('laspeyres') || lower.includes('price index') || lower.includes('fsu') || lower.includes('nss')) {
    detectedDomain = 'Statistical Competencies';
  } else if (lower.includes('sdmx') || lower.includes('anonymization') || lower.includes('k-anonymity') || lower.includes('dqaf') || lower.includes('ndgfp')) {
    detectedDomain = 'Digital Governance & Data Stewardship';
  } else if (lower.includes('r package') || lower.includes('python') || lower.includes('capi') || lower.includes('sql')) {
    detectedDomain = 'Technical Competencies';
  }

  return {
    round: roundMatch ? roundMatch[1] : undefined,
    baseYear: baseYearMatch ? baseYearMatch[1] : undefined,
    schedule: scheduleMatch ? scheduleMatch[0] : undefined,
    detectedDomain
  };
}

describe('Document Parser Engine (Unit)', () => {
  it('unwraps hyphenated line breaks in official texts (e.g. sam-\\npling -> sampling)', () => {
    const raw = 'The multi-stage sam-\npling design was adopted for the socio-economic survey metho-\ndology.';
    const cleaned = sanitizeDocumentText(raw);
    expect(cleaned).toContain('sampling');
    expect(cleaned).toContain('methodology');
    expect(cleaned).not.toContain('sam-');
  });

  it('strips redundant government headers, page numbers, and em-dash page markers', () => {
    const raw = `
Government of India
Ministry of Statistics and Programme Implementation
Page 14 of 120
— 14 —
1.1 Real Content Starts Here.
    `;
    const cleaned = sanitizeDocumentText(raw);
    expect(cleaned).not.toContain('Page 14 of 120');
    expect(cleaned).not.toContain('— 14 —');
    expect(cleaned).toContain('1.1 Real Content Starts Here.');
  });

  it('parses and extracts metadata from official NSS survey manual fixture', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-nss-manual.txt');
    const content = fs.readFileSync(fixturePath, 'utf8');
    
    const meta = extractDocumentMetadata(content);
    expect(meta.round?.toLowerCase()).toBe('79th round');
    expect(meta.schedule).toContain('Schedule 10.3');
    expect(meta.detectedDomain).toBe('Statistical Competencies');

    const chunks = chunkDocument(sanitizeDocumentText(content), 300, 50);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks[0].tokenEstimate).toBeGreaterThan(0);
  });

  it('parses and extracts metadata from CPI Revision circular fixture', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-cpi-circular.txt');
    const content = fs.readFileSync(fixturePath, 'utf8');
    
    const meta = extractDocumentMetadata(content);
    expect(meta.baseYear).toContain('2012');
    expect(meta.detectedDomain).toBe('Statistical Competencies');

    const sanitized = sanitizeDocumentText(content);
    expect(sanitized).toContain('Modified Laspeyres');
    expect(sanitized).toContain('COICOP');
  });

  it('parses and extracts metadata from NDGFP Data Governance guide fixture', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-ndgfp-guide.txt');
    const content = fs.readFileSync(fixturePath, 'utf8');
    
    const meta = extractDocumentMetadata(content);
    expect(meta.detectedDomain).toBe('Digital Governance & Data Stewardship');

    const sanitized = sanitizeDocumentText(content);
    expect(sanitized).toContain('SDMX 2.1');
    expect(sanitized).toContain('k-anonymity (k >= 5)');
    expect(sanitized).toContain('GSBPM');
  });

  it('handles empty strings and whitespace-only documents gracefully', () => {
    const emptyClean = sanitizeDocumentText('    \n\n\t   ');
    expect(emptyClean).toBe('');

    const emptyChunks = chunkDocument('', 500, 100);
    expect(emptyChunks.length).toBe(0);
  });
}, 'Unit', 'DOC_PARSER');
