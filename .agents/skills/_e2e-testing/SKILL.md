---
name: e2e-testing
description: Write and debug Playwright E2E tests for this project. Use when adding new E2E tests, debugging test failures, or working with the apps/e2e package. Covers test structure, fixtures, selectors, email verification, and best practices specific to this codebase.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to E2E test fixtures, selectors, config, or test patterns, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# E2E Testing Guide

This project uses **Playwright** for E2E tests in `apps/e2e/`.

## Running Tests

```sh
# From apps/e2e/ (dev server must be running or will auto-start)
bunx playwright test              # all tests
bunx playwright test --headed     # with browser visible
bunx playwright test --ui         # interactive UI mode
bunx playwright test tests/auth/  # specific directory
```

## Architecture

| Path                            | Purpose                                           |
| :------------------------------ | :------------------------------------------------ |
| `apps/e2e/playwright.config.ts` | Config (baseURL, webServer, timeouts)             |
| `apps/e2e/tests/fixtures/auth.ts` | Custom fixtures (createUser, signInViaAPI, etc.) |
| `apps/e2e/tests/auth/`         | Auth flow tests                                   |
| `apps/e2e/FEATURES.md`         | Feature coverage table                            |

## Test Fixtures (`tests/fixtures/auth.ts`)

| Fixture        | Description                                              |
| :------------- | :------------------------------------------------------- |
| `createUser`   | Creates user via Better Auth API, returns email/password  |
| `signInViaAPI` | Signs in via API, sets session cookies on browser context |
| `getEmails`    | Reads captured emails from `.email-captures/` directory   |
| `clearEmails`  | Clears all captured emails                               |
| `uniqueEmail`  | Generates unique test email with prefix                   |

## Rules — MUST follow

### Selectors

- **MUST use `data-testid` attributes** via `page.getByTestId()` for buttons, forms, and key elements
- **MUST use `page.locator('#id')` for password fields** — `getByLabel` matches both the input AND the "Show password" button (PasswordInput component wraps input + toggle)
- **Use `page.getByLabel()` for non-password text inputs** (Email, First name, etc.)
- **NEVER use text-based selectors** for interactive elements — text changes with i18n
- **NEVER use `waitForLoadState('networkidle')`** — use `expect` assertions instead

### Test structure

- **Only ONE test should exercise the full UI for each feature** (e.g., sign-up). All other tests MUST use the API (`createUser` fixture) for user setup — this is faster and more reliable.
- **Each test MUST use a unique email** via `uniqueEmail('prefix')`
- **Each test MUST have extensive JSDoc** at the top of the file explaining step-by-step what happens
- **Wait for page hydration** before interacting: `await expect(page.getByTestId('form-id')).toBeVisible()`

### Account page timing

The `/account` page re-renders when session/passkey data loads, which can reset form field values and component state. **MUST wait for data to settle** before filling forms or clicking buttons:

```ts
// Wait for sessions card to finish loading
await expect(
  page.getByText("Loading sessions...")
).not.toBeVisible({ timeout: 10_000 });
```

### Email verification

Emails are captured to `.email-captures/` as JSON files (filename = recipient email, key = timestamp, value = { subject, html }). Use the `getEmails` fixture:

```ts
const emails = getEmails(email);
const verificationEmail = emails.find((e) =>
  e.subject.toLowerCase().includes("verif")
);
expect(verificationEmail).toBeTruthy();
```

### Auth guard (SSR)

Route auth guards use `getSession()` from `apps/web/src/lib/auth-client.ts` which works during both SSR and CSR. `page.goto('/account')` triggers SSR and the guard correctly checks the session via server-side auth.

## Adding data-testid attributes

When creating new UI components that E2E tests will interact with, add `data-testid` attributes:

```tsx
<form data-testid="my-feature-form" onSubmit={handleSubmit(onSubmit)}>
  {/* inputs use id attributes for locator('#id') */}
  <Button data-testid="my-feature-submit" type="submit">Submit</Button>
</form>
```

Naming convention: `{feature}-{element}` (e.g., `signup-form`, `signup-submit`, `delete-account-trigger`)

## Adding a new E2E test

1. Create test file in `apps/e2e/tests/{feature}/`
2. Import fixtures: `import { test, expect } from "../fixtures/auth"`
3. Add extensive JSDoc header explaining the test steps
4. Use `uniqueEmail` for test isolation
5. Use `createUser` + `signInViaUI` for user setup (only the primary flow uses full UI)
6. Add entry to `apps/e2e/FEATURES.md`
7. Run and verify: `bunx playwright test tests/{feature}/`
