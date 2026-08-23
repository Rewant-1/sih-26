# E2E Test Infra: MoSPI Skill Intelligence & Learning Platform (SIH 26101)

## Test Philosophy
- **Requirement-Driven & Opaque-Box**: Tests are derived strictly from `c:/sih-2026/.agents/ORIGINAL_REQUEST.md` and user-facing requirements, not internal implementation shortcuts.
- **Deterministic & Air-Gapped**: Tests run via an automated test runner script (`npm test` / `tsx tests/runner.ts` / `vitest` / `node`) without requiring live external internet access or third-party database services.
- **Methodology**: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.

---

## Feature Inventory & Test Tier Mapping

| # | Feature Code | Feature Description | Tier 1 (Min 5) | Tier 2 (Min 5) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|--------------|---------------------|:--------------:|:--------------:|:-----------------:|:-----------------:|
| 1 | `FRAC_TAXONOMY` | 4-domain 29-competency MoSPI framework structure | 5 | 5 | ✓ | ✓ |
| 2 | `PROFICIENCY_RUBRICS` | Levels 1-5 rubric descriptors and anchors | 5 | 5 | ✓ | ✓ |
| 3 | `CADRE_BENCHMARKS` | ISS AD, SSO, JSO baseline expectations | 5 | 5 | ✓ | ✓ |
| 4 | `GAP_CALCULATION` | Deterministic gap formula, priority weighting | 5 | 5 | ✓ | ✓ |
| 5 | `ASSESSMENT_WIZARD` | Self-assessment rating submission & calculation | 5 | 5 | ✓ | ✓ |
| 6 | `SUNBIRD_SCHEMA` | Sunbird-CB metadata validation (`identifier`, etc.) | 5 | 5 | ✓ | ✓ |
| 7 | `NSSTA_CATALOG` | NSSTA TPAC calendar data & cadre tagging | 5 | 5 | ✓ | ✓ |
| 8 | `RECOMMENDATION_ENGINE` | Gap-to-course matching algorithm | 5 | 5 | ✓ | ✓ |
| 9 | `CATALOG_BADGES` | Source filtering & badge display | 5 | 5 | ✓ | ✓ |
| 10 | `DOC_PARSER` | PDF, DOCX, and raw text chunking/normalization | 5 | 5 | ✓ | ✓ |
| 11 | `GEMINI_GENERATOR` | Structured JSON question generator & schema validation | 5 | 5 | ✓ | ✓ |
| 12 | `OFFLINE_FALLBACK` | Offline deterministic quiz generation & seed bank | 5 | 5 | ✓ | ✓ |
| 13 | `QUIZ_RUNNER` | Auto-graded quiz state, timer, and submission | 5 | 5 | ✓ | ✓ |
| 14 | `BLOOM_SCORING` | Bloom-weighted scoring mapped to 1-5 scale | 5 | 5 | ✓ | ✓ |
| 15 | `LEARNER_RADAR` | 4-domain Recharts Radar chart calculation & data | 5 | 5 | ✓ | ✓ |
| 16 | `GAP_BREAKDOWN` | Critical, moderate, proficient gap cards | 5 | 5 | ✓ | ✓ |
| 17 | `LEARNING_ROADMAP` | Gap-to-course action plan & enrollment | 5 | 5 | ✓ | ✓ |
| 18 | `ADMIN_HEATMAP` | Division-wise aggregate competency heatmap | 5 | 5 | ✓ | ✓ |
| 19 | `CADRE_DISTRIBUTION`| Cadre-wise proficiency breakdown across domains | 5 | 5 | ✓ | ✓ |
| 20 | `ACBP_PLANNER` | Annual Capacity Building Plan batch recommendations | 5 | 5 | ✓ | ✓ |
| 21 | `ZERO_CONFIG_STORE` | File-backed JSON repository CRUD operations | 5 | 5 | ✓ | ✓ |
| 22 | `APP_ROUTING_THEME` | Next.js App routes and MoSPI visual styling | 5 | 5 | ✓ | ✓ |

