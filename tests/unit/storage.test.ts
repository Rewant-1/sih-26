import { describe, it, expect } from '../runner';
import { repository } from '../../src/lib/storage/repository';
import type { CadreId, Quiz, UserProfile, AssessmentRecord } from '../../src/lib/types';

describe('Storage & Repository Layer (Unit)', () => {
  it('retrieves all 29 official competencies across 4 domains from repository', async () => {
    const competencies = await repository.getCompetencies();
    expect(competencies.length).toBe(29);
  });

  it('retrieves competencies partitioned by the 4 official domains', async () => {
    const statComps = await repository.getCompetenciesByDomain('Statistical Competencies');
    const techComps = await repository.getCompetenciesByDomain('Technical Competencies');
    const govComps = await repository.getCompetenciesByDomain('Digital Governance & Data Stewardship');
    const behComps = await repository.getCompetenciesByDomain('Behavioural & Managerial Competencies');

    expect(statComps.length).toBe(8);
    expect(techComps.length).toBe(7);
    expect(govComps.length).toBe(7);
    expect(behComps.length).toBe(7);
  });

  it('verifies all 29 competencies contain complete Level 1 to 5 rubric descriptors', async () => {
    const competencies = await repository.getCompetencies();
    const allHave5Rubrics = competencies.every(c => c.rubrics && c.rubrics.length === 5);
    expect(allHave5Rubrics).toBe(true);
  });

  it('retrieves 29 cadre benchmarks for ISS AD, SSO, and JSO', async () => {
    const cadres: CadreId[] = ['ISS_ASSISTANT_DIRECTOR', 'SENIOR_STATISTICAL_OFFICER', 'JUNIOR_STATISTICAL_OFFICER'];
    for (const cadre of cadres) {
      const bm = await repository.getCadreBenchmarks(cadre);
      expect(bm).toBeDefined();
      expect(Object.keys(bm!.benchmarks).length).toBe(29);
    }
  });

  it('retrieves complete course catalog and filters by source (iGOT vs NSSTA)', async () => {
    const allCourses = await repository.getCourses();
    expect(allCourses.length).toBeGreaterThanOrEqual(20);

    const igotCourses = await repository.getCourses({ source: 'iGOT Karmayogi' });
    const nsstaCourses = await repository.getCourses({ source: 'NSSTA TPAC' });
    expect(igotCourses.length).toBeGreaterThanOrEqual(10);
    expect(nsstaCourses.length).toBeGreaterThanOrEqual(7);
  });

  it('searches course catalog by title keyword query', async () => {
    const searchCourses = await repository.getCourses({ search: 'National Accounts' });
    expect(searchCourses.length).toBeGreaterThan(0);
    expect(searchCourses[0].name).toContain('National Accounts');
  });

  it('loads pre-built seed quizzes from storage', async () => {
    const quizzes = await repository.getQuizzes();
    expect(quizzes.length).toBeGreaterThanOrEqual(3);

    const nssQuiz = await repository.getQuizById('quiz-nss79-listing');
    expect(nssQuiz).toBeDefined();
    expect(nssQuiz?.questions.length).toBe(5);
  });

  it('saves and retrieves dynamic custom quiz instance', async () => {
    const customQuiz: Quiz = {
      id: 'quiz-custom-e2e',
      title: 'E2E Dynamic Assessment Quiz',
      description: 'Testing storage persistence',
      sourceDocumentName: 'unit-test.txt',
      sourceDocumentType: 'TEXT_PASTE',
      detectedDomain: 'Statistical Competencies',
      generatorSource: 'OFFLINE_FALLBACK',
      createdAt: new Date().toISOString(),
      totalQuestions: 1,
      timeLimitMinutes: 5,
      questions: [
        {
          id: 'q-custom-1',
          question: 'What is the rural FSU in NSS?',
          options: ['Census Village', 'UFS Block', 'Household', 'District'],
          correctIndex: 0,
          bloomLevel: 'Remember',
          difficulty: 'easy',
          competencyId: 'STAT_SMPL_01',
          competencyName: 'Sampling Design & Survey Methodology',
          explanation: 'Census village is the rural FSU.',
          referencePassage: 'Rural FSUs are Census villages.'
        }
      ]
    };

    await repository.saveQuiz(customQuiz);
    const fetched = await repository.getQuizById('quiz-custom-e2e');
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe('E2E Dynamic Assessment Quiz');
  });

  it('loads seed user profiles and retrieves Rajesh Kumar (JSO)', async () => {
    const users = await repository.getAllUsers();
    expect(users.length).toBeGreaterThanOrEqual(4);

    const rajesh = await repository.getUserProfile('usr-jso-rajesh');
    expect(rajesh).toBeDefined();
    expect(rajesh?.cadre).toBe('JUNIOR_STATISTICAL_OFFICER');
  });

  it('retrieves aggregate metrics across all 5 MoSPI divisions', async () => {
    const divisions = await repository.getDivisionAggregateData();
    expect(divisions.length).toBe(5);
    const names = divisions.map(d => d.divisionCode);
    expect(names).toContain('FOD');
    expect(names).toContain('ESD');
    expect(names).toContain('NAD');
    expect(names).toContain('DIID');
    expect(names).toContain('SDRD');
  });

  it('generates ACBP capacity building plan for fiscal year 2026-27', async () => {
    const acbp = await repository.getACBPPlan('2026-27');
    expect(acbp.batches.length).toBeGreaterThan(0);
    expect(acbp.totalOfficersTargeted).toBeGreaterThan(0);
  });
}, 'Unit', 'ZERO_CONFIG_STORE');
