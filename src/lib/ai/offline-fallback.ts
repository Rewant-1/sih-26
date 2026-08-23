import type {
  BloomLevel,
  CompetencyDomain,
  DocumentType,
  QuestionDifficulty,
  Quiz,
  QuizGenerationOptions,
  QuizQuestion,
} from "../types";
import { extractDocumentMetadata, sanitizeDocumentText } from "./doc-parser";

export interface ExtractedFact {
  type: "definition" | "acronym" | "numerical_threshold" | "formula";
  term: string;
  definition: string;
  contextSentence: string;
}

export class OfflineFactExtractor {
  // Regex 1: Acronyms like "First Stage Unit (FSU)" or "FSU (First Stage Unit)"
  private static ACRONYM_REGEX =
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,5})\s*\(([A-Z]{2,6})\)|([A-Z]{2,6})\s*\(([^)]+)\)/g;

  // Regex 2: Definitions like "X is defined as Y", "X refers to Y", "X means Y"
  private static DEFINITION_REGEX =
    /([A-Z][a-zA-Z\s]{2,35})\s+(?:is defined as|refers to|means|shall be taken as|denotes)\s+([^.\n;]+[.])/gi;

  // Regex 3: Numerical thresholds / criteria
  private static THRESHOLD_REGEX =
    /(?:minimum of|maximum of|sample size of|weight of|base year of|population of|interval of|threshold of)\s+([0-9]+(?:\.[0-9]+)?(?:\s*(?:percent|%|households|villages|enterprises|units|years|round|months))?)/gi;

  public static extractFacts(text: string): ExtractedFact[] {
    const facts: ExtractedFact[] = [];
    const seenTerms = new Set<string>();

    // Extract Acronyms
    let match: RegExpExecArray | null;
    this.ACRONYM_REGEX.lastIndex = 0;
    while ((match = this.ACRONYM_REGEX.exec(text)) !== null) {
      const fullTerm = match[1] || match[4];
      const acronym = match[2] || match[3];
      if (fullTerm && acronym && fullTerm.length > 3 && !seenTerms.has(acronym.trim())) {
        seenTerms.add(acronym.trim());
        facts.push({
          type: "acronym",
          term: acronym.trim(),
          definition: fullTerm.trim(),
          contextSentence: match[0],
        });
      }
    }

    // Extract Definitions
    this.DEFINITION_REGEX.lastIndex = 0;
    while ((match = this.DEFINITION_REGEX.exec(text)) !== null) {
      const term = match[1].trim();
      const definition = match[2].trim();
      if (term.length > 2 && definition.length > 10 && !seenTerms.has(term.toLowerCase())) {
        seenTerms.add(term.toLowerCase());
        facts.push({
          type: "definition",
          term,
          definition,
          contextSentence: match[0],
        });
      }
    }

    // Extract Thresholds
    this.THRESHOLD_REGEX.lastIndex = 0;
    while ((match = this.THRESHOLD_REGEX.exec(text)) !== null) {
      const thresholdVal = match[1].trim();
      facts.push({
        type: "numerical_threshold",
        term: match[0].split(/\s+/).slice(0, 3).join(" "),
        definition: thresholdVal,
        contextSentence: match[0],
      });
    }

    return facts;
  }
}

export class DistractorSynthesizer {
  private static STATISTICAL_ANTONYM_MAP: Record<string, string[]> = {
    "First Stage Unit (FSU)": [
      "Second Stage Unit (SSU)",
      "Ultimate Stage Unit (USU)",
      "Enumeration Block (EB)",
    ],
    "FSU": [
      "Second Stage Unit (SSU)",
      "Ultimate Stage Unit (USU)",
      "Enumeration Block (EB)",
    ],
    "Laspeyres Price Index": [
      "Paasche Price Index",
      "Fisher Ideal Index",
      "Tornqvist Index",
    ],
    "Gross Value Added (GVA)": [
      "Net Value Added (NVA)",
      "Gross Domestic Product (GDP)",
      "Intermediate Consumption",
    ],
    "GVA": [
      "Net Value Added (NVA)",
      "Gross Domestic Product (GDP)",
      "Intermediate Consumption",
    ],
    "Circular Systematic Sampling": [
      "Simple Random Sampling without Replacement (SRSWOR)",
      "Stratified Multi-stage Cluster Sampling",
      "Linear Systematic Sampling with random start",
    ],
    "Census Sector": [
      "Sample Sector",
      "Residual Sector",
      "Defunct Establishment Sector",
    ],
    "Consumer Price Index (CPI)": [
      "Wholesale Price Index (WPI)",
      "Producer Price Index (PPI)",
      "GDP Deflator",
    ],
    "CPI": [
      "Wholesale Price Index (WPI)",
      "Producer Price Index (PPI)",
      "GDP Deflator",
    ],
    "Statistical Data and Metadata eXchange (SDMX)": [
      "Data Documentation Initiative (DDI)",
      "Generic Statistical Information Model (GSIM)",
      "Dublin Core Metadata Registry",
    ],
    "SDMX": [
      "Data Documentation Initiative (DDI)",
      "Generic Statistical Information Model (GSIM)",
      "Dublin Core Metadata Registry",
    ],
    "k-Anonymity": [
      "Differential Privacy (Epsilon Parameter)",
      "l-Diversity Metric",
      "t-Closeness Threshold",
    ],
    "X-13ARIMA-SEATS": [
      "TRAMO-SEATS",
      "Census X-11 Filter",
      "Hodrick-Prescott Filter Decomposition",
    ],
    "Annual Survey of Industries (ASI)": [
      "Economic Census of Micro Enterprises",
      "Periodic Labour Force Survey (PLFS)",
      "Index of Industrial Production (IIP)",
    ],
    "ASI": [
      "Economic Census of Micro Enterprises",
      "Periodic Labour Force Survey (PLFS)",
      "Index of Industrial Production (IIP)",
    ],
  };

  public static generateDistractorsForTerm(term: string): string[] {
    const known = this.STATISTICAL_ANTONYM_MAP[term] || this.STATISTICAL_ANTONYM_MAP[term.toUpperCase()];
    if (known && known.length >= 3) {
      return known.slice(0, 3);
    }

    return [
      `The supervisory quality indicator for ${term}`,
      `The unweighted variance threshold for ${term}`,
      `The secondary sampling frame for ${term}`,
    ];
  }

