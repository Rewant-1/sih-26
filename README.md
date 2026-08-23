# MoSPI Skill Intelligence & Learning Platform (SIH 26101)
**AI-Enabled Skill Intelligence & Learning Platform for Official Statistics Officials**  
*Ministry of Statistics and Programme Implementation (MoSPI) / Data Informatics and Innovation Division (DIID)*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-311%2F311%20Passing-brightgreen.svg)](tests/)
[![Zero Config](https://img.shields.io/badge/Database-Zero--Config%20JSON-orange.svg)](src/lib/storage/)

---

## 🏛️ 1. Ministry Context & Mission Karmayogi Alignment

The **Ministry of Statistics and Programme Implementation (MoSPI)**, through its **Data Informatics and Innovation Division (DIID)** and the **National Statistical Systems Training Academy (NSSTA)**, is modernizing civil service capacity building for official statistics.

In accordance with the **Capacity Building Commission (CBC)** and **Mission Karmayogi**, this platform transitions human resource development from a *rule-based* to a *role-based* model using the **FRAC (Framework of Roles, Activities, and Competencies)** taxonomy.

```
                               ┌───────────────────────────────────────────────────────────┐
                               │       MoSPI Cadre Official (ISS AD / SSO / JSO)           │
                               └─────────────────────────────┬─────────────────────────────┘
                                                             │
                                                             ▼
                                              ┌─────────────────────────────┐
                                              │  FRAC Competency Assessment │
                                              │  (29 Skills across 4 Domains)│
                                              └──────────────┬──────────────┘
                                                             │
                                                             ▼
                                              ┌─────────────────────────────┐
                                              │   Skill Gap Engine (Δ)      │
                                              │   Δ = Max(0, Req - Assessed) │
                                              └──────────────┬──────────────┘
                                                             │
                                      ┌──────────────────────┴──────────────────────┐
                                      ▼                                             ▼
                       ┌─────────────────────────────┐               ┌─────────────────────────────┐
                       │   Dual-Catalog Rec Adapter  │               │   AI Document-to-Quiz Studio│
                       │  • iGOT Karmayogi (Sunbird) │               │  • Gemini Structured Gen    │
                       │  • NSSTA TPAC Training Cal  │               │  • Resilient Offline Engine │
                       └──────────────┬──────────────┘               └──────────────┬──────────────┘
                                      │                                             │
                                      └──────────────────────┬──────────────────────┘
                                                             │
                                                             ▼
                                              ┌─────────────────────────────┐
                                              │   Role-Based Dashboards     │
                                              │  • Learner Polar Radar      │
                                              │  • Admin Division Heatmap   │
                                              │  • Automated ACBP 2026-27   │
                                              └─────────────────────────────┘
```

---

## 🎯 2. Core Capabilities

### 1. MoSPI FRAC Competency Assessment & Auditable Gap Engine
* **29 Official Competencies**: Structured across **Statistical** (Sampling, National Accounts, Price Stats, PLFS, ASI, SDG, Data Quality), **Technical** (Python, R, SQL, Stata, GIS, AI/ML, Cloud), **Digital Governance** (DPDPA 2023, Cybersecurity, MeghRaj Cloud, DPI), and **Behavioural/Managerial** (Leadership, Statistical Ethics, Communication).
* **Proficiency Levels 1 to 5**: Rigorous behavioral descriptors from Basic/Awareness (Level 1) to Strategic/Policy Lead (Level 5).
* **Cadre Benchmarks**: Pre-configured role requirements for **ISS Assistant Director**, **Senior Statistical Officer (SSO)**, and **Junior Statistical Officer (JSO)**.
* **Deterministic Gap Calculation**: Auditable, transparent gap computation $\Delta = \max(0, \text{Benchmark} - \text{Assessed})$ with weighted domain priority scoring and severity categorization (`CRITICAL`, `MODERATE`, `PROFICIENT`).

### 2. iGOT Karmayogi (Sunbird-CB) & NSSTA TPAC Recommendation Engine
* **Sunbird-CB Schema Compliance**: Built matching the exact open-source schema powering Karmayogi Bharat (`KB-iGOT` on GitHub: `identifier`, `competencies`, `learningOutcomes`, `organisation`, `source`).
* **Dual-Catalog Integration**: Unified search and filtering across **iGOT Karmayogi** (general civil service & IT modules) and **NSSTA TPAC** (MoSPI premier statistical training academy modules).
* **Multi-Factor Semantic Matcher**: Dynamic scoring ranking courses by target skill delta, cadre suitability, and domain criticality.

### 3. AI Document-to-Quiz Generator & Interactive Runner
* **Document Ingestion**: Upload official PDF, DOCX, or paste survey circulars/manuals (e.g., NSS 79th Round, CPI Handbook, National Data Governance Framework).
* **Gemini Structured Generation**: Enforces JSON schema output generating multi-choice questions with 4 options, answer keys, Bloom's cognitive taxonomy classification, and source-grounded explanations.
* **Offline Resilient Fallback**: Built-in deterministic synthesis engine and seed bank guaranteeing **100% demo uptime on stage** without internet or API key dependencies.
* **Auto-Grading Quiz Runner**: Timer, flag-for-review, instant score breakdown, and Bloom-weighted proficiency scoring that feeds directly into the official's profile.

### 4. Interactive Dashboards & Workforce Analytics
* **Learner Dashboard**: Interactive Recharts Polar Radar chart, prioritized gap breakdown, and personalized learning roadmap with one-click enrollment.
* **Admin / DIID Leadership Dashboard**: 5-division MoSPI organizational heatmap (FOD, ESD, NAD, DIID, SDRD) and automated **Annual Capacity Building Plan (ACBP 2026-27)** batch training planner.

---

## ⚡ 3. Quick Start

### Prerequisites
* **Node.js**: Version 18.17+ or 20+
* **npm**: Version 9+
* *No external database, Docker, or SQLite installation required.*

### Installation & Launch

```bash
# 1. Navigate to the repository
cd c:\sih-2026

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API Key
# Copy the example environment file if you wish to use live Gemini API
cp .env.example .env.local
# Add your GEMINI_API_KEY inside .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Running Tests

```bash
# Run all 311 automated tests (unit + e2e)
npm test
```

---

## 🧭 4. Application Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | Portal entry with MoSPI tricolor theme and rapid navigation |
| `/assessment` | FRAC Assessment Wizard | Interactive 4-domain competency self-rating and cadre benchmarking |
| `/catalog` | Course Catalog | Sunbird-CB & NSSTA TPAC courses with dual-source badges and search |
| `/quiz-studio` | AI Quiz Studio | Upload PDF/DOCX or paste text to generate auto-graded quizzes |
| `/quiz-runner/[id]` | Quiz Runner | Interactive auto-graded assessment player with review and scoring |
| `/dashboard/learner` | Learner Dashboard | Polar radar chart, prioritized gaps, and personalized learning path |
| `/dashboard/admin` | Admin Leadership Hub | 5-division competency heatmap and cadre capability analytics |
| `/acbp` | ACBP 2026-27 Planner | Automated Annual Capacity Building Plan batch training generator |

---

## 🎤 5. Pitching to SIH Judges (Key Talking Points)

1. **Authentic Government Taxonomy**:
   > *"We did not invent arbitrary skills. We seeded the exact 29 competencies across 4 domains (Statistical, Technical, Digital Governance, Behavioural) and Levels 1–5 defined by the Capacity Building Commission (CBC) for MoSPI's ISS and SSS cadres."*
2. **Real Sunbird-CB / iGOT Architecture**:
   > *"Our course catalog adapter strictly implements the Sunbird-CB metadata schema used by Karmayogi Bharat (`KB-iGOT`). The code contains an explicit adapter layer that allows swapping mock data with live government REST APIs in a single configuration line."*
3. **Auditable, Explainable Skill Gap Logic**:
   > *"For government human resource planning, explainability is critical. Our gap engine computes deterministic, auditable deltas ($\text{Gap} = \max(0, \text{Benchmark} - \text{Assessed})$) with weighted priority scores rather than opaque black-box estimates."*
4. **AI Innovation Where It Counts**:
   > *"We focused LLM capability on high-value document comprehension. Trainers can upload survey manuals (like NSS 79th Round or CPI circulars), and Gemini generates structured, Bloom-classified questions with pedagogical explanations, backed by an offline engine for zero demo downtime."*

---

## 📚 6. Documentation Index

* [ARCHITECTURE.md](ARCHITECTURE.md) — Detailed system design, FRAC data model, Sunbird schemas, and interface contracts.
* [TESTING.md](TESTING.md) — 311 test cases breakdown, E2E test scenarios, and verification report.
