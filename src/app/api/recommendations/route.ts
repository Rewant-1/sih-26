import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/storage/repository";
import {
  recommendCoursesForGaps,
  type GapInfo,
} from "@/lib/engine/recommendation-engine";
import type { CadreId, SkillGap } from "@/lib/types/frac";
import type { UserProfile } from "@/lib/types/user";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr-jso-rajesh";
    const requestedCadre = searchParams.get("cadre") as CadreId | null;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    // Load User Profile
    const userProfile = await repository.getUserProfile(userId);
    const userCadre: CadreId =
      requestedCadre || (userProfile?.cadre as CadreId) || "JUNIOR_STATISTICAL_OFFICER";

    // Load Courses Catalog
    const courses = await repository.getCourses();

    // Check for existing Assessment Records
    const assessmentRecords = await repository.getAssessmentRecords(userId);
    let gaps: SkillGap[] | Record<string, GapInfo> = [];

    if (assessmentRecords && assessmentRecords.length > 0) {
      // Use latest assessment record
      const latest = assessmentRecords[assessmentRecords.length - 1];
      gaps = latest.result?.gaps || [];
    } else {
      // Default fallback gaps for initial profile
      const benchmarks = await repository.getCadreBenchmarks(userCadre);
      const defaultGaps: Record<string, GapInfo> = {};

      if (userCadre === "JUNIOR_STATISTICAL_OFFICER" || userCadre === ("JSO" as any)) {
        defaultGaps["TECH_R_01"] = { gap: 1, priority: 2.5, assessedLevel: 1, benchmarkLevel: 2 };
        defaultGaps["TECH_CAPI_04"] = { gap: 1, priority: 3.0, assessedLevel: 3, benchmarkLevel: 4 };
        defaultGaps["STAT_SMPL_01"] = { gap: 1, priority: 2.6, assessedLevel: 1, benchmarkLevel: 2 };
      } else if (userCadre === "SENIOR_STATISTICAL_OFFICER" || userCadre === ("SSO" as any)) {
        defaultGaps["BEH_FLD_01"] = { gap: 1, priority: 3.2, assessedLevel: 3, benchmarkLevel: 4 };
        defaultGaps["TECH_VAL_05"] = { gap: 1, priority: 3.5, assessedLevel: 3, benchmarkLevel: 4 };
        defaultGaps["GOV_SDC_02"] = { gap: 1, priority: 2.8, assessedLevel: 2, benchmarkLevel: 3 };
      } else {
        defaultGaps["STAT_NAT_02"] = { gap: 2, priority: 4.5, assessedLevel: 2, benchmarkLevel: 4 };
        defaultGaps["STAT_IDX_03"] = { gap: 1, priority: 3.8, assessedLevel: 3, benchmarkLevel: 4 };
        defaultGaps["BEH_POL_03"] = { gap: 2, priority: 3.6, assessedLevel: 2, benchmarkLevel: 4 };
      }
      gaps = defaultGaps;
    }

    const recommendations = recommendCoursesForGaps(gaps, userCadre, courses);
    const result = limit ? recommendations.slice(0, limit) : recommendations;

    return NextResponse.json({
      success: true,
      count: result.length,
      userProfile: userProfile || {
        id: userId,
        name: "Officer",
        cadre: userCadre,
        enrolledCourseIds: [],
        completedCourseIds: [],
      },
      cadre: userCadre,
      recommendations: result,
    });
  } catch (error: any) {
    console.error("Error in GET /api/recommendations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cadre, gaps, ratings, limit } = body;

    const userCadre: CadreId = cadre || "ISS_ASSISTANT_DIRECTOR";
    const courses = await repository.getCourses();

    let gapData: any = gaps;

    if (!gapData && ratings) {
      // Calculate gaps from ratings and cadre benchmarks
      const benchmarkProfile = await repository.getCadreBenchmarks(userCadre);
      const computedGaps: Record<string, GapInfo> = {};

      for (const [compId, bLevel] of Object.entries(benchmarkProfile.benchmarks)) {
        const aLevel = ratings[compId] ?? 1;
        const gapVal = Math.max(0, bLevel - aLevel);
        if (gapVal > 0) {
          computedGaps[compId] = {
            gap: gapVal,
            priority: gapVal * (benchmarkProfile.domainWeights["Statistical Competencies"] || 1.0),
            assessedLevel: aLevel,
            benchmarkLevel: bLevel,
          };
        }
      }
      gapData = computedGaps;
    } else if (!gapData && userId) {
      const records = await repository.getAssessmentRecords(userId);
      if (records && records.length > 0) {
        gapData = records[records.length - 1].result?.gaps;
      }
    }

    const recommendations = recommendCoursesForGaps(gapData || {}, userCadre, courses);
    const result = limit ? recommendations.slice(0, limit) : recommendations;

    return NextResponse.json({
      success: true,
      count: result.length,
      cadre: userCadre,
      recommendations: result,
    });
  } catch (error: any) {
    console.error("Error in POST /api/recommendations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
