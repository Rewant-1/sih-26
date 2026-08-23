import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/storage/repository";
import { filterCourseCatalog } from "@/lib/engine/recommendation-engine";
import type { CourseFilter, CourseSource } from "@/lib/types/sunbird";
import type { CadreId, CompetencyDomain, ProficiencyLevel } from "@/lib/types/frac";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Single course lookup by ID
    const id = searchParams.get("id");
    if (id) {
      const course = await repository.getCourseById(id);
      if (!course) {
        return NextResponse.json(
          { success: false, error: `Course not found for identifier: ${id}` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, course });
    }

    // Extract query filter parameters
    const source = searchParams.get("source") as CourseSource | undefined;
    const domain = searchParams.get("domain") as CompetencyDomain | undefined;
    const cadre = searchParams.get("cadre") as CadreId | undefined;
    const competencyId = searchParams.get("competencyId") || undefined;
    const levelParam = searchParams.get("level");
    const level = levelParam ? (Number(levelParam) as ProficiencyLevel) : undefined;
    const search = searchParams.get("search") || searchParams.get("q") || undefined;

    const filters: CourseFilter = {
      source,
      domain,
      cadre,
      competencyId,
      level,
      search,
    };

    const allCourses = await repository.getCourses();
    const filteredCourses = filterCourseCatalog(allCourses, filters);

    const igotCount = allCourses.filter((c) => c.source === "iGOT Karmayogi").length;
    const nsstaCount = allCourses.filter((c) => c.source === "NSSTA TPAC").length;

    return NextResponse.json({
      success: true,
      count: filteredCourses.length,
      total: allCourses.length,
      courses: filteredCourses,
      metadata: {
        igotCount,
        nsstaCount,
        filtersApplied: Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        ),
      },
    });
  } catch (error: any) {
    console.error("Error in /api/courses:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
