---
name: testing
description: Unit and integration testing guidelines — test requirements, utilities, oRPC test patterns, and bun:test conventions. MUST be activated when writing or modifying tests, or when adding/changing endpoints, server functions, or business logic.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to test utilities, patterns, or conventions, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Unit & Integration Testing Guide

Runner: **bun:test**. Test files colocated: `{name}.test.ts` or `__tests__/` directory.

## When Tests Are Required

- **Tests are REQUIRED** when adding/modifying endpoints, server functions, utilities, or business logic
- **ALL oRPC endpoints MUST have extensive tests** — auth middleware, input validation, happy paths, edge cases
- NEVER ship backend changes without test coverage

## Test Utilities

`packages/auth/__tests__/test-utils.ts` (exported as `@packages/auth/test-utils`):

| Utility                                            | Purpose                                                      |
| :------------------------------------------------- | :----------------------------------------------------------- |
| `createTestUser({ email, name, password, role? })` | Creates user via auth handler, returns `{ userId, headers }` |
| `cleanupTestUser(userId)`                          | Deletes user + cascaded data                                 |
| `uniqueEmail(prefix)`                              | Generates unique email for test isolation                    |

## oRPC Test Pattern

```ts
import { createRouterClient } from "@orpc/server";
import { router } from "../router";

const client = createRouterClient(router, {
  context: { headers: adminHeaders },
});
const result = await client.admin.users.list({ limit: 10 });
```

## Rules

- NEVER use `timeout` when running tests
- NEVER use `.only` or `.skip` in committed code
- Use `async/await` — never done callbacks
- Each test MUST use a unique email via `uniqueEmail('prefix')` for isolation
- Clean up test data with `cleanupTestUser()` in `afterAll`/`afterEach`

## For E2E (Playwright) Tests

See the **`_e2e-testing` skill** — separate patterns, fixtures, and conventions apply.
