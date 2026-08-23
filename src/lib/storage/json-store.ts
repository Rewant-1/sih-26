import type {
  Competency,
  CadreBenchmark,
  CadreId,
  SunbirdCBCourse,
  Quiz,
  UserProfile,
  AssessmentRecord,
  DivisionAggregateMetric,
  QuizAttempt,
} from "../types";

// Import raw JSON seed fixtures
import fracTaxonomyData from "../data/frac-taxonomy.json";
import cadreBenchmarksData from "../data/cadre-benchmarks.json";
import sunbirdCoursesData from "../data/sunbird-courses.json";
import nsstaCoursesData from "../data/nssta-courses.json";
import seedQuizzesData from "../data/seed-quizzes.json";
import seedUsersData from "../data/seed-users.json";
import departmentAnalyticsData from "../data/department-analytics.json";

export class JsonStore {
  private competencies: Competency[];
  private cadreBenchmarks: Record<CadreId, CadreBenchmark>;
  private courses: SunbirdCBCourse[];
  private quizzes: Map<string, Quiz>;
  private users: Map<string, UserProfile>;
  private assessmentRecords: Map<string, AssessmentRecord[]>;
  private quizAttempts: Map<string, QuizAttempt[]>;
  private departmentAnalytics: DivisionAggregateMetric[];

  constructor() {
    this.competencies = (fracTaxonomyData as unknown) as Competency[];
    this.cadreBenchmarks = (cadreBenchmarksData as unknown) as Record<CadreId, CadreBenchmark>;
    
    const igot = (sunbirdCoursesData as unknown) as SunbirdCBCourse[];
    const nssta = (nsstaCoursesData as unknown) as SunbirdCBCourse[];
    this.courses = [...igot, ...nssta];

    this.quizzes = new Map();
    const seedQuizzes = (seedQuizzesData as unknown) as Quiz[];
    for (const q of seedQuizzes) {
      this.quizzes.set(q.id, q);
    }

    this.users = new Map();
    const seedUsers = (seedUsersData as unknown) as UserProfile[];
    for (const u of seedUsers) {
      this.users.set(u.id, u);
    }

    this.assessmentRecords = new Map();
    this.quizAttempts = new Map();
    this.departmentAnalytics = (departmentAnalyticsData as unknown) as DivisionAggregateMetric[];
  }

  public getCompetencies(): Competency[] {
    return [...this.competencies];
  }

  public getCadreBenchmarks(): Record<CadreId, CadreBenchmark> {
    return { ...this.cadreBenchmarks };
  }

  public getCourses(): SunbirdCBCourse[] {
    return [...this.courses];
  }

  public getQuizzes(): Quiz[] {
    return Array.from(this.quizzes.values());
  }

  public getQuizById(id: string): Quiz | null {
    return this.quizzes.get(id) || null;
  }

  public saveQuiz(quiz: Quiz): Quiz {
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  public getUsers(): UserProfile[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): UserProfile | null {
    return this.users.get(id) || null;
  }

  public saveUser(user: UserProfile): UserProfile {
    this.users.set(user.id, user);
    return user;
  }

  public getAssessmentRecords(userId: string): AssessmentRecord[] {
    return this.assessmentRecords.get(userId) || [];
  }

  public saveAssessmentRecord(record: AssessmentRecord): AssessmentRecord {
    const list = this.assessmentRecords.get(record.userId) || [];
    list.unshift(record);
    this.assessmentRecords.set(record.userId, list);

    // Update user profile last assessment info
    const user = this.users.get(record.userId);
    if (user) {
      user.lastAssessmentDate = record.timestamp;
      user.currentAssessmentId = record.assessmentId;
      user.assessedRatings = { ...record.ratings };
      this.users.set(user.id, user);
    }

    return record;
  }

  public getQuizAttempts(userId: string): QuizAttempt[] {
    return this.quizAttempts.get(userId) || [];
  }

  public saveQuizAttempt(attempt: QuizAttempt): QuizAttempt {
    const list = this.quizAttempts.get(attempt.userId) || [];
    list.unshift(attempt);
    this.quizAttempts.set(attempt.userId, list);

    // Update user quiz history
    const user = this.users.get(attempt.userId);
    if (user) {
      if (!user.quizHistoryIds) {
        user.quizHistoryIds = [];
      }
      if (!user.quizHistoryIds.includes(attempt.quizId)) {
        user.quizHistoryIds.push(attempt.quizId);
      }
      this.users.set(user.id, user);
    }

    return attempt;
  }

  public getDepartmentAnalytics(): DivisionAggregateMetric[] {
    return [...this.departmentAnalytics];
  }
}

export const jsonStore = new JsonStore();
