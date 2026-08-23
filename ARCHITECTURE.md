# System Architecture & Technical Specifications
**MoSPI AI-Enabled Skill Intelligence & Learning Platform (SIH 26101)**

---

## 1. High-Level Architecture

The platform is designed as an all-in-one, zero-dependency fullstack Next.js 14 App Router application.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Client / Presentation Layer                       │
│  (Next.js 14 App Router + React 18 + Tailwind CSS + Lucide + Recharts)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API & Controller Layer                           │
│  • /api/assessment       • /api/recommendations     • /api/quiz/generate    │
│  • /api/quiz/submit      • /api/courses             • /api/admin/analytics  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│ FRAC Gap Engine │           │ Course Matcher  │           │ AI Quiz Engine  │
│ (Deterministic  │           │ (Sunbird-CB &   │           │ (Gemini API &   │
│  Delta Matrix)  │           │  NSSTA Adapter) │           │ Offline Engine) │
└────────┬────────┘           └────────┬────────┘           └────────┬────────┘
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Zero-Config JSON Repository Service                      │
│      (Seed Fixtures: Taxonomies, Benchmarks, Courses, Quizzes, Profiles)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Data Models

### A. FRAC Competency Taxonomy (`src/lib/types/frac.ts`)
```typescript
export type CompetencyDomain = 'statistical' | 'technical' | 'digital_governance' | 'behavioural';

export interface CompetencyRubric {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  indicators: string[];
}

export interface Competency {
  id: string;
  name: string;
  domain: CompetencyDomain;
  description: string;
  rubrics: Record<number, CompetencyRubric>;
  cadreRelevance: {
    issAssistantDirector: number; // Benchmark level (1-5)
    seniorStatisticalOfficer: number;
    juniorStatisticalOfficer: number;
  };
}
```

### B. Sunbird-CB Course Schema (`src/lib/types/sunbird.ts`)
```typescript
export interface SunbirdCompetencyTag {
  id: string;
  name: string;
  domain: CompetencyDomain;
  level: number;
}

export interface SunbirdCBCourse {
  identifier: string; // "do_1138..." standard Sunbird ID
  name: string;
  description: string;
  organisation: string; // "Karmayogi Bharat" | "NSSTA - MoSPI" | "NIC"
  source: 'igot_karmayogi' | 'nssta_tpac';
  courseCategory: string;
  duration: string;
  competencies: SunbirdCompetencyTag[];
  learningOutcomes: string[];
  rating: number;
  enrolledCount: number;
  targetCadres?: string[];
}
```

### C. AI Quiz Schema (`src/lib/types/quiz.ts`)
```typescript
export interface GeneratedQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0..3
  bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  competencyId: string;
  explanation: string;
  referencePassage: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  sourceDocumentName: string;
  sourceDocumentType: 'PDF' | 'DOCX' | 'TEXT';
  generatedBy: 'GEMINI_AI' | 'OFFLINE_DETERMINISTIC_FALLBACK';
  domain: CompetencyDomain;
  competencyId: string;
  questions: GeneratedQuestion[];
  createdAt: string;
}
```

---

## 3. Algorithmic Formulations

### A. Deterministic Skill Gap Computation
Given an assessed rating $A_i$ and cadre benchmark $B_i$ for competency $i \in \{1 \dots 29\}$:

$$\text{Gap}_i = \max(0, B_i - A_i)$$

$$\text{PriorityScore}_i = \text{Gap}_i \times W_{\text{domain}} \times C_{\text{cadre}}$$

$$\text{Severity}_i = \begin{cases} \text{CRITICAL}, & \text{if } \text{Gap}_i \ge 2 \\ \text{MODERATE}, & \text{if } \text{Gap}_i = 1 \\ \text{PROFICIENT}, & \text{if } \text{Gap}_i = 0 \end{cases}$$

### B. Bloom-Weighted Assessment Scoring
When a learner completes an AI-generated quiz:

$$\text{RawScore} = \sum_{j=1}^{N} \mathbb{I}(\text{Selected}_j = \text{Correct}_j) \times W_{\text{Bloom}}(j)$$

$$\text{CompetencyRating} = 1.0 + 4.0 \times \left( \frac{\text{RawScore}}{\text{MaxScore}} \right)$$

This continuously recalibrates the official's assessed level based on verifiable performance on MoSPI training materials.

---

## 4. Zero-Config Repository Interface

Located in `src/lib/storage/repository.ts`, the data access layer provides type-safe, asynchronous methods that mirror a production database client:

* `getCompetencies(domain?)`: Returns official 29 competencies.
* `getCadreBenchmarks(cadreId)`: Returns baseline requirements for ISS AD, SSO, or JSO.
* `getCourses(filters?)`: Searches Sunbird/NSSTA catalogs with full-text and tag filters.
* `saveAssessmentRecord(record)`: Persists user assessments to memory/file store.
* `getDivisionAggregateData()`: Powers admin organizational heatmaps across FOD, ESD, NAD, DIID, and SDRD.
