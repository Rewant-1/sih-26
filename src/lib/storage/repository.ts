import type {
  Competency,
  CompetencyDomain,
  CadreId,
  CadreBenchmark,
  SunbirdCBCourse,
  CourseFilter,
  Quiz,
  UserProfile,
  AssessmentRecord,
  DivisionAggregateMetric,
  ACBPPlan,
  ACBPBatchPlan,
  QuizAttempt,
} from "../types";
import { jsonStore } from "./json-store";

export interface DataRepository {
  getCompetencies(): Promise<Competency[]>;
  getCompetenciesByDomain(domain: CompetencyDomain): Promise<Competency[]>;
  getCadreBenchmarks(cadre: CadreId): Promise<CadreBenchmark>;
  getAllCadreBenchmarks(): Promise<Record<CadreId, CadreBenchmark>>;

  getCourses(filters?: CourseFilter): Promise<SunbirdCBCourse[]>;
  getCourseById(id: string): Promise<SunbirdCBCourse | null>;

  getQuizzes(): Promise<Quiz[]>;
  getQuizById(id: string): Promise<Quiz | null>;
  saveQuiz(quiz: Quiz): Promise<Quiz>;

  getUserProfile(userId: string): Promise<UserProfile | null>;
  getAllUsers(): Promise<UserProfile[]>;
  saveUserProfile(profile: UserProfile): Promise<UserProfile>;
  saveAssessmentRecord(record: AssessmentRecord): Promise<AssessmentRecord>;
  getAssessmentRecords(userId: string): Promise<AssessmentRecord[]>;

  saveQuizAttempt?(attempt: QuizAttempt): Promise<QuizAttempt>;
  getQuizAttempts?(userId: string): Promise<QuizAttempt[]>;

  getDivisionAggregateData(): Promise<DivisionAggregateMetric[]>;
  getACBPPlan(year: string): Promise<ACBPPlan>;
}

export class DataRepositoryService implements DataRepository {
  public async getCompetencies(): Promise<Competency[]> {
    return jsonStore.getCompetencies();
  }

  public async getCompetenciesByDomain(
    domain: CompetencyDomain
  ): Promise<Competency[]> {
    const all = jsonStore.getCompetencies();
    return all.filter((c) => c.domain === domain);
  }

  public async getCadreBenchmarks(cadre: CadreId): Promise<CadreBenchmark> {
    const all = jsonStore.getCadreBenchmarks();
    const benchmark = all[cadre];
    if (!benchmark) {
      throw new Error(`Cadre benchmark not found for cadre: ${cadre}`);
    }
    return benchmark;
  }

  public async getAllCadreBenchmarks(): Promise<Record<CadreId, CadreBenchmark>> {
    return jsonStore.getCadreBenchmarks();
  }

  public async getCourses(filters?: CourseFilter): Promise<SunbirdCBCourse[]> {
    let courses = jsonStore.getCourses();

    if (!filters) {
      return courses;
    }

    if (filters.source) {
      courses = courses.filter((c) => c.source === filters.source);
    }

    if (filters.cadre) {
      courses = courses.filter((c) => c.targetAudience.includes(filters.cadre!));
    }

    if (filters.domain) {
      courses = courses.filter((c) =>
        c.competencies.some((cmp) => cmp.competencyArea === filters.domain)
      );
    }

    if (filters.competencyId) {
      courses = courses.filter((c) =>
        c.competencies.some((cmp) => cmp.id === filters.competencyId)
      );
    }

    if (filters.level) {
      courses = courses.filter((c) =>
        c.competencies.some((cmp) => cmp.level >= filters.level!)
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.competencies.some((cmp) => cmp.name.toLowerCase().includes(q))
      );
    }

    return courses;
  }

  public async getCourseById(id: string): Promise<SunbirdCBCourse | null> {
    const courses = jsonStore.getCourses();
    return courses.find((c) => c.identifier === id) || null;
  }

