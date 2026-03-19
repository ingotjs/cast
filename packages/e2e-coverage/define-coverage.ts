import { existsSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Interaction = {
  /** Precondition / input state — omit if there's only one scenario */
  context?: string;
  /** Visibility condition (feature flag, auth state, etc.) */
  condition?: string;
  /** Whether the element should be visible under this condition */
  visible?: boolean;
  /** Expected behavior when interacted with */
  expected?: string;
  /** Test file covering this case — null means no test exists yet (coverage gap) */
  test: string | null;
  /** Nested interactive elements revealed by this interaction */
  reveals?: Record<string, Interaction[]>;
};

export type RouteAccess = {
  expected: string;
  test: string | null;
};

export type Route = {
  access?: Record<string, RouteAccess>;
  interactions: Record<string, Interaction[]>;
};

export type SetupOptions = {
  /** Absolute path to the directory containing test files */
  testDir: string;
  /** If true, fails when any interaction has test: null */
  strict?: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Type-safe interaction map — validates shape without widening keys */
export function interactions<T extends Record<string, Interaction[]>>(map: T): T {
  return map;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type Issue = {
  type: "missing-test-file" | "uncovered-interaction" | "duplicate-testid" | "orphan-testid" | "unknown-key";
  message: string;
};

function collectTestIdValues(testId: Record<string, Record<string, string>>): {
  values: Set<string>;
  errors: Issue[];
} {
  const values = new Set<string>();
  const errors: Issue[] = [];
  const seen = new Map<string, string>();

  for (const [group, entries] of Object.entries(testId)) {
    for (const [key, value] of Object.entries(entries)) {
      const path = `${group}.${key}`;
      if (seen.has(value)) {
        errors.push({
          type: "duplicate-testid",
          message: `Duplicate testId value "${value}" at ${path} and ${seen.get(value)}`,
        });
      }
      seen.set(value, path);
      values.add(value);
    }
  }

  return { values, errors };
}

function collectFromRoutes(routes: Record<string, Route>): {
  interactionKeys: Set<string>;
  testFiles: Set<string>;
  uncovered: { route: string; key: string; detail: string }[];
} {
  const interactionKeys = new Set<string>();
  const testFiles = new Set<string>();
  const uncovered: { route: string; key: string; detail: string }[] = [];

  function processInteractions(routeKey: string, interactions: Record<string, Interaction[]>) {
    for (const [key, cases] of Object.entries(interactions)) {
      interactionKeys.add(key);
      for (const c of cases) {
        if (c.test === null) {
          uncovered.push({ route: routeKey, key, detail: c.context ?? c.condition ?? "(default)" });
        } else {
          testFiles.add(c.test);
        }
        if (c.reveals) {
          processInteractions(routeKey, c.reveals);
        }
      }
    }
  }

  for (const [routeKey, route] of Object.entries(routes)) {
    if (route.access) {
      for (const [role, access] of Object.entries(route.access)) {
        if (access.test === null) {
          uncovered.push({ route: routeKey, key: `access:${role}`, detail: role });
        } else {
          testFiles.add(access.test);
        }
      }
    }
    processInteractions(routeKey, route.interactions);
  }

  return { interactionKeys, testFiles, uncovered };
}

function validate(
  testId: Record<string, Record<string, string>>,
  routes: Record<string, Route>,
  options: SetupOptions
): { errors: Issue[]; warnings: Issue[] } {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];

  const { values: testIdValues, errors: dupeErrors } = collectTestIdValues(testId);
  errors.push(...dupeErrors);

  const { interactionKeys, testFiles, uncovered } = collectFromRoutes(routes);

  for (const file of testFiles) {
    const fullPath = resolve(options.testDir, file);
    if (!existsSync(fullPath)) {
      errors.push({ type: "missing-test-file", message: `Test file not found: ${file} (resolved: ${fullPath})` });
    }
  }

  if (options.strict) {
    for (const { route, key, detail } of uncovered) {
      errors.push({ type: "uncovered-interaction", message: `Uncovered: ${route} → ${key} (${detail})` });
    }
  }

  for (const value of testIdValues) {
    if (!interactionKeys.has(value)) {
      warnings.push({ type: "orphan-testid", message: `testId value "${value}" not referenced in any route` });
    }
  }

  for (const key of interactionKeys) {
    if (!testIdValues.has(key)) {
      warnings.push({ type: "unknown-key", message: `Interaction key "${key}" has no matching testId value` });
    }
  }

  return { errors, warnings };
}

function printSummary(routes: Record<string, Route>) {
  const { uncovered } = collectFromRoutes(routes);
  const totalCovered = countCovered(routes);
  const totalAll = totalCovered + uncovered.length;

  const pct = totalAll > 0 ? ((totalCovered / totalAll) * 100).toFixed(1) : "0.0";
  console.log(`\n  E2E Coverage: ${totalCovered}/${totalAll} interactions (${pct}%)\n`);
}

function countCovered(routes: Record<string, Route>): number {
  let count = 0;

  function processInteractions(interactions: Record<string, Interaction[]>) {
    for (const cases of Object.values(interactions)) {
      for (const c of cases) {
        if (c.test !== null) count++;
        if (c.reveals) processInteractions(c.reveals);
      }
    }
  }

  for (const route of Object.values(routes)) {
    if (route.access) {
      for (const access of Object.values(route.access)) {
        if (access.test !== null) count++;
      }
    }
    processInteractions(route.interactions);
  }

  return count;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function defineE2ECoverage<
  const TTestId extends Record<string, Record<string, string>>,
  const TRoutes extends string = string,
>(config: {
  testId: TTestId;
  routes: Record<TRoutes, Route>;
}): {
  testId: TTestId;
  routes: Record<TRoutes, Route>;
  setup: (options: SetupOptions) => () => void;
} {
  return {
    testId: config.testId,
    routes: config.routes,
    setup: (options: SetupOptions) => () => {
      const { errors, warnings } = validate(
        config.testId as Record<string, Record<string, string>>,
        config.routes as Record<string, Route>,
        options
      );

      printSummary(config.routes as Record<string, Route>);

      if (warnings.length > 0) {
        const summary = warnings.map((w) => `  [${w.type}] ${w.message}`).join("\n");
        console.warn(`E2E coverage warnings:\n${summary}\n`);
      }

      if (errors.length > 0) {
        const summary = errors.map((e) => `  [${e.type}] ${e.message}`).join("\n");
        throw new Error(`E2E coverage validation failed:\n${summary}`);
      }
    },
  };
}
