# Project: MoSPI Skill Intelligence & Learning Platform (SIH 26101)

## Architecture
The platform is built as a zero-config, production-grade Next.js 14/15 App Router application with Tailwind CSS, Lucide React, and Recharts. It implements an in-app file-backed JSON/mock storage service requiring zero external database or local SQLite setup, runnable out-of-the-box via standard `npm install && npm run build / npm run dev / npm test`.

### High-Level Component & Data Flow Diagram
```
                     ┌───────────────────────────────────────────────────────────┐
                     │            Next.js App Router (UI & Server APIs)           │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
         ┌───────────────────┬─────────────────────┼─────────────────────┬───────────────────┐
         │                   │                     │                     │                   │
         ▼                   ▼                     ▼                     ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Learner & Admin │ │ FRAC Assessment │ │  iGOT & NSSTA   │ │ AI Doc-to-Quiz  │ │ Zero-Config JSON│
│   Dashboards    │ │  & Skill Gap    │ │ Recommendation  │ │  & Assessment   │ │ Storage Service │
│ (Radar/Heatmap) │ │     Engine      │ │     Adapter     │ │ (Gemini/Fallback│ │  & Repository   │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                     │                 │                   │
         └───────────────────┴─────────────────────┼─────────────────┴───────────────────┘
                                                   ▼
                                ┌─────────────────────────────────────┐
                                │     In-Memory / File-Backed Data    │
                                │   (Competencies, Cadres, Courses,   │
                                │     Quizzes, Assessment Records)    │
                                └─────────────────────────────────────┘
```

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | FRAC 4-Domain Taxonomy | 29 official competencies across Statistical, Technical, Digital Governance, Behavioural domains | M2 | Survey / R1 |
| 2 | Level 1-5 Proficiency Rubrics | Standardized behavioral descriptors for Levels 1-5 across all competencies | M2 | Survey / R1 |
| 3 | Cadre Benchmarks | Benchmark profile configurations for ISS Assistant Director, SSO, and JSO | M2 | Survey / R1 |
| 4 | Deterministic Skill Gap Engine | Transparent calculation of skill delta, severity categories, and weighted priority scores | M2 | Survey / R1 |
| 5 | Self-Assessment Interactive Flow | User proficiency assessment wizard capturing ratings across domains and calculating gaps | M2 | Survey / R1 |
| 6 | Sunbird-CB Course Schema Adapter | Authentic iGOT metadata schema (`identifier`, `competencies`, `learningOutcomes`, `source`) | M3 | Survey / R2 |
| 7 | NSSTA TPAC Course Catalog | Training Programme Annual Calendar catalog with cadre targeting and accreditation | M3 | Survey / R2 |
| 8 | Semantic Recommendation Engine | Multi-factor course matching algorithm (gap priority, level alignment, cadre suitability) | M3 | Survey / R2 |
| 9 | Dual-Source Catalog Badging | Visual badge filtering and source attribution (`iGOT Karmayogi` vs `NSSTA TPAC`) | M3 | Survey / R2 |
| 10 | Document Parser (PDF/DOCX/Text) | Text extraction and semantic chunking from survey manuals and circulars | M4 | Survey / R3 |
| 11 | Gemini Structured Quiz Generator | Gemini API integration with strict JSON output for question generation | M4 | Survey / R3 |
| 12 | Deterministic Offline Quiz Fallback | Rule-based question synthesis and seed bank for offline/air-gapped resilience | M4 | Survey / R3 |
| 13 | Interactive Quiz Runner UI | Auto-graded quiz player with timer, flag for review, instant scoring, and explanations | M4 | Survey / R3 |
| 14 | Bloom-Weighted Assessment Scoring | Continuous 1.0-5.0 score calculation feeding directly into user competency profile | M4 | Survey / R3 |
| 15 | Learner 4-Domain Radar Chart | Recharts Polar chart comparing assessed proficiency vs cadre benchmark | M5 | Survey / R4 |
| 16 | Prioritized Skill Gap Breakdown | Visual gap cards highlighting critical, moderate, and proficient competencies | M5 | Survey / R4 |
| 17 | Personalized Learning Roadmap | Dynamic learning plan linking gaps to recommended courses with enrollment actions | M5 | Survey / R4 |
| 18 | Admin Competency Heatmap Matrix | Aggregate visualization across MoSPI divisions (FOD, ESD, NAD, DIID, SDRD) | M5 | Survey / R4 |
| 19 | Cadre Distribution Analytics | Cadre-wise proficiency breakdown across departments and competency domains | M5 | Survey / R4 |
| 20 | Automated ACBP Training Planner | Annual Capacity Building Plan generator aggregating organizational training needs | M5 | Survey / R4 |
| 21 | Zero-Config Data Layer & Fixtures | In-app file-backed JSON/mock storage service with seeded profiles and catalogs | M1 | Survey / R5 |
| 22 | Next.js App Router & MoSPI Theme | Clean layout, tricolor accents, high accessibility, responsive design | M1 | Survey / R5 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Next.js Foundation & Zero-Config Storage Layer | Next.js 14/15 App Router setup, Tailwind CSS, TypeScript types, File-backed JSON repository service with seed fixtures | none | DONE |
| M2 | MoSPI FRAC Competency Taxonomy & Skill Gap Engine | 4-domain 29-competency models, Level 1-5 rubrics, cadre benchmarks (ISS AD, SSO, JSO), deterministic gap engine, assessment wizard | M1 | DONE |
| M3 | iGOT Karmayogi & NSSTA TPAC Recommendation Adapter | Sunbird-CB schema adapter, dual course catalogs (iGOT + NSSTA TPAC), semantic recommendation algorithm, catalog browser | M1, M2 | DONE |
| M4 | AI Document-to-Quiz Generator & Assessment UI | PDF/DOCX/text parser, Gemini structured JSON generator, offline fallback generator, interactive quiz runner, Bloom scoring | M1, M2 | DONE |
| M5 | Role-Based Dashboards & Visualizations | Learner dashboard (radar chart, gap cards, learning path), Admin dashboard (division heatmap, cadre metrics, ACBP planner) | M1, M2, M3, M4 | DONE |
| M_FINAL | Full E2E Test Suite Pass & Adversarial Hardening | Pass 100% of E2E test suite (Tiers 1-4), Tier 5 adversarial testing, Forensic Integrity Audit, final packaging | M1-M5 | DONE |

