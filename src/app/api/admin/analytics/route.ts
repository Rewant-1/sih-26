import { NextResponse } from "next/server";
import { repository } from "@/lib/storage/repository";

export async function GET() {
  try {
    const [divisions, acbpPlan, benchmarks, users] = await Promise.all([
      repository.getDivisionAggregateData(),
      repository.getACBPPlan("2026-27"),
      repository.getAllCadreBenchmarks(),
      repository.getAllUsers(),
    ]);

    const totalOfficers = divisions.reduce((sum, d) => sum + d.totalOfficers, 0);
    const avgProficiency = Number(
      (
        divisions.reduce((sum, d) => sum + d.overallProficiency, 0) /
        divisions.length
      ).toFixed(1)
    );
    const criticalDeficiencies = divisions.reduce(
      (sum, d) => sum + d.criticalGapsCount,
      0
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          kpis: {
            totalStatisticalOfficersCovered: totalOfficers,
            organizationAverageProficiency: avgProficiency,
            criticalDeficiencyCount: criticalDeficiencies,
            totalPlannedACBPBatches: acbpPlan.totalBatches,
            totalTargetedOfficersForTraining: acbpPlan.totalOfficersTargeted,
          },
          divisions,
          acbpPlan,
          cadreBenchmarks: benchmarks,
          seededUsersCount: users.length,
          generatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch admin analytics",
      },
      { status: 500 }
    );
  }
}
