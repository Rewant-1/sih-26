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
    const { userId = "usr-jso-rajesh", division = "Field Operations Division (FOD)", ratings = {} } = body;
    let rawCadre = body.cadre || body.cadreId || "JUNIOR_STATISTICAL_OFFICER";
    let normalizedCadre: CadreId = "JUNIOR_STATISTICAL_OFFICER";
    if (rawCadre === "cadre_sso" || rawCadre === "SENIOR_STATISTICAL_OFFICER" || rawCadre === "SSO") {
      normalizedCadre = "SENIOR_STATISTICAL_OFFICER";
    } else if (rawCadre === "cadre_iss_ad" || rawCadre === "ISS_ASSISTANT_DIRECTOR" || rawCadre === "ISS_AD") {
      normalizedCadre = "ISS_ASSISTANT_DIRECTOR";
    }

    const benchmark = await repository.getCadreBenchmarks(normalizedCadre);
    if (!benchmark) {
      return NextResponse.json(
        { success: false, error: `Benchmark not found for cadre: ${normalizedCadre}` },
        { status: 404 }
      );
    }

    const safeRatings = ratings || {};
    const result = calculateSkillGaps(safeRatings, normalizedCadre, benchmark, userId);

    const assessmentId = `asm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: AssessmentRecord = {
      assessmentId,
      userId,
      cadre: normalizedCadre,
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
        cadre: normalizedCadre,
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
