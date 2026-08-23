import type {
  CompetencyDomain,
  Quiz,
  QuizGenerationOptions,
  QuizQuestion,
} from "../types";
import { extractDocumentMetadata, sanitizeDocumentText } from "./doc-parser";
import { generateOfflineQuiz } from "./offline-fallback";

export interface GeminiQuestionResponse {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  bloomLevel: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  difficulty: "easy" | "medium" | "hard";
  competencyId: string;
  competencyName: string;
  explanation: string;
  referencePassage: string;
}

export interface GeminiQuizResponse {
  quizTitle: string;
  sourceSummary: string;
  detectedDomain: CompetencyDomain;
  questions: GeminiQuestionResponse[];
}

const SYSTEM_PROMPT = `You are an expert Senior Statistical Advisor and Capacity Building Specialist at the Ministry of Statistics and Programme Implementation (MoSPI), Government of India, and the National Statistical Systems Training Academy (NSSTA).

Your mission is to generate rigorous, technically accurate, multiple-choice assessment questions from the provided official government statistical document excerpt.

### Domain Context
The document relates to Indian Official Statistics:
- National Sample Surveys (NSS) design, FSUs/SSUs/USUs, sampling multipliers, listing schedules, hamlet-group formation.
- Consumer Price Index (CPI), Wholesale Price Index (WPI), Index of Industrial Production (IIP), Modified Laspeyres formula, weighting diagrams.
- National Accounts Statistics (NAS), Gross Value Added (GVA) at basic prices vs factor cost, GDP deflators, SNA 2008 standards.
- Annual Survey of Industries (ASI), Factories Act definitions, capital invested, working capital, gross output.
- Digital Governance, National Data Governance Framework (NDGFP), Microdata Anonymization, k-anonymity, SDMX standards, DQAF.
- Behavioural & Managerial Competencies: Field supervision, data storytelling, ethical independence (UN-FPOS, Collection of Statistics Act 2008).

### Question Formulation Rules
1. Factuality & Grounding: Every question must be 100% derivable from the provided text.
2. Plausible Distractors: The 3 incorrect options must represent authentic statistical misconceptions or adjacent parameters. Never use "All of the above" or "None of the above".
3. Bloom's Taxonomy Distribution:
   - Remember (definitions, survey rounds, threshold numbers)
   - Understand / Apply (interpreting scenarios, calculating sample multipliers, choosing schedule blocks)
   - Analyze / Evaluate (identifying methodological errors, comparing definitions, assessing data consistency)
4. Pedagogical Explanation: Explain why the correct option is true and why the distractors are false.
5. Exact Reference Citation: The referencePassage MUST contain a verbatim quote (1-3 sentences) from the text proving the answer.

### Output JSON Schema:
{
  "quizTitle": "Title of the Quiz",
  "sourceSummary": "1-2 sentence summary of the document",
  "detectedDomain": "Statistical Competencies" | "Technical Competencies" | "Digital Governance & Data Stewardship" | "Behavioural & Managerial Competencies",
  "questions": [
    {
      "id": "q-1",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "bloomLevel": "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create",
      "difficulty": "easy" | "medium" | "hard",
      "competencyId": "STAT_SMPL_01",
      "competencyName": "Sampling Design & Survey Methodology",
      "explanation": "Detailed pedagogical rationale",
      "referencePassage": "Verbatim quote from source"
    }
  ]
}
Output ONLY valid JSON matching this structure without Markdown backticks or enclosing text.`;

/**
 * Calls Google Gemini API using native fetch with structured JSON schema.
 * If API key is missing or generation fails, seamlessly falls back to the deterministic offline generator.
 */
export async function generateQuizWithGemini(
  content: string,
  fileName = "document.txt",
  options?: QuizGenerationOptions
): Promise<Quiz> {
  const sanitized = sanitizeDocumentText(content);
  const metadata = extractDocumentMetadata(content, fileName);
  const numQuestions = Math.max(3, Math.min(20, options?.numQuestions || 5));
  const apiKey = process.env.GEMINI_API_KEY;

  if (options?.forceOffline || !apiKey || apiKey.trim() === "") {
    console.log("⚡ Generating quiz via High-Fidelity Offline Fallback Engine (no API key or forceOffline enabled)");
    return generateOfflineQuiz(sanitized, fileName, options);
  }

  try {
    const prompt = `Please generate exactly ${numQuestions} multiple-choice assessment questions from this official MoSPI document excerpt:

Document Name: ${fileName}
Target Domain Hint: ${options?.targetDomain || metadata.detectedDomain}

Document Content:
${sanitized.slice(0, 15000)}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API HTTP Error ${response.status}: ${errText}. Falling back to Offline Engine.`);
      return generateOfflineQuiz(sanitized, fileName, options);
    }

    const data = await response.json();
    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJsonText) {
      console.warn("Empty response from Gemini API. Falling back to Offline Engine.");
      return generateOfflineQuiz(sanitized, fileName, options);
    }

    // Clean JSON text if wrapped in markdown codeblocks
    const cleanedJsonText = rawJsonText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/g, "")
      .trim();

    const parsed: GeminiQuizResponse = JSON.parse(cleanedJsonText);

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      console.warn("Invalid question schema from Gemini. Falling back to Offline Engine.");
      return generateOfflineQuiz(sanitized, fileName, options);
    }

    const validatedQuestions: QuizQuestion[] = parsed.questions.map((q, idx) => ({
      id: q.id || `gemini-q-${idx + 1}`,
      question: q.question,
      options: q.options && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0,
      bloomLevel: q.bloomLevel || "Understand",
      difficulty: q.difficulty || "medium",
      competencyId: q.competencyId || "STAT_SMPL_01",
      competencyName: q.competencyName || "Official Statistics Knowledge",
      explanation: q.explanation || "Correct as derived from official document text.",
      referencePassage: q.referencePassage || sanitized.slice(0, 200),
    }));

    return {
      id: `quiz-gemini-${Date.now()}`,
      title: parsed.quizTitle || `${fileName} Competency Quiz`,
      description: parsed.sourceSummary || `AI-generated assessment derived from ${fileName}`,
      sourceDocumentName: fileName,
      sourceDocumentType: metadata.documentType,
      detectedDomain: parsed.detectedDomain || metadata.detectedDomain,
      generatorSource: "GEMINI_AI",
      createdAt: new Date().toISOString(),
      totalQuestions: validatedQuestions.length,
      timeLimitMinutes: Math.max(5, Math.ceil(validatedQuestions.length * 1.5)),
      questions: validatedQuestions,
    };
  } catch (err) {
    console.error("Gemini API invocation error, invoking offline fallback:", err);
    return generateOfflineQuiz(sanitized, fileName, options);
  }
}
