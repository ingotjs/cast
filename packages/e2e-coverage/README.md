# @packages/e2e-coverage

E2E interactive element coverage framework for TanStack Start apps. Provides `defineE2ECoverage()` for mapping every user-interactive element to its test, and `setup()` for validating coverage integrity on every test run.

Built for route-based architectures — coverage is organized by route, with shared components (header, footer, user menu) extracted as reusable groups.

## Usage

```ts
import { defineE2ECoverage, interactions } from "@packages/e2e-coverage";

const testId = { signin: { buttonSubmit: "signin-button-submit" } } as const;

const e2e = defineE2ECoverage({
  testId,
  routes: {
    "/auth/sign-in": {
      interactions: {
        [testId.signin.buttonSubmit]: [
          { context: "valid credentials", expected: "redirects to /", test: "auth/sign-in.e2e.ts" },
          { context: "invalid credentials", expected: "stays on page", test: "auth/sign-in.e2e.ts" },
          { expected: "validation errors", test: "auth/sign-in.e2e.ts" },
        ],
      },
    },
  },
});

export const { testId, routes, setup } = e2e;
```

## API

### `defineE2ECoverage({ testId, routes })`

Returns `{ testId, routes, setup }`.

- **testId** — nested `as const` object of `data-testid` strings. Tests import this for type-safe selectors.
- **routes** — route-based map of interactive elements, their contexts, and test coverage.
- **setup(options)** — returns a Playwright `globalSetup` function that validates coverage.

### `interactions(map)`

Helper that validates interaction map shape without widening key types. Use for shared component groups.

### `Interaction` type

```ts
{
  context?: string;     // Precondition — omit if only one scenario
  condition?: string;   // Visibility condition (feature flag, auth state)
  visible?: boolean;    // Expected visibility under this condition
  expected?: string;    // What happens when interacted with
  test: string | null;  // Test file path — null = coverage gap
  reveals?: Record<string, Interaction[]>;  // Nested UI revealed by this interaction
}
```

### `setup(options)`

| Option  | Type    | Description                                  |
| :------ | :------ | :------------------------------------------- |
| testDir | string  | Absolute path to test files directory        |
| strict  | boolean | If true, fails on any `test: null` (no gaps) |

**Validates:**

- Test files exist on disk
- No duplicate testId values
- Orphan testIds not in any route (warning)
- Unknown interaction keys not in testId (warning)
- Coverage summary printed to stdout

### `testId` naming convention

Prefix with element type for clarity:

| Prefix   | Element           | Example                         |
| :------- | :---------------- | :------------------------------ |
| `button` | Button, trigger   | `buttonSubmit`, `buttonTrigger` |
| `link`   | Link, anchor      | `linkSignin`, `linkBack`        |
| `input`  | Text input, field | `inputEmail`, `inputPassword`   |

### Optional

Using `testId` and `routes` from coverage.ts in your tests is **optional**. You can use raw strings if you prefer — the coverage file is primarily a tracking/validation tool.
