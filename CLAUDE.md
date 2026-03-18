# OmegaStart

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep docs in sync — THIS IS CRITICAL:** CLAUDE.md and README.md MUST ALWAYS be updated when making ANY change to: project structure, packages, features, config, scripts, commands, hosting, env vars, or anything a developer would want to know. **Failing to update these files is unacceptable.** If in doubt, update them.
>
> **README.md tone — THIS IS A PUBLIC REPO:** Written for smart developers — respect their intelligence. Be direct and factual, not salesy. NEVER pad with obvious filler ("changes reflect instantly", "TypeScript catches every broken consumer") or implementation details no one asked for ("simulated locally via miniflare"). State what matters, skip what's obvious. Highlight what's genuinely exceptional about the DX — but earn it with substance, not buzzwords.
>
> **Prefer CLAUDE.md over memory:** Save instructions and feedback here, not in `~/.claude/projects/.../memory/`. CLAUDE.md is committed to the repo and persists across machines. NEVER use the memory system.

[Vite+](https://vite.dev/plus/) monorepo. Bun package manager. [Just-in-Time Packages](https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages) — internal packages export raw TypeScript (no build step).

---

## Quick Reference

### Commands

| Command                 | Description                                                      |
| :---------------------- | :--------------------------------------------------------------- |
| `bun dev`               | Start all apps in dev mode (auto-installs deps)                  |
| `bun dev:email`         | Email template preview (port 3002)                               |
| `bun ok`                | Type check + lint + tests — **run after every task**             |
| `bun ok:ci`             | Same without auto-fixes (CI)                                     |
| `bun db:generate`       | Generate migrations (**user MUST run manually**)                 |
| `bun db:migrate`        | Apply migrations locally (**user MUST run manually**)            |
| `bun db:migrate:remote` | Apply migrations to remote D1 (**user MUST run manually**)       |
| `bun db:studio`         | Open Drizzle Studio                                              |
| `bun e2e`               | Run Playwright E2E tests (from `apps/e2e`)                       |
| `bun knip`              | Find unused files, deps, and exports ([Knip](https://knip.dev/)) |

### Quality Verification

- **ALWAYS run `bun ok` after finishing any task** — a task is NOT complete until it passes
- **`bun ok` MUST run from the project root** — NEVER from subdirectories
- **NEVER run `tsc`, `tsgo`, `bun ts`, `bun lint`, or `bun build` directly** — always use `bun ok`

---

## Architecture

### Monorepo Structure

| Package           | Alias              | Description                                                                |
| :---------------- | :----------------- | :------------------------------------------------------------------------- |
| `apps/web`        | —                  | TanStack Start app (Vite + Router + Cloudflare Workers). Admin at `/admin` |
| `packages/db`     | `@packages/db`     | Drizzle ORM + D1 schema, migrations, database client                       |
| `packages/utils`  | `@packages/utils`  | Shared consts (`src/shared/`), server env/logger/posthog (`src/server/`)   |
| `packages/auth`   | `@packages/auth`   | Better Auth config, KV storage, i18n                                       |
| `packages/api`    | `@packages/api`    | oRPC router + procedures (public/protected/admin)                          |
| `packages/email`  | `@packages/email`  | React Email templates + Resend + email capture (E2E)                       |
| `packages/ui`     | `@packages/ui`     | shadcn v4 + Tailwind CSS + Base UI                                         |
| `apps/e2e`        | —                  | Playwright E2E tests (auth flows, email verification)                      |
| `packages/config` | `@packages/config` | Shared TypeScript configs                                                  |

**Dependency graph:** `@packages/db` (leaf) ← `@packages/auth` (+ `@packages/email`, `@packages/utils`) ← `@packages/api`

### Type Checking

[typescript-go](https://github.com/microsoft/typescript-go) (`tsgo`) via `@typescript/native-preview`. Regular `typescript` still installed for tooling compatibility.

### Linting & Formatting

[Vite+](https://vite.dev/plus/) (`vite-plus`) for Oxlint + Oxfmt. Config: `.oxlintrc.json` + `.oxfmtrc.jsonc`. Pre-commit hooks via `vp staged` (`.vite-hooks/pre-commit`).

**Note:** Bun remains the package manager and test runner. Vite+ handles linting/formatting (`vp fmt`, `vp lint`, `vp staged`) and monorepo task orchestration (`vp run -r`). `vp install`, `vp test`, `vp dev`, `vp build` are NOT used — Bun and Alchemy handle those.

<details>
<summary><strong>Vite+ usage rules</strong></summary>

- **Do NOT install Oxlint, Oxfmt, or tsdown directly** — Vite+ bundles them. Versions are controlled by the `vite-plus` package.
- **Root `vite.config.ts`** imports from `vite-plus` (NOT `vite`). App-level `apps/web/vite.config.ts` still imports from `vite` — these are separate.
- **`vp staged`** runs on pre-commit via `.vite-hooks/pre-commit`. It formats + lints only staged files.
- **`vp config`** (in `prepare` script) sets up `.vite-hooks/` and agent integration on `bun install`.

</details>

<details>
<summary><strong>Key oxlint overrides</strong></summary>

| Rule                                     | Value           | Note                                               |
| :--------------------------------------- | :-------------- | :------------------------------------------------- |
| `eslint/sort-keys`                       | off             |                                                    |
| `node/no-process-env`                    | error           | Only `**/env.ts` exempt                            |
| `promise/prefer-await-to-callbacks`      | off             |                                                    |
| `react-perf/jsx-no-new-function-as-prop` | off             | React Compiler handles memoization                 |
| `typescript/consistent-type-definitions` | error, `"type"` | NEVER use `interface` (except module augmentation) |

**Ignored paths:** `.agents`, `.alchemy`, `.claude`, `**/alchemy.run.ts`, `**/routeTree.gen.ts`, `**/paraglide/**`, `**/*.md`

</details>

---

## Stack

### Environment Variables

**NEVER use `process.env` or `import.meta.env` directly.** Enforced by oxlint. Only `**/env.ts` files may access them.

| Context | Import                                                   | Example                                      |
| :------ | :------------------------------------------------------- | :------------------------------------------- |
| Server  | `import { serverEnv } from "@packages/utils/server/env"` | `serverEnv.email?.RESEND_API_KEY`            |
| Client  | `import { clientEnv } from "@/lib/env"`                  | `clientEnv.posthog?.VITE_PUBLIC_POSTHOG_KEY` |

### Service Features & Capability Flags

Two types of features, two obvious places:

**Service features** — external services toggled by env var presence. Set the env vars → service is on. Leave them out → off. No code changes needed.

| Service       | Primary env var           | Env group                                 |
| :------------ | :------------------------ | :---------------------------------------- |
| `posthog`     | `VITE_PUBLIC_POSTHOG_KEY` | `serverEnv.posthog` / `clientEnv.posthog` |
| `email`       | `RESEND_API_KEY`          | `serverEnv.email`                         |
| `googleOAuth` | `GOOGLE_CLIENT_ID`        | `serverEnv.googleOAuth`                   |

**Capability flags** — product decisions in `consts.auth` (`packages/utils/src/shared/consts.ts`). Always the same regardless of environment.

| Capability | Default | Access                 |
| :--------- | :-----: | :--------------------- |
| `password` |  true   | `consts.auth.password` |
| `passkey`  |  true   | `consts.auth.passkey`  |

**UI-toggle env vars** — show/hide auth UI elements per environment:

| Env var                    | Effect                                                             |
| :------------------------- | :----------------------------------------------------------------- |
| `VITE_PUBLIC_GOOGLE_OAUTH` | Show Google sign-in button (requires server Google OAuth env vars) |
| `VITE_PUBLIC_MAGIC_LINK`   | Show magic link sign-in option (requires email env vars)           |

**Usage:**

```ts
serverEnv.email?.RESEND_API_KEY; // string if email env vars set, undefined if not
consts.auth.password; // true | false (product decision)
clientEnv.posthog?.VITE_PUBLIC_POSTHOG_KEY; // client-side env
```

<details>
<summary><strong>Adding a new service feature</strong></summary>

1. Add an env group in the appropriate env file (`packages/utils/src/server/env.ts` and/or `apps/web/src/lib/env.ts`):
   ```ts
   myService: env.MY_SERVICE_KEY
     ? { MY_SERVICE_KEY: parseEnv("MY_SERVICE_KEY", z.string().min(1)) }
     : undefined,
   ```
2. Access via `serverEnv.myService?.MY_SERVICE_KEY` or `clientEnv.myService?.MY_SERVICE_KEY`
3. Add env vars to `.env.example`

</details>

### Authentication

[Better Auth](https://better-auth.com/) with email/password + passkey + Google OAuth + magic link + admin + i18n plugins. Config: `packages/auth/auth.ts`. Client: `apps/web/src/lib/auth-client.ts`. Full details in **`_auth` skill**.

### Transactional Emails

React Email + Resend in `packages/email/`. All templates i18n via Paraglide. Full details in **`_email` skill**.

### API (oRPC)

[oRPC](https://orpc.dev/) with TanStack Query. Procedures: `publicProcedure`, `protectedProcedure`, `adminProcedure`. Router: `packages/api/router.ts`. Client: `apps/web/src/lib/orpc.ts`. Usage: `useQuery(orpc.health.queryOptions())`. Full details in **`_database` skill**.

### Database

[Drizzle ORM](https://orm.drizzle.team/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + KV. Schema: `packages/db/schema.ts`. NEVER run `bun db:generate` or `bun db:migrate` via Claude Code. Full details in **`_database` skill**.

### SEO, Open Graph & LLMO

Per-page `head()` with `seoMeta()` + i18n. Dynamic OG images. JSON-LD. Sitemap + robots.txt + llms.txt. Full details in **`_seo` skill**.

### Analytics & Logging

[PostHog](https://posthog.com/) for analytics + error tracking. Structured logger in `packages/utils/src/server/logger.ts`. Full details in **`_analytics` skill**.

### Internationalization (i18n)

[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) — **ZERO TOLERANCE for non-i18n strings.** All user-facing text MUST come from Paraglide message functions. Import: `import { m } from "@/paraglide/messages"` (named import, NOT `import * as m`). Three projects: Frontend (`apps/web/messages/`), Backend (`packages/auth/messages/`), Email (`packages/email/messages/`). Full details in **`_i18n` skill**.

### Dependency Management

- Versions MUST be pinned (no `^` / `~`) — enforced by [syncpack](https://syncpack.dev/) + `bunfig.toml`
- New packages blocked if published < 3 days ago (`install.minimumReleaseAge`)
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) checks for vulnerabilities on `bun install`
- [Knip](https://knip.dev/) finds unused files, dependencies, and exports — run `bun knip`. Config: `knip.json`

### Infrastructure & CI/CD

[Alchemy](https://alchemy.run/) IaC for Cloudflare Workers + D1. IaC: `alchemy.run.ts`. Deploy: `cd apps/web && bun run deploy`. CI: `.github/workflows/ci.yml`. Full details in **`_infra` skill**.

---

## Development Rules

### Testing

- **Tests are REQUIRED** when adding/modifying endpoints, server functions, utilities, or business logic
- **ALL oRPC endpoints MUST have extensive tests** — auth middleware, input validation, happy paths, edge cases
- NEVER ship backend changes without test coverage
- Test files colocated: `{name}.test.ts` or `__tests__/` directory
- Runner: `bun:test`

**Test utilities** (`packages/auth/__tests__/test-utils.ts`, exported as `@packages/auth/test-utils`):

| Utility                                            | Purpose                                                      |
| :------------------------------------------------- | :----------------------------------------------------------- |
| `createTestUser({ email, name, password, role? })` | Creates user via auth handler, returns `{ userId, headers }` |
| `cleanupTestUser(userId)`                          | Deletes user + cascaded data                                 |
| `uniqueEmail(prefix)`                              | Generates unique email for test isolation                    |

**oRPC test pattern:**

```ts
import { createRouterClient } from "@orpc/server";
import { router } from "../router";

const client = createRouterClient(router, {
  context: { headers: adminHeaders },
});
const result = await client.admin.users.list({ limit: 10 });
```

### E2E Testing (Playwright)

[Playwright](https://playwright.dev/) E2E tests in `apps/e2e/`. See `apps/e2e/FEATURES.md` for full coverage table. See `.agents/skills/_e2e-testing/SKILL.md` for detailed guidance.

- Run: `bun e2e` from project root, or `cd apps/e2e && bunx playwright test`
- **Dev server auto-starts** — Playwright's `webServer` config in `playwright.config.ts` runs `bun dev` automatically and waits for `localhost:3000`. Reuses an existing server if already running.
- **MUST use `data-testid` selectors** for buttons/forms — NEVER text-based selectors (i18n breaks them)
- **MUST use `page.locator('#id')` for password fields** — `getByLabel` matches both input + toggle button
- **NEVER call API endpoints directly in E2E tests** for user actions — only use the API for test setup (`testUser` fixture). All user actions (sign in, sign out, change password, delete account) MUST go through the UI like a real user would.
- **Each test MUST have extensive JSDoc** at the file top explaining step-by-step what the test does
- **MUST wait for `/account` page to settle** before interacting (session data loading causes re-renders)
- Email verification: captured to `.email-captures/` as JSON, read via `getEmails` fixture
- Auth guards use isomorphic `getSession()` from `apps/web/src/lib/auth-client.ts` (works during SSR + CSR)

**Test fixtures** (`apps/e2e/tests/fixtures/auth.ts`):

- `testUser` — auto-fixture that creates a unique user via API and clears cookies. Returns `{ email, password, name }`. Test starts unauthenticated.
- `authenticatedPage` — auto-fixture that creates a user via API, then signs in through the UI. Returns `{ email, password, name }`. Test starts authenticated on the home page.
- `getEmails(email)` — reads captured emails from `.email-captures/` for a given recipient.
- `clearEmails()` — clears all captured emails.

### Skills

Custom skills (in `.agents/skills/`) MUST be prefixed with `_` (e.g., `_e2e-testing`, `_i18n`). Installed skills from registries have no prefix. This makes it immediately obvious which skills are ours vs. third-party.

**Auto-invoke skills** — MUST activate the relevant skill when working in its domain:

| Skill             | Trigger                                                                           |
| :---------------- | :-------------------------------------------------------------------------------- |
| `_frontend`       | Writing/modifying frontend code in `apps/web/`                                    |
| `_i18n`           | Adding/modifying user-facing text                                                 |
| `_e2e-testing`    | Adding/modifying E2E tests                                                        |
| `_auth`           | Auth flows, sessions, Better Auth config in `packages/auth/`                      |
| `_email`          | Email templates, triggers in `packages/email/`                                    |
| `_seo`            | New public routes, meta tags, SEO files                                           |
| `_analytics`      | PostHog events, error tracking, logging                                           |
| `_database`       | Schema, migrations, queries, oRPC procedures in `packages/db/` or `packages/api/` |
| `_infra`          | Alchemy IaC, deployment, CI/CD pipeline                                           |
| `_skill-creation` | Creating or modifying custom `_` skills                                           |

### General Rules

- **NEVER remove features, UI, or existing code unless explicitly asked.** Broken? FIX IT — don't delete it.
- **MUST ask at decision points.** Considering removing/replacing/restructuring code? STOP and ask.
- **NEVER use placeholder values when refactoring.** No `0`, `null`, `""` — compute every field properly.
- MUST reference code as `file_path:line_number`
- NEVER run dev servers or call API endpoints — they're already running in watch mode
- NEVER suggest restarting servers
- NEVER undo changes unless explicitly instructed
- **Do it the way you're told.** NEVER substitute with workarounds.
- NEVER use `setTimeout`, `sleep`, or `timeout` on bash commands
- NEVER run background tasks

### Git Workflow

- **NEVER commit or push unless explicitly instructed.** Show changes, wait for instruction.
- `"commit"` = commit EVERYTHING + push. `git add -A && git commit -m "..." && git push`
- `"commit staged only"` = commit only staged files + `--no-verify` + push
- **Review changes:** `git diff HEAD --stat` for summary, `git diff HEAD -- '*.ts' '*.tsx' '*.json' ':!bun.lock'` for code. NEVER read unfiltered diff.
- New branches: `git fetch origin && git checkout -b <name> origin/main` (always from remote)
- First push: `git push -u origin <branch-name>`
- GitHub ops: ALWAYS use `gh` CLI
- **When committing: MUST update CLAUDE.md AND README.md**

---

## Code Standards

**Clean Code + SOLID + KISS + YAGNI** — self-documenting, readable, minimal complexity.

### TypeScript

- **NEVER** `any`, `as any`, `interface`, or `catch (error: any)`
- MUST reuse existing types and Zod schemas
- Prefer optional chaining for callbacks: `onComplete?.(data)`
- Object params over positional: `function foo({ name }: { name: string })`

### Imports

- **NEVER use barrel files** (index.ts re-exports)
- **MUST import directly from source files**
- **NEVER use dynamic imports** unless genuine code splitting

### Comments

- NEVER add "what I changed" comments
- Only comment complex, non-obvious logic
- **MUST add reference links:** `// Reference: https://...`

### Debugging

- NEVER assume the cause — add targeted debugging
- Trace data flow backwards from the error
- `console.log('DEBUG:', JSON.stringify(data, null, 2))` — MUST clean up after
- MUST try solutions before suggesting them

### React & Frontend

**Mobile-first — NON-NEGOTIABLE.** Rules of Hooks (top level only). `"use client"` only when needed. Full details in **`_frontend` skill**.

### Implementation

- MUST implement FULLY — NEVER leave "to be implemented" placeholders
- NEVER create documentation files unless explicitly requested
- Code MUST be safe — NEVER allow unauthorized data access

---

## Key Files

| File                                     | Purpose                                                                                |
| :--------------------------------------- | :------------------------------------------------------------------------------------- |
| `packages/utils/src/shared/consts.ts`    | App constants + capability flags (appName, siteUrl, auth.password/passkey/magicLink)   |
| `packages/utils/src/server/env.ts`       | Server env vars + feature-gated groups                                                 |
| `packages/utils/src/server/logger.ts`    | Structured console logger (Workers-compatible)                                         |
| `packages/utils/src/server/posthog.ts`   | PostHog server client (error tracking + analytics)                                     |
| `packages/db/index.ts`                   | Database client (D1 via `initDb()` + proxy)                                            |
| `packages/db/schema.ts`                  | Drizzle schema + indexes                                                               |
| `packages/db/utils.ts`                   | `ulidPrimaryKey` helper                                                                |
| `packages/auth/auth.ts`                  | Better Auth config + i18n plugin + all email triggers                                  |
| `packages/auth/kv-storage.ts`            | Cloudflare KV adapter for Better Auth secondary storage (sessions + rate limiting)     |
| `packages/auth/auth-i18n.ts`             | `buildAuthTranslations()` — Paraglide → Better Auth error codes (null if English-only) |
| `packages/api/base.ts`                   | Procedure definitions (public/protected/admin)                                         |
| `packages/api/router.ts`                 | oRPC router                                                                            |
| `apps/web/src/lib/env.ts`                | Client features + env groups                                                           |
| `apps/web/src/lib/orpc.ts`               | oRPC client (SSR + browser)                                                            |
| `apps/web/src/lib/auth-client.ts`        | Better Auth React client                                                               |
| `apps/web/src/lib/schemas.ts`            | Shared Zod schemas                                                                     |
| `apps/web/src/lib/seo.ts`                | `seoMeta()` — generates OG + Twitter + meta tags from title/desc                       |
| `apps/web/src/lib/zod-form-resolver.ts`  | Zod v4 resolver for react-hook-form                                                    |
| `apps/web/src/routes/api/icon.tsx`       | Dynamic favicon (dark mode)                                                            |
| `apps/web/src/routes/api/og.tsx`         | Dynamic OG image                                                                       |
| `apps/web/src/components/auth/`          | Auth forms                                                                             |
| `apps/web/src/components/settings/`      | Account settings cards                                                                 |
| `apps/web/src/server.ts`                 | Server entry — paraglide middleware for per-request locale                             |
| `apps/web/src/router.tsx`                | TanStack Router config — rewrite with locale URL support                               |
| `apps/web/vite.config.ts`                | Vite config (paraglide, tailwind, tanstack, alchemy, react compiler)                   |
| `alchemy.run.ts`                         | Alchemy IaC — D1 + KV + TanStack Start worker definition                               |
| `vite.config.ts`                         | Root Vite+ config (staged linting, oxlint options — NOT used for Vite dev/build)       |
| `.oxlintrc.json`                         | Oxlint config                                                                          |
| `.oxfmtrc.jsonc`                         | Oxfmt config                                                                           |
| `.syncpackrc`                            | Syncpack config                                                                        |
| `knip.json`                              | Knip config (unused files, deps, exports)                                              |
| `apps/web/wrangler.jsonc`                | Fallback wrangler config (manual CLI use only — Alchemy generates its own)             |
| `.github/workflows/ci.yml`               | CI pipeline                                                                            |
| `packages/email/email-capture.ts`        | Email capture for E2E test verification (dev/test only)                                |
| `packages/email/templates.ts`            | Email render functions + localized subject helpers                                     |
| `packages/email/locale.ts`               | `loc()` — locale string → Paraglide type bridge                                        |
| `packages/email/emails/email-layout.tsx` | Shared email layout component                                                          |
| `packages/auth/messages/en.json`         | Server i18n strings (auth error messages with `auth_` prefix)                          |
| `packages/email/messages/en.json`        | Email i18n strings                                                                     |
| `bunfig.toml`                            | Bun config (exact versions, min release age)                                           |

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ commands take precedence over `package.json` scripts. If there is a `test` script defined in `scripts` that conflicts with the built-in `vp test` command, run it using `vp run test`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