---

## Interface Contracts

### 1. Zero-Config Data Service (`src/lib/storage/repository.ts`)
```typescript
export interface DataRepository {
  getCompetencies(): Promise<Competency[]>;
  getCompetenciesByDomain(domain: CompetencyDomain): Promise<Competency[]>;
  getCadreBenchmarks(cadre: CadreId): Promise<CadreBenchmark>;
  getAllCadreBenchmarks(): Promise<Record<CadreId, CadreBenchmark>>;
  
  getCourses(filters?: CourseFilter): Promise<SunbirdCBCourse[]>;
  getCourseById(id: string): Promise<SunbirdCBCourse | null>;
  
  getQuizzes(): Promise<Quiz[]>;
  getQuizById(id: string): Promise<Quiz | null>;
  saveQuiz(quiz: Quiz): Promise<Quiz>;
  
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<UserProfile>;
  saveAssessmentRecord(record: AssessmentRecord): Promise<AssessmentRecord>;
  getAssessmentRecords(userId: string): Promise<AssessmentRecord[]>;
  
  getDivisionAggregateData(): Promise<DivisionAggregateMetric[]>;
  getACBPPlan(year: string): Promise<ACBPPlan>;
}
```

### 2. FRAC Competency & Gap Calculation Engine (`src/lib/engine/gap-engine.ts`)
```typescript
export interface SkillGap {
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  assessedLevel: number;
  benchmarkLevel: number;
  gap: number; // max(0, benchmarkLevel - assessedLevel)
  priorityScore: number; // gap * domainWeight * cadreCriticality
  severity: 'CRITICAL' | 'MODERATE' | 'PROFICIENT';
  suggestedAction: string;
}

export interface AssessmentResult {
  userId: string;
  cadre: CadreId;
  assessmentDate: string;
  domainScores: Record<CompetencyDomain, number>;
  overallCompetencyIndex: number; // 0-100 scale
  gaps: SkillGap[];
  criticalGapsCount: number;
  moderateGapsCount: number;
}

export function calculateSkillGaps(
  assessedRatings: Record<string, number>,
  cadre: CadreId,
  benchmarks: CadreBenchmark
): AssessmentResult;
```

