interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
}

interface TestSuite {
  name: string;
  tier?: string;
  feature?: string;
  tests: TestCase[];
}

const suites: TestSuite[] = [];
let currentSuite: TestSuite | null = null;

export function describe(name: string, fn: () => void, tier?: string, feature?: string) {
  const suite: TestSuite = { name, tier, feature, tests: [] };
  suites.push(suite);
  currentSuite = suite;
  fn();
  currentSuite = null;
}

export function it(name: string, fn: () => void | Promise<void>) {
  if (currentSuite) {
    currentSuite.tests.push({ name, fn });
  } else {
    const defaultSuite: TestSuite = { name: "Default Suite", tests: [{ name, fn }] };
    suites.push(defaultSuite);
  }
}

export function expect(actual: any) {
  const isCloseTo = (a: number, b: number, precision: number = 2) => {
    return Math.abs(a - b) < Math.pow(10, -precision) / 2;
  };

  const matcher = (isNot: boolean) => ({
    toBe(expected: any) {
      const pass = actual === expected;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${JSON.stringify(actual)} ${isNot ? "not " : ""}to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected: any) {
      const pass = JSON.stringify(actual) === JSON.stringify(expected);
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${JSON.stringify(actual)} ${isNot ? "not " : ""}to equal ${JSON.stringify(expected)}`);
      }
    },
    toContain(expected: any) {
      let pass = false;
      if (typeof actual === "string" || Array.isArray(actual)) {
        pass = actual.includes(expected);
      }
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${JSON.stringify(actual)} ${isNot ? "not " : ""}to contain ${JSON.stringify(expected)}`);
      }
    },
    toBeDefined() {
      const pass = actual !== undefined;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected value ${isNot ? "not " : ""}to be defined, but received ${actual}`);
      }
    },
    toBeUndefined() {
      const pass = actual === undefined;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected value ${isNot ? "not " : ""}to be undefined, but received ${actual}`);
      }
    },
    toBeNull() {
      const pass = actual === null;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected value ${isNot ? "not " : ""}to be null, but received ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      const pass = actual > expected;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${actual} ${isNot ? "not " : ""}to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      const pass = actual >= expected;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${actual} ${isNot ? "not " : ""}to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      const pass = actual < expected;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${actual} ${isNot ? "not " : ""}to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      const pass = actual <= expected;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${actual} ${isNot ? "not " : ""}to be less than or equal to ${expected}`);
      }
    },
    toHaveLength(expected: number) {
      const pass = actual && actual.length === expected;
      if (isNot ? pass : !pass) {
        throw new Error(`Expected length ${expected}, but received ${actual ? actual.length : actual}`);
      }
    },
    toMatch(regex: RegExp) {
      const pass = typeof actual === "string" && regex.test(actual);
      if (isNot ? pass : !pass) {
        throw new Error(`Expected "${actual}" ${isNot ? "not " : ""}to match ${regex}`);
      }
    },
    toBeCloseTo(expected: number, precision: number = 2) {
      const pass = isCloseTo(Number(actual), expected, precision);
      if (isNot ? pass : !pass) {
        throw new Error(`Expected ${actual} ${isNot ? "not " : ""}to be close to ${expected} with precision ${precision}`);
      }
    },
  });

  return {
    ...matcher(false),
    not: matcher(true),
  };
}

async function runAllSuites() {
  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of suites) {
    const header = suite.tier ? `[${suite.tier}] ${suite.name}` : suite.name;
    console.log(`\n▶ ${header}`);

    for (const t of suite.tests) {
      try {
        await t.fn();
        totalPassed++;
        console.log(`  ✓ ${t.name}`);
      } catch (err: any) {
        totalFailed++;
        console.error(`  ✗ FAIL: ${t.name}`);
        console.error(`    ${err.message}`);
      }
    }
  }

  return { totalPassed, totalFailed };
}

async function main() {
  console.log("================================================================================");
  console.log(" MoSPI Skill Intelligence Platform - Full Test Suite Runner (SIH 26101)");
  console.log("================================================================================\n");

  const startTime = Date.now();

  // Import test modules so their describe() blocks execute and register
  await import("./unit/storage.test");
  await import("./unit/doc-parser.test");
  await import("./unit/offline-quiz.test");
  await import("./unit/gap-engine.test");
  await import("./unit/recommendation-engine.test");
  await import("./e2e/tier1-features.test");
  await import("./e2e/tier2-boundaries.test");
  await import("./e2e/tier3-combinations.test");
  await import("./e2e/tier4-scenarios.test");

  // Run Storage test explicitly if needed
  const { runStorageTests } = await import("./unit/storage.test");
  await runStorageTests();

  const { totalPassed, totalFailed } = await runAllSuites();
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n================================================================================");
  if (totalFailed === 0) {
    console.log(` ✅ ALL ${totalPassed} SPECIFICATION TESTS PASSED in ${duration}s`);
    console.log("================================================================================");
  } else {
    console.error(` ❌ TEST RUN COMPLETED WITH ${totalFailed} FAILURES (${totalPassed} passed)`);
    console.log("================================================================================");
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("\n❌ FATAL TEST RUNNER ERROR:", err);
    process.exit(1);
  });
}