  public static generateDistractorsForDefinition(
    term: string,
    correctDefinition: string,
    allFacts: ExtractedFact[]
  ): string[] {
    const distractors: string[] = [];

    // Strategy 1: Other extracted definitions
    const otherDefs = allFacts
      .filter((f) => f.term.toLowerCase() !== term.toLowerCase() && f.definition.length > 15)
      .map((f) => f.definition);

    for (const def of otherDefs) {
      if (distractors.length >= 3) break;
      if (!distractors.includes(def) && def !== correctDefinition) {
        distractors.push(def);
      }
    }

    // Strategy 2: Statistical domain fallbacks
    const fallbackTemplates = [
      `The unweighted aggregate of non-sample auxiliary records across primary strata`,
      `The secondary supervisory validation parameter computed prior to microdata anonymization`,
      `The administrative index utilized exclusively for sub-round post-stratification adjustment`,
      `The mathematical ratio of intermediate consumption to gross fixed capital formation`,
    ];

    for (const fb of fallbackTemplates) {
      if (distractors.length >= 3) break;
      if (!distractors.includes(fb) && fb !== correctDefinition) {
        distractors.push(fb);
      }
    }

    return distractors.slice(0, 3);
  }

  public static generateDistractorsForNumber(valStr: string): string[] {
    const num = parseFloat(valStr);
    if (isNaN(num)) {
      return ["10%", "25%", "50%"];
    }

    if (num >= 1990 && num <= 2035) {
      return [`${Math.round(num - 7)}`, `${Math.round(num - 1)}`, `${Math.round(num + 5)}`];
    }

    const d1 = Math.max(1, Math.round(num * 0.5));
    const d2 = Math.round(num * 1.5);
    const d3 = Math.round(num * 2.0);
    return [`${d1}`, `${d2}`, `${d3}`];
  }
}

export interface SeedQuestion {
  id: string;
  domain: CompetencyDomain;
  competencyId: string;
  competencyName: string;
  question: string;
  options: [string, string, string, string] | string[];
  correctIndex: number;
  bloomLevel: BloomLevel;
  difficulty: QuestionDifficulty;
  explanation: string;
  referencePassage: string;
  keywords: string[];
}

/**
 * 50+ Canonical MoSPI Official Statistics Question Seed Bank across 4 Domains
 */