---

## Test Architecture & Execution

### Test Runner Invocation
- **Full Suite**: `npm test` or `npx tsx tests/runner.ts`
- **Unit & Integration**: `npx tsx tests/unit/*.test.ts`
- **E2E Tiers**: `npx tsx tests/e2e/*.test.ts`
- **Pass/Fail Semantics**: All test suites must exit with exit code `0` and 0 failures.

### Directory Layout
```
tests/
├── runner.ts                       # Unified test runner aggregating all tiers
├── fixtures/
│   ├── sample-nss-manual.txt       # Official NSS Survey manual excerpt
│   ├── sample-cpi-circular.txt     # Official CPI Revision circular excerpt
│   └── sample-ndgfp-guide.txt      # National Data Governance framework text
├── unit/
│   ├── gap-engine.test.ts          # Mathematical gap & priority validation
│   ├── recommendation-engine.test.ts # Level & cadre matching algorithms
│   ├── doc-parser.test.ts          # Text/PDF/DOCX extraction & chunking
│   ├── offline-quiz.test.ts        # Deterministic offline fallback verification
│   └── storage.test.ts             # Repository JSON read/write persistence
└── e2e/
    ├── tier1-features.test.ts      # 110+ Tier 1 Feature Coverage test cases
    ├── tier2-boundaries.test.ts    # 110+ Tier 2 Boundary & Corner test cases
    ├── tier3-combinations.test.ts  # 25+ Tier 3 Pairwise Combinatorial test cases
    └── tier4-scenarios.test.ts     # 12+ Tier 4 Real-World Official Statistics scenarios
```

---

## Real-World Application Scenarios (Tier 4)
1. **Scenario 1: JSO Field Operations to SSO Supervision Transition**
   - User transitions cadre from Junior Statistical Officer to Senior Statistical Officer.
   - Evaluates expanded benchmarks in *Field Team Management* and *Microdata Scrutiny*.
   - System computes positive/negative deltas, flags Critical Gaps, and recommends NSSTA TPAC supervisory workshops + iGOT CAPI quality control modules.
2. **Scenario 2: ISS Assistant Director National Accounts Modernization**
   - User self-assesses in *National Accounts Statistics (SNA 2008)* and *R for Official Statistics*.
   - Uploads new SNA 2025 discussion draft document -> triggers AI Document-to-Quiz Generator.
   - Completes 10-question Bloom-weighted quiz -> updates competency profile from Level 3.2 to Level 4.1.
3. **Scenario 3: DIID Leadership ACBP 2026-27 Formulation**
   - Admin accesses DIID Leadership Dashboard across FOD, ESD, NAD, DIID, and SDRD divisions.
   - System identifies systemic organizational deficit in *SDC & Microdata Anonymization* (average 2.1 vs benchmark 3.8).
   - Generates automated ACBP training batches with recommended NSSTA residential courses and iGOT e-learning quotas.
4. **Scenario 4: Complete Offline Fallback In Air-Gapped Regional Statistical Office**
   - Document-to-Quiz engine runs in an environment with no internet / no Gemini API key.
   - System transparently parses survey manual, extracts definitions and methodology rules, synthesizes full 4-choice questions with answer keys and citations, and executes interactive scoring with zero degradation.

---

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥ 110 test cases (≥ 5 per feature across 22 features)
- **Tier 2 (Boundary & Corner)**: ≥ 110 test cases (empty inputs, max ratings, boundary levels 1 & 5, malformed JSON, corrupt text, division extremes)
- **Tier 3 (Cross-Feature Combinations)**: ≥ 25 pairwise integration tests
- **Tier 4 (Real-World Workload Scenarios)**: ≥ 12 end-to-end multi-step scenarios
- **Total Minimum Target**: ≥ 257 test cases
