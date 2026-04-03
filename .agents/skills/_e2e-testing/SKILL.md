---
name: _e2e-testing
description: >
  Write and debug Playwright E2E tests. Covers coverage.ts structure,
  data-testid conventions, test fixtures, selectors, and best practices.
  Load when adding E2E tests, debugging test failures, or auditing
  interactive element coverage.
type: core
---

> **Keep this skill in sync:** When making changes to E2E test fixtures, selectors, config, or test patterns, this skill MUST be updated to reflect the current state.

# E2E Testing Guide

This project uses **Playwright** for E2E tests. The core principle: **every user interaction MUST be tested.** E2E tests simulate a real human — if a user can click it, type in it, or select it, it MUST have a `data-testid` and a test.

## Running Tests

The dev server starts automatically — Playwright's `webServer` config runs `bun dev` and waits for it. NEVER manually start the dev server.

```sh
bun e2e                               # all tests (from project root)
bunx playwright test --headed          # with browser visible (from apps/e2e/)
bunx playwright test --ui              # interactive UI mode
bunx playwright test tests/auth/       # specific directory
```

## Architecture

| Path                              | Purpose                                            |
| :-------------------------------- | :------------------------------------------------- |
| `apps/e2e/playwright.config.ts`   | Config (baseURL, webServer, timeouts)              |
| `apps/e2e/coverage.ts`            | Interactive element coverage map (source of truth) |
| `apps/e2e/global-setup.ts`        | Cleans email captures before each run              |
| `apps/e2e/tests/fixtures/auth.ts` | Custom fixtures (testUser, signIn, expectEmail)    |
| `apps/e2e/tests/auth/`            | Auth flow tests                                    |

---

## Interactive Element Coverage

### Philosophy

E2E tests MUST simulate a real human. Every interactive element — buttons, links, inputs, selects, toggles, dropdowns — MUST be tested. If a user can interact with it, it MUST:

1. Have a `data-testid` on the **outermost interaction point** (what the user clicks, not internal wrappers)
2. Be listed in `apps/e2e/coverage.ts`
3. Have a test for every meaningful context/state

### `coverage.ts` — The Source of Truth

`apps/e2e/coverage.ts` is the central file for E2E testing. It serves two purposes:

1. **Test ID registry** — exports `testId`, a nested const object of all `data-testid` strings. Tests MUST import from here instead of hardcoding strings:

   ```ts
   import { testId } from "../../coverage";
   await page.getByTestId(testId.userMenu.buttonTrigger).click();
   ```

2. **Coverage map** — maps every route to every interactive element to every context to the test that covers it. `test: null` explicitly marks coverage gaps — grep for it to find them.

### How to run a full coverage audit

1. Read all routes in `apps/web/src/routes/`
2. For each route, identify every interactive element in the component tree
3. Check each element against `coverage.ts`:
   - Missing from coverage? Add entry
   - Missing `data-testid`? Add to component
   - Has `test: null`? Write test
4. Report gaps: `grep -c 'test: null' apps/e2e/coverage.ts`
5. Write tests for all `test: null` entries
6. Verify: `bun e2e`

---

## Test Fixtures (`tests/fixtures/auth.ts`)

| Fixture             | Description                                                         |
| :------------------ | :------------------------------------------------------------------ |
| `testUser`          | Creates user via API, clears cookies. Returns `{ email, password }` |
| `authenticatedPage` | Creates user via API, keeps session cookies. Returns credentials    |
| `signIn`            | Signs in via API, sets session cookies: `signIn(email, password)`   |
| `signOut`           | Signs out by clearing cookies                                       |
| `getEmails`         | Reads captured emails for a recipient                               |
| `expectEmail`       | Asserts an email with matching subject keyword was captured (polls) |
| `clearEmails`       | Clears all captured emails                                          |

---

## Rules — MUST follow

### Selectors

- **MUST use `data-testid` attributes** via `page.getByTestId()` for all interactive elements
- **MUST use `page.locator('#id')` for password fields** — `getByLabel` matches both the input AND the "Show password" button (PasswordInput wraps input + toggle)
- **Use `page.getByLabel()` for non-password text inputs** (Email, First name, etc.)
- **NEVER use text-based selectors** for interactive elements — text changes with i18n
- **NEVER use `waitForLoadState('networkidle')`** — use `expect` assertions instead

### Timeouts

- **Global expect timeout is 5s** (`playwright.config.ts`). NEVER add custom timeouts unless there's a specific reason.
- **If a custom timeout is needed**, add a comment explaining why.
- **Only known exception:** `toHaveURL("/", { timeout: 15_000 })` after auth actions — server-side session + redirect is slow.

### Test structure

- **Tests MUST be as small as possible.** One test per context/scenario. Small tests run in parallel.
- **Only ONE test should exercise the full UI for each feature.** All other tests MUST use API fixtures for setup.
- **Each test MUST use a unique email** via the `generateEmail('prefix')` pattern
- **Each test MUST have extensive JSDoc** explaining step-by-step what happens
- **Wait for page hydration** before interacting: `await expect(page.getByTestId('form-id')).toBeVisible()`

### Email notifications

**NEVER use `waitForTimeout()` before checking emails** — use the `expectEmail` fixture.

### Auth guard (SSR)

Route auth guards use `getSession()` which works during both SSR and CSR. `page.goto('/account')` triggers SSR and the guard correctly checks the session.

---

## Adding `data-testid` attributes

Place `data-testid` on the **outermost interaction point** — what the user actually clicks/types in:

```tsx
<Button data-testid="signup-submit" type="submit">Create account</Button>

<Link data-testid="header-nav-about" to="/about">About</Link>

<Select data-testid="filter-status">
  <SelectTrigger>...</SelectTrigger>
</Select>
```

Naming convention: `{feature}-{element}` (e.g., `signup-submit`, `delete-account-trigger`)

## Adding a new E2E test

1. Create test file in `apps/e2e/tests/{feature}/`
2. Import fixtures: `import { test, expect } from "../fixtures/auth"`
3. Add extensive JSDoc header explaining the test steps
4. Use fixtures for user setup (only the primary happy-path uses full UI)
5. Add/update entries in `apps/e2e/coverage.ts` with the test filename
6. Run and verify: `bun e2e`
