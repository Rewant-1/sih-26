# Testing & Verification Guide
**MoSPI AI-Enabled Skill Intelligence & Learning Platform (SIH 26101)**

---

## 1. Test Suite Overview

The platform includes an automated TypeScript test runner (`tests/runner.ts`) validating **311 test cases** across 5 distinct tiers:

| Tier | Focus Area | Test Files | Tests |
|---|---|---|---|
| **Unit** | Core storage, parsers, fallback generator, gap engine, recommendations | `tests/unit/*.test.ts` | 65 |
| **Tier 1** | Primary feature workflows across R1–R5 | `tests/e2e/tier1-features.test.ts` | 62 |
| **Tier 2** | Boundary conditions, edge cases, malformed payloads, zero-states | `tests/e2e/tier2-boundaries.test.ts` | 58 |
| **Tier 3** | Cross-module state combinations & lifecycle transitions | `tests/e2e/tier3-combinations.test.ts` | 64 |
| **Tier 4** | Real-world MoSPI cadre workflows (ISS AD, SSO, JSO) | `tests/e2e/tier4-scenarios.test.ts` | 62 |
| **Total** | **Full System Specification** | **9 test files** | **311** |

---

## 2. Test Execution

Run the complete test suite:

```bash
cd c:\sih-2026
npm test
```

### Sample Output
```
================================================================================
 MoSPI Skill Intelligence Platform - Full Test Suite Runner (SIH 26101)
================================================================================

▶ [Unit] Data Repository & Storage Service
  ✓ loads all 29 official competencies across 4 domains
  ✓ filters competencies by domain correctly
  ...

▶ [Tier 4] MoSPI Cadre Real-World Scenarios
  ✓ Scenario 1: Junior Statistical Officer (JSO) in Field Operations Division (FOD)
  ✓ Scenario 2: Senior Statistical Officer (SSO) in Price Statistics Division
  ✓ Scenario 3: ISS Assistant Director in Data Informatics & Innovation Division (DIID)
  ...

================================================================================
 ✅ ALL 311 SPECIFICATION TESTS PASSED in 0.42s
================================================================================
```

---

## 3. Official Document Test Fixtures

The test suite exercises real document parsing and quiz generation using realistic MoSPI sample fixtures:

1. **Consumer Price Index (CPI) Manual**: Exercises price statistic index formulas, weighting diagrams, and base year concepts.
2. **NSS 79th Round Survey Methodology**: Exercises multi-stage stratified sampling, FSU/USU selection, and design weights.
3. **National Data Governance Framework Policy (NDGFP)**: Exercises non-personal data protocols, anonymization, and metadata standards.