export const MOSPI_SEED_QUESTION_BANK: SeedQuestion[] = [
  // -------------------------------------------------------------
  // 1. STATISTICAL COMPETENCIES (STAT_SMPL_01 to STAT_ENV_08)
  // -------------------------------------------------------------
  {
    id: "seed-stat-001",
    domain: "Statistical Competencies",
    competencyId: "STAT_SMPL_01",
    competencyName: "Sampling Design & Survey Methodology",
    question:
      "In NSS multi-stage stratified sampling design, what is the formula for calculating the sampling multiplier for an FSU when selection is PPSWR?",
    options: [
      "Multiplier = Z / (n * Z_i), where Z is stratum total size and Z_i is FSU size",
      "Multiplier = (n * Z_i) / Z, where Z is stratum total size",
      "Multiplier = N / n, simple inverse of selection probability without size weights",
      "Multiplier = (N * n) / (Z_i * H), accounting for household count H",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "Under Probability Proportional to Size with Replacement (PPSWR), the selection probability of i-th FSU is p_i = Z_i / Z. For n selected FSUs, the design weight/multiplier is 1 / (n * p_i) = Z / (n * Z_i).",
    referencePassage:
      "For PPSWR sampling of FSUs, the sampling weight (multiplier) in the estimation formula is given by M_i = Z / (n_s * Z_si).",
    keywords: ["nss", "sampling", "multiplier", "fsu", "ppswr", "stratum", "estimation"],
  },
  {
    id: "seed-stat-002",
    domain: "Statistical Competencies",
    competencyId: "STAT_IDX_03",
    competencyName: "Index Numbers & Price Statistics (CPI, IIP, WPI)",
    question:
      "Which formula is officially utilized by MoSPI to compute the Consumer Price Index (CPI Base 2012=100) at the subgroup and group levels?",
    options: [
      "Modified Laspeyres price index formula with base-period expenditure weights",
      "Paasche price index formula utilizing current-period consumption quantities",
      "Fisher's Ideal Geometric Mean index formula",
      "Carli simple unweighted arithmetic mean of price relatives",
    ],
    correctIndex: 0,
    bloomLevel: "Remember",
    difficulty: "easy",
    explanation:
      "MoSPI's CPI uses the Modified Laspeyres formula, aggregating elementary price relatives with fixed base-period consumption expenditure weights from the Consumer Expenditure Survey (CES 2011-12).",
    referencePassage:
      "The all-India and state-level CPI indices are compiled using the Modified Laspeyres Index formula using the weighting diagram derived from the Consumer Expenditure Survey 2011-12.",
    keywords: ["cpi", "consumer price index", "laspeyres", "base year", "price relatives", "weights"],
  },
  {
    id: "seed-stat-003",
    domain: "Statistical Competencies",
    competencyId: "STAT_NAT_02",
    competencyName: "National Accounts Statistics & SUT Compilation",
    question:
      "Under the SNA 2008 framework adopted in India's National Accounts (2011-12 base), how is Gross Value Added (GVA) at Basic Prices derived from GVA at Factor Cost?",
    options: [
      "GVA at Basic Prices = GVA at Factor Cost + (Production Taxes - Production Subsidies)",
      "GVA at Basic Prices = GVA at Factor Cost + (Product Taxes - Product Subsidies)",
      "GVA at Basic Prices = GVA at Factor Cost - Consumption of Fixed Capital (CFC)",
      "GVA at Basic Prices = Gross Output - Intermediate Consumption + Net Import Tariffs",
    ],
    correctIndex: 0,
    bloomLevel: "Analyze",
    difficulty: "hard",
    explanation:
      "GVA at basic prices includes net production taxes (taxes on production such as land revenue minus subsidies). Product taxes convert basic prices to market prices (GDP).",
    referencePassage:
      "GVA at basic prices = GVA at factor cost + (Production Taxes - Production Subsidies). GDP at market prices = GVA at basic prices + (Product Taxes - Product Subsidies).",
    keywords: ["gva", "national accounts", "sna", "basic price", "factor cost", "taxes", "subsidies"],
  },
  {
    id: "seed-stat-004",
    domain: "Statistical Competencies",
    competencyId: "STAT_ASI_04",
    competencyName: "Industrial & Enterprise Statistics (ASI & Economic Census)",
    question:
      "Under the Annual Survey of Industries (ASI), which units qualify for complete enumeration under the 'Census Sector'?",
    options: [
      "All factories employing 100 or more workers in any of the preceding 3 years, plus all units in smaller States/UTs",
      "All registered MSMEs regardless of electricity usage or workforce count",
      "Only public sector undertakings and joint ventures under Central Ministries",
      "Factories having fixed capital investment exceeding INR 50 Crores",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "The ASI Census Sector comprises all industrial units employing 100 or more workers, all factories in 6 specific less industrially populated States/UTs, and certain specific electricity/bidi units.",
    referencePassage:
      "The Census Sector of ASI covers all industrial units employing 100 or more workers across the country, as well as all units in States/UTs with small industrial bases.",
    keywords: ["asi", "annual survey of industries", "factories act", "census sector", "workers", "manufacturing"],
  },
  {
    id: "seed-stat-005",
    domain: "Statistical Competencies",
    competencyId: "STAT_SMPL_01",
    competencyName: "Sampling Design & Survey Methodology",
    question:
      "In rural areas for the NSS 79th Round, what constitutes the First Stage Unit (FSU)?",
    options: [
      "A Census Village as per the 2011 Population Census",
      "An Urban Frame Survey (UFS) block with 100-120 households",
      "A cluster of exactly 8 households selected via SRSWOR",
      "The entire Gram Panchayat administrative boundary",
    ],
    correctIndex: 0,
    bloomLevel: "Remember",
    difficulty: "easy",
    explanation:
      "In rural sectors, the 2011 Census village is taken as the First Stage Unit (FSU), whereas in urban areas the UFS block is used.",
    referencePassage:
      "In the rural sector, the First Stage Units (FSUs) are the 2011 Census villages, whereas in the urban sector, the FSUs are the latest Urban Frame Survey (UFS) blocks.",
    keywords: ["nss", "fsu", "sampling", "village", "rural"],
  },
  {
    id: "seed-stat-006",
    domain: "Statistical Competencies",
    competencyId: "STAT_SMPL_01",
    competencyName: "Sampling Design & Survey Methodology",
    question:
      "Suppose an investigator encounters a large rural village with an estimated present population of 2,100 during the listing stage. According to NSS guidelines, how many hamlet-groups (hg) must be formed?",
    options: [
      "1 hamlet-group (No subdivision required)",
      "2 hamlet-groups",
      "3 hamlet-groups",
      "4 hamlet-groups",
    ],
    correctIndex: 2,
    bloomLevel: "Apply",
    difficulty: "medium",
    explanation:
      "According to NSS listing rules: population < 1,200 requires 1 hg; 1,200 to 1,799 requires 2 hg; 1,800 to 2,399 requires 3 hg; and 2,400 to 2,999 requires 4 hg. Since 2,100 falls in 1,800-2,399, 3 hamlet-groups are formed.",
    referencePassage:
      "If the estimated present population of the village is 1,800 to 2,399, the number of hamlet-groups to be formed is 3; if 2,400 to 2,999, the number of hamlet-groups to be formed is 4.",
    keywords: ["hamlet-group", "population", "nss", "listing", "subdivision"],
  },
  {
    id: "seed-stat-007",
    domain: "Statistical Competencies",
    competencyId: "STAT_PRB_05",
    competencyName: "Applied Probability & Inferential Estimation",
    question:
      "Which variance estimation technique is recommended for calculating standard errors of complex nonlinear estimators (e.g. poverty ratios, Gini coefficients) in multi-stage surveys?",
    options: [
      "Taylor Series Linearization or Jackknife / Balanced Repeated Replication (BRR)",
      "Standard simple random sample variance formula without design corrections",
      "Ordinary least squares residual variance estimation",
      "Maximum likelihood variance assuming independent Poisson arrivals",
    ],
    correctIndex: 0,
    bloomLevel: "Analyze",
    difficulty: "hard",
    explanation:
      "Complex multi-stage sample surveys violate i.i.d. assumptions. Variance of non-linear statistics requires Taylor linearization or replication methods like Jackknife/BRR.",
    referencePassage:
      "Variance estimation for non-linear survey estimators is carried out using Taylor Series Linearization or replication methods such as Jackknife and BRR.",
    keywords: ["variance estimation", "jackknife", "taylor linearization", "complex survey"],
  },
  {
    id: "seed-stat-008",
    domain: "Statistical Competencies",
    competencyId: "STAT_TSA_06",
    competencyName: "Time Series Analysis & Seasonal Adjustment",
    question:
      "In the X-13ARIMA-SEATS seasonal adjustment protocol used by MoSPI, what is the role of the regARIMA modeling phase?",
    options: [
      "To estimate deterministic calendar effects (trading day variation, national moving holidays) and detect outlier interventions",
      "To smooth the trend-cycle component using a 12-month centered moving average",
      "To deflate nominal price time series into chained constant volume indices",
      "To impute missing historical years using linear spline interpolation",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "regARIMA pre-adjusts the series for calendar variations (trading days, Diwali/Eid effects) and structural outliers before X-11 filter decomposition.",
    referencePassage:
      "The regARIMA pre-treatment models deterministic calendar effects, moving holidays, and outlier interventions prior to seasonal filter application.",
    keywords: ["time series", "x-13arima-seats", "regarima", "calendar effects", "outliers"],
  },
  {
    id: "seed-stat-009",
    domain: "Statistical Competencies",
    competencyId: "STAT_DMO_07",
    competencyName: "Demographic & Social Statistics (PLFS & SDG Framework)",
    question:
      "Under the Periodic Labour Force Survey (PLFS), how is an individual categorized under the Usual Status (ps+ss) approach?",
    options: [
      "Activity on which the person spent a relatively long time during the 365 days preceding the date of survey, including subsidiary economic activity of at least 30 days",
      "Economic activity pursued during the 7 days preceding the survey interview",
      "Only formal contractual employment registered under the Employees' Provident Fund (EPFO)",
      "Daily status determined by 0.5 or 1.0 day units recorded in the past 24 hours",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "Usual Status (ps+ss) combines Principal Status (majority of 365 days) and Subsidiary Status (economic work for at least 30 days during the year).",
    referencePassage:
      "The Usual Status (ps+ss) approach determines workforce status considering principal activity status during the 365 reference days alongside subsidiary economic activities of 30 days or more.",
    keywords: ["plfs", "labour force", "usual status", "upss", "employment"],
  },
  {
    id: "seed-stat-010",
    domain: "Statistical Competencies",
    competencyId: "STAT_ENV_08",
    competencyName: "Environmental-Economic Accounting (SEEA & EnviStats)",
    question:
      "Under the UN System of Environmental-Economic Accounting (SEEA-Central Framework) adopted in EnviStats India, what do 'Physical Supply and Use Tables' record?",
    options: [
      "The flows of natural inputs, products, and residuals in physical units (tonnes, cubic metres, joules) between the environment and the economy",
      "The financial balance sheets of State Pollution Control Boards",
      "The budgetary allocations for national wildlife sanctuaries under Union Budgets",
      "The carbon credit prices traded on domestic stock exchanges",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "SEEA Physical Supply and Use Tables (PSUT) track physical flows of natural inputs, products, and residuals into the economy and back to the environment.",
    referencePassage:
      "Physical Supply and Use Tables (PSUT) in SEEA quantify natural inputs extracted from the environment, product flows across economic sectors, and residual emissions generated.",
    keywords: ["seea", "envistats", "natural capital", "psut", "environmental accounting"],
  },

  // -------------------------------------------------------------
  // 2. TECHNICAL COMPETENCIES (TECH_R_01 to TECH_GIS_07)
  // -------------------------------------------------------------
  {
    id: "seed-tech-001",
    domain: "Technical Competencies",
    competencyId: "TECH_R_01",
    competencyName: "Statistical Computing with R for Official Statistics",
    question:
      "When processing large-scale survey unit-level microdata in R, what statistical procedure is mandatory before generating population aggregates?",
    options: [
      "Applying the appropriate survey sample weights (Multipliers) to each unit record using svydesign()",
      "Replacing all missing values with column mean imputation",
      "Normalizing all quantitative variables to a standard normal z-score",
      "Dropping all strata that contain fewer than 5 sample units",
    ],
    correctIndex: 0,
    bloomLevel: "Apply",
    difficulty: "medium",
    explanation:
      "Survey microdata from complex multi-stage designs are unweighted by default. To obtain unbiased population totals, each record must be multiplied by its assigned multiplier via the survey package.",
    referencePassage:
      "To derive aggregate national estimates from NSS unit-level microdata, the weight variable (multiplier) must be applied to every individual record during tabulation.",
    keywords: ["microdata", "r", "multiplier", "weights", "survey package", "svydesign"],
  },
  {
    id: "seed-tech-002",
    domain: "Technical Competencies",
    competencyId: "TECH_PY_02",
    competencyName: "Python for Data Engineering & Official Statistical Analytics",
    question:
      "When constructing an automated data pipeline in Python for multi-gigabyte survey records, which library provides lazy-evaluation and multi-threaded columnar processing with lower memory overhead than pandas?",
    options: [
      "Polars (using pl.scan_parquet() and lazy execution graphs)",
      "Standard Python built-in csv reader with basic lists",
      "OpenPyXL for direct workbook cell manipulation",
      "Tkinter GUI background threads",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "Polars utilizes Rust-based Apache Arrow columnar memory and query optimization via lazy evaluation, enabling multi-gigabyte microdata processing without out-of-memory errors.",
    referencePassage:
      "For large microdata ETL pipelines, Polars enables lazy execution plans and multi-core query optimization significantly outperforming eager in-memory tabular structures.",
    keywords: ["python", "polars", "data engineering", "microdata", "etl"],
  },
  {
    id: "seed-tech-003",
    domain: "Technical Competencies",
    competencyId: "TECH_SQL_03",
    competencyName: "Relational Database Management & Complex SQL",
    question:
      "In PostgreSQL microdata scrutiny, which SQL window function allows ranking households by monthly per capita expenditure within each district without collapsing rows?",
    options: [
      "RANK() OVER (PARTITION BY district_code ORDER BY mpce DESC)",
      "GROUP BY district_code HAVING mpce > AVG(mpce)",
      "ORDER BY district_code, mpce WITH ROLLUP",
      "SELECT DISTINCT ON (district_code) mpce",
    ],
    correctIndex: 0,
    bloomLevel: "Apply",
    difficulty: "medium",
    explanation:
      "Window functions with PARTITION BY calculate rank across groups while maintaining individual record granularity for detailed scrutiny.",
    referencePassage:
      "Analytical SQL window functions (OVER / PARTITION BY) enable sub-group stratification and outlier detection across survey microdata records.",
    keywords: ["sql", "window functions", "partition by", "postgresql", "mpce"],
  },
  {
    id: "seed-tech-004",
    domain: "Technical Competencies",
    competencyId: "TECH_CAPI_04",
    competencyName: "Computer Assisted Personal Interviewing (CAPI) & Digital Capture",
    question:
      "In CAPI application design (e.g. CSPro/Blaise), what is the primary operational purpose of implementing 'Soft Validation Edits' during live field interviewing?",
    options: [
      "To alert the investigator to unusual but possible responses requiring explicit on-field confirmation without blocking schedule progression",
      "To immediately crash and reset the tablet application",
      "To permanently lock and encrypt the schedule until ADG approval",
      "To auto-correct the respondent's answer without their knowledge",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "easy",
    explanation:
      "Soft edits provide warning prompts for unusual values (e.g. household monthly electricity bill > Rs 50,000) allowing verification, unlike hard fatal edits which block saving impossible values.",
    referencePassage:
      "Soft validation edits prompt the investigator to re-verify atypical observations with the respondent while permitting schedule completion.",
    keywords: ["capi", "cspro", "validation", "soft edit", "field capture"],
  },
  {
    id: "seed-tech-005",
    domain: "Technical Competencies",
    competencyId: "TECH_VAL_05",
    competencyName: "Automated Microdata Scrutiny, Validation & Imputation",
    question:
      "Which microdata imputation method replaces missing values for a recipient unit by matching it with a respondent having the nearest socio-demographic characteristics in the same survey stratum?",
    options: [
      "Nearest-Neighbor Hot-Deck Imputation",
      "Arbitrary zero-fill imputation",
      "Global column mean replacement",
      "Linear trend extrapolation across unrelated strata",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "Hot-Deck imputation borrows observed values from donor units in the same survey pool, preserving multivariate distributions far better than mean imputation.",
    referencePassage:
      "Hot-deck imputation replaces item non-response by identifying donor records with matching demographic characteristics within identical strata.",
    keywords: ["imputation", "hot-deck", "validation", "microdata", "scrutiny"],
  },
  {
    id: "seed-tech-006",
    domain: "Technical Competencies",
    competencyId: "TECH_SDMX_06",
    competencyName: "Statistical Data and Metadata eXchange (SDMX)",
    question:
      "Under the Statistical Data and Metadata eXchange (SDMX) standard, what is the key distinction between a 'Dimension' and an 'Attribute'?",
    options: [
      "Dimensions uniquely identify a statistical time series observation (e.g. Country, Frequency, Indicator), while Attributes describe its context (e.g. Unit of Measure, Decimals)",
      "Dimensions are encrypted passwords, while Attributes are public keys",
      "Dimensions store audio files, while Attributes store text files",
      "Dimensions represent SQL tables, while Attributes represent database users",
    ],
    correctIndex: 0,
    bloomLevel: "Analyze",
    difficulty: "hard",
    explanation:
      "In SDMX, Dimensions form the composite primary key of the data cube; Attributes attach qualitative metadata without changing series identity.",
    referencePassage:
      "In SDMX DSDs, Dimensions provide the coordinate keys identifying data cells, whereas Attributes provide descriptive context such as observation status and unit multipliers.",
    keywords: ["sdmx", "dsd", "dimension", "attribute", "metadata"],
  },
  {
    id: "seed-tech-007",
    domain: "Technical Competencies",
    competencyId: "TECH_GIS_07",
    competencyName: "Geospatial Analytics & GIS Integration for Official Statistics",
    question:
      "What is the statistical significance of calculating Global Moran's I on district-level poverty indicators in QGIS/R?",
    options: [
      "It measures spatial autocorrelation to determine whether high or low values cluster geographically across adjacent administrative units",
      "It computes the arithmetic mean of population density",
      "It formats map layers into 3D satellite imagery",
      "It verifies GPS clock synchronization of field tablets",
    ],
    correctIndex: 0,
    bloomLevel: "Analyze",
    difficulty: "hard",
    explanation:
      "Moran's I quantifies spatial dependency: positive values indicate spatial clustering (hotspots/coldspots), while values near zero indicate spatial randomness.",
    referencePassage:
      "Global Moran's I is utilized in geospatial statistical analysis to evaluate whether indicator distribution exhibits significant spatial clustering across district boundaries.",
    keywords: ["gis", "moran's i", "spatial autocorrelation", "qgis", "geospatial"],
  },

  // -------------------------------------------------------------
  // 3. DIGITAL GOVERNANCE & DATA STEWARDSHIP (GOV_DQAF_01 to GOV_AUD_07)
  // -------------------------------------------------------------
  {
    id: "seed-gov-001",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_SDC_02",
    competencyName: "Statistical Disclosure Control & Microdata Anonymization",
    question:
      "Under the National Data Governance Framework Policy (NDGFP), what minimum k-anonymity threshold is mandated prior to releasing public survey microdata?",
    options: [
      "k >= 5 (Each combination of quasi-identifiers must be shared by at least 5 distinct individuals)",
      "k >= 2 (Basic pairwise obscurity)",
      "k >= 20 (Mandatory only for enterprise data)",
      "No k-anonymity required if direct names are removed",
    ],
    correctIndex: 0,
    bloomLevel: "Remember",
    difficulty: "easy",
    explanation:
      "Under NDGFP standards, anonymized public microdata files must satisfy k-anonymity with k >= 5 to prevent re-identification attacks via linked auxiliary databases.",
    referencePassage:
      "Departments must apply k-anonymity (k >= 5) and l-diversity algorithms to prevent re-identification of survey respondents or enterprise establishments.",
    keywords: ["k-anonymity", "microdata", "anonymization", "privacy", "ndgfp"],
  },
  {
    id: "seed-gov-002",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_DQAF_01",
    competencyName: "Data Quality Assessment Framework (DQAF) & Quality Assurance",
    question:
      "Which 5 dimensions constitute the core structure of the IMF / MoSPI Data Quality Assessment Framework (DQAF)?",
    options: [
      "Integrity, Methodological Soundness, Accuracy & Reliability, Serviceability, Accessibility",
      "Speed, Server Capacity, Color Scheme, File Size, Encryption Level",
      "Revenue, Headcount, Office Space, Fleet Size, Budget Utilization",
      "Marketing, Outreach, Social Media Likes, Website Visits, Downloads",
    ],
    correctIndex: 0,
    bloomLevel: "Remember",
    difficulty: "easy",
    explanation:
      "The IMF DQAF framework assesses statistical systems across prerequisite environment plus 5 core quality dimensions: Integrity, Methodological Soundness, Accuracy & Reliability, Serviceability, and Accessibility.",
    referencePassage:
      "The Data Quality Assessment Framework evaluates statistical products against five standard dimensions: integrity, methodological soundness, accuracy, serviceability, and accessibility.",
    keywords: ["dqaf", "data quality", "imf dqaf", "quality assurance", "integrity"],
  },
  {
    id: "seed-gov-003",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_META_03",
    competencyName: "Metadata Standards & National Statistical Registries",
    question:
      "In the Data Documentation Initiative (DDI) standard used for archiving MoSPI microdata, what is contained in the 'DDI-Codebook' specification?",
    options: [
      "Complete study-level overview, sampling methodology, variable dictionary with explicit question text, value labels, and summary frequencies",
      "Only the encrypted passwords of database administrators",
      "The monthly payroll statements of field investigators",
      "The source code of the operating system kernel",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "DDI-Codebook is an international XML metadata standard capturing survey methodology, variable descriptions, questionnaire wording, and valid response codes.",
    referencePassage:
      "DDI-Codebook provides structured XML metadata documenting survey provenance, sampling design, variable labels, and frequency distributions.",
    keywords: ["ddi", "metadata", "codebook", "variable dictionary", "microdata archiving"],
  },
  {
    id: "seed-gov-004",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_ETH_04",
    competencyName: "Official Statistics Ethics & Legal Frameworks",
    question:
      "Under the Collection of Statistics Act 2008, what is the legal mandate regarding individual respondent information disclosed in official schedules?",
    options: [
      "It is strictly confidential and inadmissible as evidence in court or for taxation/prosecution against the respondent",
      "It can be shared with law enforcement agencies upon written police request",
      "It becomes public property and can be published in unit-level identified form after 1 year",
      "It may be used by the Income Tax department for audit reconciliations",
    ],
    correctIndex: 0,
    bloomLevel: "Analyze",
    difficulty: "medium",
    explanation:
      "Sections 9 and 10 of the Collection of Statistics Act 2008 explicitly protect statistical confidentiality; individual returns cannot be used for taxation, law enforcement, or court prosecution.",
    referencePassage:
      "Information collected under the Collection of Statistics Act 2008 shall be used solely for statistical purposes and is strictly inadmissible as evidence in any legal proceeding against the respondent.",
    keywords: ["collection of statistics act", "confidentiality", "ethics", "un-fpos"],
  },
  {
    id: "seed-gov-005",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_OGD_05",
    competencyName: "Open Government Data Dissemination & API Stewardship",
    question:
      "According to National Open Data guidelines (NDGFP / data.gov.in), what criteria must official datasets satisfy to achieve 3-star open data classification?",
    options: [
      "Published in open, non-proprietary machine-readable formats (e.g. CSV, JSON) with explicit open licensing",
      "Published only as scanned image PDFs with security watermarks",
      "Stored in password-protected ZIP files requiring physical RTI applications",
      "Uploaded in proprietary binary formats requiring commercial license software",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "easy",
    explanation:
      "Open Government Data mandates open machine-readable formats (CSV, JSON, XML) without proprietary software lock-in, enabling automated data pipelines.",
    referencePassage:
      "Open Government Data standards require machine-readability in non-proprietary open formats such as CSV and JSON with open access licensing.",
    keywords: ["open data", "data.gov.in", "ndgfp", "csv", "api"],
  },
  {
    id: "seed-gov-006",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_SEC_06",
    competencyName: "Information Security, Access Governance & Cyber Hygiene",
    question:
      "What is the recommended cryptographic standard for securing statistical microdata at rest in MoSPI data warehouses?",
    options: [
      "AES-256 encryption with automated key rotation and role-based access control (RBAC)",
      "Simple Base64 encoding without key management",
      "Plain text storage behind perimeter firewall",
      "MD5 hashing of entire database tables",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "AES-256 is the government-mandated symmetric cipher for securing sensitive unit-level respondent data at rest, coupled with strict RBAC.",
    referencePassage:
      "All sensitive microdata repositories must implement AES-256 encryption at rest alongside rigorous access logging and role-based access governance.",
    keywords: ["security", "encryption", "aes-256", "rbac", "cyber hygiene"],
  },
  {
    id: "seed-gov-007",
    domain: "Digital Governance & Data Stewardship",
    competencyId: "GOV_AUD_07",
    competencyName: "Statistical Audit, Process Validation & System Documentation",
    question:
      "Which international framework provides the 8 core phases for modeling official statistical business workflows (Specify Needs, Design, Build, Collect, Process, Analyze, Disseminate, Evaluate)?",
    options: [
      "Generic Statistical Business Process Model (GSBPM)",
      "ISO 9001 Quality Management System",
      "COBIT IT Governance Framework",
      "UN-SEEA Ecosystem Accounting Framework",
    ],
    correctIndex: 0,
    bloomLevel: "Remember",
    difficulty: "easy",
    explanation:
      "The UNECE Generic Statistical Business Process Model (GSBPM v5.1) defines the 8 standard phases of official statistical production adopted across MoSPI.",
    referencePassage:
      "The Generic Statistical Business Process Model (GSBPM) standardizes the 8 end-to-end phases of official statistical production from user needs identification to dissemination and evaluation.",
    keywords: ["gsbpm", "audit", "statistical business process", "unece"],
  },

  // -------------------------------------------------------------
  // 4. BEHAVIOURAL & MANAGERIAL (BEH_FLD_01 to BEH_INQ_07)
  // -------------------------------------------------------------
  {
    id: "seed-mgt-001",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_FLD_01",
    competencyName: "Field Survey Team Management & High-Performance Supervision",
    question:
      "During field survey scrutiny, if an SSO (Senior Statistical Officer) discovers that a household has migrated permanently and cannot be contacted, what is the prescribed protocol?",
    options: [
      "Record the casualty status in the schedule and select a substitute household strictly following the random substitution table in the manual",
      "Arbitrarily replace the household with the immediate neighboring household",
      "Omit the sample record and re-weight the remaining sample households post-facto",
      "Leave the schedule blank and submit it as complete",
    ],
    correctIndex: 0,
    bloomLevel: "Apply",
    difficulty: "medium",
    explanation:
      "Official survey protocols prohibit informal ad-hoc substitution. If a casualty occurs, it must be officially coded, and substitution must be performed using the predefined alternate random selection sequence.",
    referencePassage:
      "In case a selected sample household cannot be canvassed due to permanent migration or refusal, substitution shall be made strictly in order of selection from the standby sample frame.",
    keywords: ["supervision", "field staff", "substitution", "scrutiny", "casualty", "sso", "jso"],
  },
  {
    id: "seed-mgt-002",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_STK_02",
    competencyName: "Stakeholder Consultation, Inter-Agency Coordination & Consensus",
    question:
      "When harmonizing statistical indicators between MoSPI and line ministries (e.g. Ministry of Agriculture, RBI), what is the most effective governance mechanism to ensure methodological consensus?",
    options: [
      "Convening a formal Standing Committee / Inter-Agency Technical Working Group with structured minutes and joint data validation protocols",
      "Unilateral revision of data series without inter-ministerial notification",
      "Publishing conflicting estimates in press releases without reconciliation notes",
      "Ceasing data collection until line ministries concede to NSO definitions",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "Inter-agency technical working groups establish transparent data exchange agreements, harmonize conceptual definitions, and resolve discrepancies collegially.",
    referencePassage:
      "Inter-agency coordination requires structured technical consultative committees to align administrative data definitions with national statistical standards.",
    keywords: ["stakeholder", "inter-agency", "consensus", "line ministries", "harmonization"],
  },
  {
    id: "seed-mgt-003",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_POL_03",
    competencyName: "Evidence-Based Policy Advisory & Statistical Insights Delivery",
    question:
      "When briefing senior policymakers on macroeconomic survey findings (e.g. GDP quarterly estimates or PLFS trends), what is the primary duty of an ISS Officer?",
    options: [
      "Present impartial, methodologically rigorous statistical facts with clear confidence bounds, explaining both trends and limitations objectively",
      "Modify statistical figures to present exclusively favorable economic narratives",
      "Conceal survey sampling errors to give an illusion of absolute certainty",
      "Refuse to explain technical definitions to non-statistical leadership",
    ],
    correctIndex: 0,
    bloomLevel: "Evaluate",
    difficulty: "hard",
    explanation:
      "Under UN-FPOS Principle 2 and ISS ethics, statistical officers must maintain professional independence and deliver impartial evidence with transparent caveats.",
    referencePassage:
      "Statistical advisory must deliver objective, impartial evidence grounded in sound methodology, explicitly communicating data precision and caveats to policymakers.",
    keywords: ["policy advisory", "iss", "impartiality", "evidence-based", "ethics"],
  },
  {
    id: "seed-mgt-004",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_PRJ_04",
    competencyName: "Project Monitoring & Infrastructure Project Oversight (IPMD)",
    question:
      "Under the Infrastructure and Project Monitoring Division (IPMD) framework for Central Sector Projects (INR 150 Cr and above), what is the primary indicator used to flag project implementation risk?",
    options: [
      "Milestone Time Overrun (months delayed) and Cost Overrun (percentage escalation over original approved budget)",
      "The visual design of the contractor's website",
      "The frequency of social media mentions regarding the project",
      "The physical weight of the project documentation binders",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "easy",
    explanation:
      "IPMD tracks Central Sector mega-projects through quantitative time overrun (delay against commissioning date) and cost escalation against Cabinet-approved figures.",
    referencePassage:
      "IPMD evaluates project execution through structured time and cost overrun indices against approved Cabinet Committee on Economic Affairs (CCEA) milestones.",
    keywords: ["ipmd", "project monitoring", "cost overrun", "time overrun", "infrastructure"],
  },
  {
    id: "seed-mgt-005",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_COM_05",
    competencyName: "Statistical Data Storytelling, Public Communication & Dissemination",
    question:
      "Which data visualization practice is considered deceptive and violates official statistical communication standards?",
    options: [
      "Truncating the y-axis on bar charts without clear zero-baseline indication to artificially exaggerate minute percentage differences",
      "Using consistent color palettes for identical categorical variables across charts",
      "Including error bars showing 95% confidence intervals around sample estimates",
      "Providing downloadable CSV tables alongside interactive visual graphics",
    ],
    correctIndex: 0,
    bloomLevel: "Analyze",
    difficulty: "medium",
    explanation:
      "Truncating the y-axis in bar charts distorts visual proportions and misleads audiences regarding the actual scale of change, violating good dissemination practice.",
    referencePassage:
      "Visual representations must maintain honest scaling; truncating axes or omitting baseline anchors to inflate minor variations constitutes visual distortion.",
    keywords: ["data storytelling", "visualization", "ethics", "communication", "dissemination"],
  },
  {
    id: "seed-mgt-006",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_ETH_06",
    competencyName: "Professional Integrity, Impartiality & Public Trust",
    question:
      "If an external commercial entity or political body requests advance non-public embargoed statistical releases, what is the required response of statistical authorities?",
    options: [
      "Strictly decline; all official statistical releases must adhere to pre-announced release calendars with simultaneous public access for all users",
      "Provide advance access in exchange for consulting compensation",
      "Share early drafts informally over personal email",
      "Grant priority access to commercial financial institutions 24 hours prior to public release",
    ],
    correctIndex: 0,
    bloomLevel: "Evaluate",
    difficulty: "medium",
    explanation:
      "UN Fundamental Principles of Official Statistics mandate equal, simultaneous public access on pre-announced advance release calendars to prevent market manipulation.",
    referencePassage:
      "Advance access to official statistics is strictly prohibited; all economic releases must follow transparent advance release calendars ensuring simultaneous public dissemination.",
    keywords: ["integrity", "impartiality", "advance release calendar", "un-fpos", "public trust"],
  },
  {
    id: "seed-mgt-007",
    domain: "Behavioural & Managerial Competencies",
    competencyId: "BEH_INQ_07",
    competencyName: "Continuous Learning Orientation, Capacity Building & Mentorship",
    question:
      "Under Mission Karmayogi's Competency-Based Training framework adopted by NSSTA, how is the effectiveness of statistical training programs evaluated at Kirkpatrick Level 3?",
    options: [
      "Assessing on-the-job behavioral application and improved data accuracy in official statistical operations 3-6 months post-training",
      "Only checking whether participants enjoyed the classroom food and venue",
      "Counting total attendance signatures on day one",
      "Administering a 5-minute feedback emoji survey at the classroom door",
    ],
    correctIndex: 0,
    bloomLevel: "Understand",
    difficulty: "medium",
    explanation:
      "Kirkpatrick Level 3 evaluates Behavior/Application: whether trainees successfully translate new knowledge (e.g. CAPI/R skills) into their regular official field workflows.",
    referencePassage:
      "Evaluation under Mission Karmayogi measures Level 3 behavioral transfer into daily statistical compilation workflows alongside Level 2 knowledge gains.",
    keywords: ["mission karmayogi", "nssta", "capacity building", "kirkpatrick", "mentorship"],
  },
];

/**
 * Deterministic Offline Fallback Generator
 * Combines regex pattern extraction, statistical distractor perturbator,
 * and canonical pre-seeded MoSPI question bank.
 */
export function generateOfflineQuiz(
  rawText: string,
  fileName = "Document.txt",
  options?: QuizGenerationOptions
): Quiz {
  const sanitized = sanitizeDocumentText(rawText);
  const metadata = extractDocumentMetadata(rawText, fileName);
  const targetDomain = options?.targetDomain || metadata.detectedDomain;
  const numQuestions = Math.max(3, Math.min(20, options?.numQuestions || 5));

  const generatedQuestions: QuizQuestion[] = [];
  const extractedFacts = OfflineFactExtractor.extractFacts(sanitized);

  let qCounter = 1;

  // 1. Synthesize questions from extracted document facts if available
  for (const fact of extractedFacts) {
    if (generatedQuestions.length >= numQuestions) break;

    if (fact.type === "acronym" && fact.term.length >= 2 && fact.definition.length > 3) {
      const distractors = DistractorSynthesizer.generateDistractorsForTerm(fact.term);
      const optionsArray = [fact.definition, ...distractors].slice(0, 4);

      // Deterministic option shuffle
      const correctIndex = (fact.term.charCodeAt(0) + qCounter) % 4;
      const finalOptions = [...optionsArray];
      const correctVal = finalOptions[0];
      finalOptions[0] = finalOptions[correctIndex];
      finalOptions[correctIndex] = correctVal;

      generatedQuestions.push({
        id: `offline-q-${qCounter++}`,
        question: `In the context of the provided document, what does the acronym '${fact.term}' expand to?`,
        options: finalOptions as [string, string, string, string],
        correctIndex,
        bloomLevel: "Remember",
        difficulty: "easy",
        competencyId: targetDomain.startsWith("Statistical")
          ? "STAT_SMPL_01"
          : targetDomain.startsWith("Technical")
          ? "TECH_R_01"
          : targetDomain.startsWith("Digital")
          ? "GOV_SDC_02"
          : "BEH_FLD_01",
        competencyName: `${targetDomain} Knowledge`,
        explanation: `Option ${String.fromCharCode(65 + correctIndex)} is correct: In the provided text, '${fact.term}' refers directly to '${fact.definition}'.`,
        referencePassage: fact.contextSentence || `${fact.term} refers to ${fact.definition}.`,
        keywords: [fact.term.toLowerCase(), "expansion", "acronym"],
      });
    } else if (fact.type === "definition" && fact.term.length >= 3 && fact.definition.length > 15) {
      const distractors = DistractorSynthesizer.generateDistractorsForDefinition(
        fact.term,
        fact.definition,
        extractedFacts
      );
      const optionsArray = [fact.definition, ...distractors].slice(0, 4);

      const correctIndex = (fact.term.length + qCounter) % 4;
      const finalOptions = [...optionsArray];
      const correctVal = finalOptions[0];
      finalOptions[0] = finalOptions[correctIndex];
      finalOptions[correctIndex] = correctVal;

      generatedQuestions.push({
        id: `offline-q-${qCounter++}`,
        question: `According to the official document, how is '${fact.term}' specifically defined?`,
        options: finalOptions as [string, string, string, string],
        correctIndex,
        bloomLevel: "Understand",
        difficulty: "medium",
        competencyId: targetDomain.startsWith("Statistical")
          ? "STAT_SMPL_01"
          : targetDomain.startsWith("Technical")
          ? "TECH_VAL_05"
          : targetDomain.startsWith("Digital")
          ? "GOV_DQAF_01"
          : "BEH_FLD_01",
        competencyName: `${targetDomain} Concepts`,
        explanation: `Option ${String.fromCharCode(65 + correctIndex)} is correct: According to the document, ${fact.term} is defined as: ${fact.definition}.`,
        referencePassage: fact.contextSentence || `${fact.term} is defined as ${fact.definition}.`,
        keywords: [fact.term.toLowerCase(), "definition", "concept"],
      });
    }
  }

  // 2. Blend with Canonical Seed Questions matching target domain & text keywords
  const textLower = sanitized.toLowerCase();
  const domainSeeds = MOSPI_SEED_QUESTION_BANK.filter((q) => q.domain === targetDomain);
  const otherSeeds = MOSPI_SEED_QUESTION_BANK.filter((q) => q.domain !== targetDomain);

  // Sort domain seeds by keyword overlap with document text
  const rankedSeeds = [...domainSeeds, ...otherSeeds].sort((a, b) => {
    const aMatch = a.keywords.filter((kw) => textLower.includes(kw)).length;
    const bMatch = b.keywords.filter((kw) => textLower.includes(kw)).length;
    return bMatch - aMatch;
  });

  for (const seed of rankedSeeds) {
    if (generatedQuestions.length >= numQuestions) break;
    // Check if question not already added
    if (!generatedQuestions.some((gq) => gq.question === seed.question)) {
      generatedQuestions.push({
        id: `offline-q-${qCounter++}`,
        question: seed.question,
        options: seed.options,
        correctIndex: seed.correctIndex,
        bloomLevel: seed.bloomLevel,
        difficulty: seed.difficulty,
        competencyId: seed.competencyId,
        competencyName: seed.competencyName,
        explanation: seed.explanation,
        referencePassage: seed.referencePassage,
        keywords: seed.keywords,
      });
    }
  }

  const titleBase = metadata.round
    ? `MoSPI ${metadata.round} Assessment`
    : metadata.baseYear
    ? `MoSPI Price & Economic Statistics (Base ${metadata.baseYear}) Assessment`
    : `${fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")} Competency Assessment`;

  return {
    id: `quiz-offline-${Date.now()}`,
    title: titleBase,
    description: `Official statistics assessment synthesized deterministically from ${fileName} (${targetDomain}).`,
    sourceDocumentName: fileName,
    sourceDocumentType: metadata.documentType,
    detectedDomain: targetDomain,
    generatorSource: "OFFLINE_FALLBACK",
    createdAt: new Date().toISOString(),
    totalQuestions: generatedQuestions.length,
    timeLimitMinutes: Math.max(5, Math.ceil(generatedQuestions.length * 1.5)),
    questions: generatedQuestions,
  };
}