### 3. Recommendation Adapter (`src/lib/engine/recommendation-engine.ts`)
```typescript
export interface CourseRecommendation {
  course: SunbirdCBCourse;
  targetCompetencyId: string;
  targetCompetencyName: string;
  relevanceScore: number; // 0-100
  cadreMatch: boolean;
  estimatedEffortHours: number;
  sourceBadge: 'iGOT Karmayogi' | 'NSSTA TPAC';
  recommendationReason: string;
}

export function recommendCoursesForGaps(
  gaps: SkillGap[],
  courses: SunbirdCBCourse[],
  userCadre: CadreId
): CourseRecommendation[];
```

### 4. AI Document-to-Quiz Engine (`src/lib/ai/quiz-generator.ts`)
```typescript
export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-3
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

export async function generateQuizFromDocument(
  content: string,
  docName: string,
  options?: QuizGenerationOptions
): Promise<GeneratedQuiz>;
```

---

## Code Layout
```
c:/sih-2026/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── .env.example
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── assessment/
│   │   │   └── page.tsx
│   │   ├── catalog/
│   │   │   └── page.tsx
│   │   ├── quiz-studio/
│   │   │   └── page.tsx
│   │   ├── quiz-runner/[id]/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── learner/
│   │   │   │   └── page.tsx
│   │   │   └── admin/
│   │   │       └── page.tsx
│   │   ├── acbp/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── assessment/route.ts
│   │       ├── recommendations/route.ts
│   │       ├── quiz/generate/route.ts
│   │       ├── quiz/submit/route.ts
│   │       ├── courses/route.ts
│   │       └── admin/analytics/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── assessment/
│   │   │   ├── SelfAssessmentWizard.tsx
│   │   │   ├── DomainAccordion.tsx
│   │   │   └── RubricModal.tsx
│   │   ├── catalog/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   └── CatalogFilters.tsx
│   │   ├── quiz/
│   │   │   ├── DocumentUploader.tsx
│   │   │   ├── QuizRunner.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── QuizReviewModal.tsx
│   │   ├── dashboard/
│   │   │   ├── CompetencyRadarChart.tsx
│   │   │   ├── SkillGapCard.tsx
│   │   │   ├── LearningRoadmap.tsx
│   │   │   ├── DivisionHeatmap.tsx
│   │   │   ├── CadreDistributionChart.tsx
│   │   │   └── ACBPRecommendationTable.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Progress.tsx
│   │       └── Tabs.tsx
│   ├── lib/
│   │   ├── types/
│   │   │   ├── frac.ts
│   │   │   ├── sunbird.ts
│   │   │   ├── quiz.ts
│   │   │   ├── dashboard.ts
│   │   │   └── user.ts
│   │   ├── data/
│   │   │   ├── frac-taxonomy.json
│   │   │   ├── cadre-benchmarks.json
│   │   │   ├── sunbird-courses.json
│   │   │   ├── nssta-courses.json
│   │   │   ├── seed-quizzes.json
│   │   │   ├── seed-users.json
│   │   │   └── department-analytics.json
│   │   ├── storage/
│   │   │   ├── repository.ts
│   │   │   └── json-store.ts
│   │   ├── engine/
│   │   │   ├── gap-engine.ts
│   │   │   ├── recommendation-engine.ts
│   │   │   └── scoring-engine.ts
│   │   └── ai/
│   │       ├── gemini-client.ts
│   │       ├── offline-fallback.ts
│   │       └── doc-parser.ts
└── tests/
    ├── runner.ts
    ├── unit/
    │   ├── gap-engine.test.ts
    │   ├── recommendation-engine.test.ts
    │   ├── doc-parser.test.ts
    │   ├── offline-quiz.test.ts
    │   └── storage.test.ts
    └── e2e/
        ├── tier1-features.test.ts
        ├── tier2-boundaries.test.ts
        ├── tier3-combinations.test.ts
        └── tier4-scenarios.test.ts
```
