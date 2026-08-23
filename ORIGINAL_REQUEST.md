# Original User Request

## 2026-08-23T12:33:24Z

# Teamwork Project Prompt

Build an AI-Enabled Skill Intelligence & Learning Platform prototype for Official Statistics officials (MoSPI / DIID, SIH 26101), integrating Mission Karmayogi's FRAC competency framework across 4 official domains, transparent skill-gap analysis, an iGOT Karmayogi (Sunbird-CB schema) & NSSTA TPAC course catalog adapter with semantic recommendations, an AI-powered document-to-quiz generator (via Gemini API with offline fallback), and interactive learner/admin analytics dashboards.

Working directory: c:/sih-2026

Integrity mode: development

## Requirements

### R1. MoSPI FRAC Competency Assessment & Skill Gap Engine
Implement a multi-domain competency assessment system seeded with official MoSPI / CBC taxonomies (Statistical, Technical, Digital Governance, Behavioural/Managerial) mapped across Proficiency Levels 1-5 for key statistical cadres (ISS Assistant Director, Senior Statistical Officer, Junior Statistical Officer). Provide a deterministic, transparent gap calculation engine comparing assessed proficiency against cadre benchmarks.

### R2. iGOT Karmayogi (Sunbird-CB) & NSSTA TPAC Recommendation Engine
Implement an extensible course catalog adapter adhering to authentic Sunbird-CB metadata schemas (`identifier`, `competencies`, `learningOutcomes`, `organisation`, `source`). Implement a semantic recommendation engine that maps identified skill gaps to relevant courses from both iGOT Karmayogi and NSSTA TPAC catalogs.

### R3. AI Document-to-Quiz Generator & Interactive Assessment UI
Implement an end-to-end quiz generation module that extracts text from uploaded official documents (PDF/DOCX/text paste such as NSS survey manuals or CPI circulars), invokes Google Gemini API with structured JSON output constraints to produce multiple-choice questions with answer keys and explanations, and provides an interactive, auto-graded quiz interface with offline fallback capability.

### R4. Role-Based Dashboards & Analytics
Implement dual responsive dashboards using modern data visualizations:
- **Learner Dashboard**: Interactive 4-domain competency radar chart, prioritized skill gap breakdown, personalized learning path, and quiz history.
- **Admin / DIID Leadership Dashboard**: Cadre-wise and domain-wise competency distribution heatmap, critical skill deficiency metrics, and automated Annual Capacity Building Plan (ACBP) training recommendations.

### R5. Architecture & Zero-Config Data Layer
Implement as a clean Next.js 14/15 App Router application with Tailwind CSS, Lucide React, and Recharts, utilizing an in-app file-backed JSON/mock storage service requiring zero external database or local SQLite setup, runnable out-of-the-box via standard npm scripts.

## Acceptance Criteria

### Competency & Gap Engine
- [ ] Complete 4-domain MoSPI competency taxonomy seeded with realistic official skills and 1-5 proficiency scales.
- [ ] Self-assessment flow captures user ratings and deterministically computes gaps against selected cadre roles.

### iGOT & NSSTA Integration Adapter
- [ ] Course data models strictly follow Sunbird/iGOT metadata conventions.
- [ ] Recommendation adapter correctly links skill gaps to targeted courses with source badges (`iGOT Karmayogi` vs `NSSTA TPAC`).

### AI Document-to-Quiz Generator
- [ ] Document parser extracts text from uploaded files or direct text paste.
- [ ] Gemini API generates structured JSON questions with explanations, with built-in offline mock fallback for resilience.
- [ ] Interactive quiz allows selection, submission, instant scoring, and detailed answer review.

### Dashboards & Visualizations
- [ ] Learner radar chart dynamically updates based on assessment results.
- [ ] Admin heatmap visualizes aggregate competency levels across departments and domains.
