import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/storage/repository";
import { calculateSkillGaps } from "@/lib/engine/gap-engine";
import type { CadreId, AssessmentRecord } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const cadre = searchParams.get("cadre") as CadreId | null;

    if (userId) {
      const records = await repository.getAssessmentRecords(userId);
      const user = await repository.getUserProfile(userId);
      return NextResponse.json({ success: true, records, user });
    }

    if (cadre) {
      const benchmark = await repository.getCadreBenchmarks(cadre);
      return NextResponse.json({ success: true, cadre, benchmark });
    }

    // Return full benchmark matrix and taxonomy
    const allBenchmarks = await repository.getAllCadreBenchmarks();
    const competencies = await repository.getCompetencies();

    return NextResponse.json({
      success: true,
      benchmarks: allBenchmarks,
      competencies,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch assessment data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = "usr_001", cadre, division = "National Accounts Division (NAD)", ratings } = body;

    if (!cadre) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: cadre" },
        { status: 400 }
      );
    }

    const validCadres: CadreId[] = [
      "ISS_ASSISTANT_DIRECTOR",
      "SENIOR_STATISTICAL_OFFICER",
      "JUNIOR_STATISTICAL_OFFICER",
    ];

    if (!validCadres.includes(cadre as CadreId)) {
      return NextResponse.json(
        { success: false, error: `Invalid cadre identifier: ${cadre}` },
        { status: 400 }
      );
    }

    const benchmark = await repository.getCadreBenchmarks(cadre as CadreId);
    if (!benchmark) {
      return NextResponse.json(
        { success: false, error: `Benchmark not found for cadre: ${cadre}` },
        { status: 404 }
      );
    }

    const safeRatings = ratings || {};
    const result = calculateSkillGaps(safeRatings, cadre as CadreId, benchmark, userId);

    const assessmentId = `asm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: AssessmentRecord = {
      assessmentId,
      userId,
      cadre: cadre as CadreId,
      division,
      timestamp: new Date().toISOString(),
      ratings: safeRatings,
      result,
    };

    // Persist assessment record to repository
    await repository.saveAssessmentRecord(record);

    // Update user profile if user exists
    const existingUser = await repository.getUserProfile(userId);
    if (existingUser) {
      await repository.saveUserProfile({
        ...existingUser,
        cadre: cadre as CadreId,
        division,
        lastAssessmentDate: record.timestamp,
        currentAssessmentId: assessmentId,
        assessedRatings: safeRatings,
      });
    }

    return NextResponse.json({
      success: true,
      assessmentId,
      result,
      record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process assessment evaluation" },
      { status: 500 }
    );
  }
}