  public async getQuizzes(): Promise<Quiz[]> {
    return jsonStore.getQuizzes();
  }

  public async getQuizById(id: string): Promise<Quiz | null> {
    return jsonStore.getQuizById(id);
  }

  public async saveQuiz(quiz: Quiz): Promise<Quiz> {
    return jsonStore.saveQuiz(quiz);
  }

  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    return jsonStore.getUserById(userId);
  }

  public async getAllUsers(): Promise<UserProfile[]> {
    return jsonStore.getUsers();
  }

  public async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    return jsonStore.saveUser(profile);
  }

  public async saveAssessmentRecord(
    record: AssessmentRecord
  ): Promise<AssessmentRecord> {
    return jsonStore.saveAssessmentRecord(record);
  }

  public async getAssessmentRecords(
    userId: string
  ): Promise<AssessmentRecord[]> {
    return jsonStore.getAssessmentRecords(userId);
  }

  public async saveQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt> {
    return jsonStore.saveQuizAttempt(attempt);
  }

  public async getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    return jsonStore.getQuizAttempts(userId);
  }

  public async getDivisionAggregateData(): Promise<DivisionAggregateMetric[]> {
    return jsonStore.getDepartmentAnalytics();
  }

  public async getACBPPlan(year: string = "2026-27"): Promise<ACBPPlan> {
    const divisions = jsonStore.getDepartmentAnalytics();
    const courses = jsonStore.getCourses();

    // Map deficient competencies to courses
    const batches: ACBPBatchPlan[] = [];
    let batchCounter = 1;
    const divisionSummary: Record<string, number> = {};
    const domainSummary: Record<CompetencyDomain, number> = {
      "Statistical Competencies": 0,
      "Technical Competencies": 0,
      "Digital Governance & Data Stewardship": 0,
      "Behavioural & Managerial Competencies": 0,
    };

    for (const div of divisions) {
      let targetedForDivision = 0;

      for (const def of div.topDeficientCompetencies) {
        // Find matching courses for this competency
        const matchedCourses = courses.filter((c) =>
          c.competencies.some((cmp) => cmp.id === def.competencyId)
        );

        for (const course of matchedCourses) {
          const isHighPriority = def.gap >= 0.8;
          const officerEstimate = Math.round(div.totalOfficers * (def.gap / 10));

          batches.push({
            batchId: `ACBP-${year.replace(/[^0-9]/g, "")}-${String(batchCounter++).padStart(3, "0")}`,
            courseId: course.identifier,
            courseTitle: course.name,
            source: course.source,
            targetDomain: def.domain,
            targetCompetencyId: def.competencyId,
            targetCompetencyName: def.competencyName,
            cadreTarget: course.targetAudience,
            recommendedOfficersCount: Math.max(15, officerEstimate),
            targetDivisions: [div.divisionName],
            priority: isHighPriority ? "CRITICAL" : "HIGH",
            estimatedHours: course.durationMinutes / 60,
            scheduleWindow: course.tpacMetadata?.batchSchedule || "Q2-Q3 2026",
          });

          targetedForDivision += Math.max(15, officerEstimate);
          domainSummary[def.domain] = (domainSummary[def.domain] || 0) + Math.max(15, officerEstimate);
        }
      }

      divisionSummary[div.divisionName] = targetedForDivision;
    }

    const totalOfficersTargeted = Object.values(divisionSummary).reduce(
      (acc, count) => acc + count,
      0
    );

    return {
      year,
      title: `Annual Capacity Building Plan (ACBP) ${year} - Ministry of Statistics and Programme Implementation`,
      totalOfficersTargeted,
      totalBatches: batches.length,
      batches,
      generatedAt: new Date().toISOString(),
      summaryByDivision: divisionSummary,
      summaryByDomain: domainSummary,
    };
  }
}

export const repository: DataRepository = new DataRepositoryService();
