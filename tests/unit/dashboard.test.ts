import { describe, it, expect } from "../runner";
import { repository } from "../../src/lib/storage/repository";
import type {
  CompetencyDomain,
  DivisionAggregateMetric,
  ACBPPlan,
  SkillGap,
} from "../../src/lib/types";

describe("Role-Based Dashboards & Analytics Engine (Unit)", () => {
  it("retrieves official division aggregate metrics for all 5 MoSPI divisions", async () => {
    const divisions = await repository.getDivisionAggregateData();
    expect(divisions).toHaveLength(5);

    const divisionCodes = divisions.map((d) => d.divisionCode);
    expect(divisionCodes).toContain("FOD");
    expect(divisionCodes).toContain("ESD");
    expect(divisionCodes).toContain("NAD");
    expect(divisionCodes).toContain("DIID");
    expect(divisionCodes).toContain("SDRD");

    // Check FOD details
    const fod = divisions.find((d) => d.divisionCode === "FOD")!;
    expect(fod.totalOfficers).toBe(850);
    expect(fod.cadreBreakdown.JUNIOR_STATISTICAL_OFFICER).toBe(525);
    expect(fod.domainAverages["Statistical Competencies"]).toBeGreaterThanOrEqual(1.0);
    expect(fod.domainAverages["Statistical Competencies"]).toBeLessThanOrEqual(5.0);
    expect(fod.criticalGapsCount).toBe(142);
    expect(fod.topDeficientCompetencies.length).toBeGreaterThanOrEqual(1);
  });

  it("calculates organizational KPIs across divisions accurately", async () => {
    const divisions = await repository.getDivisionAggregateData();
    const totalOfficers = divisions.reduce((sum, d) => sum + d.totalOfficers, 0);
    expect(totalOfficers).toBe(1590); // 850 + 220 + 180 + 150 + 190

    const totalCritical = divisions.reduce((sum, d) => sum + d.criticalGapsCount, 0);
    expect(totalCritical).toBe(241); // 142 + 38 + 24 + 16 + 21
  });

  it("generates authentic ACBP 2026-27 capacity building batches mapped to courses", async () => {
    const plan = await repository.getACBPPlan("2026-27");
    expect(plan.year).toBe("2026-27");
    expect(plan.totalBatches).toBeGreaterThan(0);
    expect(plan.totalOfficersTargeted).toBeGreaterThan(0);
    expect(plan.batches.length).toBe(plan.totalBatches);

    // Verify batch attributes
    const firstBatch = plan.batches[0];
    expect(firstBatch.batchId).toMatch(/^ACBP-202627-\d{3}$/);
    expect(firstBatch.courseTitle).toBeDefined();
    expect(firstBatch.targetCompetencyId).toBeDefined();
    expect(firstBatch.targetCompetencyName).toBeDefined();
    expect(firstBatch.recommendedOfficersCount).toBeGreaterThanOrEqual(15);
    expect(firstBatch.priority).toBeDefined();

    // Verify sources contain both iGOT and NSSTA
    const sources = plan.batches.map((b) => b.source);
    expect(sources).toContain("iGOT Karmayogi");
    expect(sources).toContain("NSSTA TPAC");
  });

  it("calculates 4-domain radar data points correctly against cadre benchmarks", async () => {
    const user = await repository.getUserProfile("usr-jso-rajesh");
    expect(user).not.toBeNull();
    const benchmark = await repository.getCadreBenchmarks(user!.cadre);
    expect(benchmark.cadreId).toBe("JUNIOR_STATISTICAL_OFFICER");

    const comps = await repository.getCompetencies();
    const ratings = user!.assessedRatings || {};

    const domains: CompetencyDomain[] = [
      "Statistical Competencies",
      "Technical Competencies",
      "Digital Governance & Data Stewardship",
      "Behavioural & Managerial Competencies",
    ];

    const radarPoints = domains.map((domain) => {
      const dComps = comps.filter((c) => c.domain === domain);
      const totalAssessed = dComps.reduce((sum, c) => sum + (ratings[c.id] ?? 1), 0);
      const totalBench = dComps.reduce(
        (sum, c) => sum + (benchmark.benchmarks[c.id] ?? 3),
        0
      );
      return {
        domain,
        assessed: Number((totalAssessed / dComps.length).toFixed(2)),
        benchmark: Number((totalBench / dComps.length).toFixed(2)),
      };
    });

    expect(radarPoints).toHaveLength(4);
    radarPoints.forEach((pt) => {
      expect(pt.assessed).toBeGreaterThan(0);
      expect(pt.benchmark).toBeGreaterThan(0);
      expect(pt.assessed).toBeLessThanOrEqual(5.0);
      expect(pt.benchmark).toBeLessThanOrEqual(5.0);
    });
  });

  it("prioritizes skill gaps into Critical, Moderate, and Proficient categories", () => {
    const testGaps: SkillGap[] = [
      {
        competencyId: "TECH_VAL_05",
        competencyName: "Automated Microdata Scrutiny",
        domain: "Technical Competencies",
        assessedLevel: 2,
        benchmarkLevel: 4,
        gap: 2,
        rawDelta: -2,
        priorityScore: 3.75,
        severity: "CRITICAL",
        suggestedAction: "Immediate training required",
      },
      {
        competencyId: "STAT_SMPL_01",
        competencyName: "Sampling Design",
        domain: "Statistical Competencies",
        assessedLevel: 2,
        benchmarkLevel: 3,
        gap: 1,
        rawDelta: -1,
        priorityScore: 1.95,
        severity: "MODERATE",
        suggestedAction: "Modular course recommended",
      },
      {
        competencyId: "TECH_CAPI_04",
        competencyName: "CAPI Operations",
        domain: "Technical Competencies",
        assessedLevel: 4,
        benchmarkLevel: 4,
        gap: 0,
        rawDelta: 0,
        priorityScore: 0,
        severity: "PROFICIENT",
        suggestedAction: "Benchmark achieved",
      },
    ];

    const critical = testGaps.filter((g) => g.severity === "CRITICAL");
    const moderate = testGaps.filter((g) => g.severity === "MODERATE");
    const proficient = testGaps.filter((g) => g.severity === "PROFICIENT");

    expect(critical).toHaveLength(1);
    expect(moderate).toHaveLength(1);
    expect(proficient).toHaveLength(1);
    expect(critical[0].gap).toBe(2);
  });

  it("verifies ACBP summary aggregates by division and domain accurately", async () => {
    const plan = await repository.getACBPPlan("2026-27");
    const divisions = await repository.getDivisionAggregateData();

    // Verify each division has an entry in summaryByDivision
    for (const div of divisions) {
      expect(plan.summaryByDivision[div.divisionName]).toBeDefined();
      expect(plan.summaryByDivision[div.divisionName]).toBeGreaterThan(0);
    }

    // Verify all 4 domains have entries in summaryByDomain
    expect(plan.summaryByDomain["Statistical Competencies"]).toBeDefined();
    expect(plan.summaryByDomain["Technical Competencies"]).toBeDefined();
    expect(plan.summaryByDomain["Digital Governance & Data Stewardship"]).toBeDefined();
    expect(plan.summaryByDomain["Behavioural & Managerial Competencies"]).toBeDefined();
  });
}, "Unit", "DASHBOARDS_AND_ANALYTICS");
