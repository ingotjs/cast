# Cast

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

| Package             | Alias             | Description                                                                |
| :------------------ | :---------------- | :------------------------------------------------------------------------- |
| `apps/web`          | —                 | TanStack Start app (Vite + Router + Cloudflare Workers). Admin at `/admin` |
| `packages/db`       | `@ingot/db`       | Drizzle ORM + D1 schema, migrations, database client                       |
| `packages/utils`    | `@ingot/utils`    | Shared consts (`shared/`), server env/logger/posthog (`server/`)           |
| `packages/auth`     | `@ingot/auth`     | Better Auth config, KV storage, i18n                                       |
| `packages/api`      | `@ingot/api`      | oRPC router + procedures (public/protected/admin)                          |
| `packages/email`    | `@ingot/email`    | React Email templates + Resend + email capture (E2E)                       |
| `packages/ui`       | `@ingot/ui`       | shadcn v4 + Tailwind CSS + Base UI                                         |
| `apps/e2e`          | —                 | Playwright E2E tests (auth flows, email verification)                      |
| `packages/prospect` | `@ingot/prospect` | E2E coverage framework (defineE2ECoverage, testId, setup validation)       |
| `packages/config`   | `@ingot/config`   | Shared TypeScript configs                                                  |

**Dependency graph:** `@ingot/db` (leaf) ← `@ingot/auth` (+ `@ingot/email`, `@ingot/utils`) ← `@ingot/api`

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

**Ignored paths:** `.agents`, `.alchemy`, `.claude`, `**/alchemy.run.ts`, `**/routeTree.gen.ts`, `**/locales/**/messages.js`, `**/*.md`

</details>

---

## Stack

### Environment Variables & Feature Flags

**NEVER use `process.env` or `import.meta.env` directly.** Enforced by oxlint. Only `**/env.ts` files may access them. Service features toggled by env var presence, capability flags in `consts.auth`. Full details in **`_env` skill**.

### Authentication

[Better Auth](https://better-auth.com/) with email/password + passkey + Google OAuth + magic link + admin + i18n plugins. Config: `packages/auth/auth.ts`. Client: `apps/web/src/lib/auth-client.ts`. Full details in **`_auth` skill**.

### Transactional Emails

React Email + Resend in `packages/email/`. All templates i18n via Lingui. Full details in **`_email` skill**.

### API (oRPC)

[oRPC](https://orpc.dev/) with TanStack Query. Procedures: `publicProcedure`, `protectedProcedure`, `adminProcedure`. Router: `packages/api/router.ts`. Client: `apps/web/src/lib/orpc.ts`. Usage: `useQuery(orpc.health.queryOptions())`. Full details in **`_database` skill**.

### Database

[Drizzle ORM](https://orm.drizzle.team/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + KV + [Drizzle-Zod](https://orm.drizzle.team/docs/zod) for schema-derived validation. Schema: `packages/db/schema.ts`. Zod schemas: `packages/db/zod-schema.ts`. NEVER run `bun db:generate` or `bun db:migrate` via Claude Code. Full details in **`_database` skill**.

### SEO, Open Graph & LLMO

Per-page `head()` with `seoMeta()` + i18n. Dynamic OG images. JSON-LD. Sitemap + robots.txt + llms.txt. Full details in **`_seo` skill**.

### Analytics & Logging

[PostHog](https://posthog.com/) for analytics + error tracking. Structured logger in `packages/utils/server/logger.ts`. Full details in **`_analytics` skill**.

### Internationalization (i18n)

[Lingui](https://lingui.dev/) — **ZERO TOLERANCE for non-i18n strings.** All user-facing text MUST use Lingui macros. Components: `<Trans>` from `@lingui/react/macro`. Strings in hooks: `useLingui()` → `t`. head()/server code: `msg` descriptors + `getI18n()._()`. Email/auth: `msg` + `i18n._()`. Catalogs: `apps/web/src/locales/`, `packages/email/locales/`, `packages/auth/locales/`. Full details in **`_i18n` skill**.

### Dependency Management

- Versions MUST be pinned (no `^` / `~`) — enforced by [syncpack](https://syncpack.dev/) + `bunfig.toml`
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) checks for vulnerabilities on `bun install`
- [Knip](https://knip.dev/) finds unused files, dependencies, and exports — run `bun knip`. Config: `.etc/knip.json`

### Infrastructure & CI/CD

[Alchemy](https://alchemy.run/) IaC for Cloudflare Workers + D1. IaC: `alchemy.run.ts`. Deploy: `cd apps/web && bun run deploy`. CI: `.github/workflows/ci.yml`. Full details in **`_infra` skill**.

---

## Development Rules

### Testing

Tests are REQUIRED when adding/modifying endpoints, server functions, utilities, or business logic. NEVER ship backend changes without test coverage. Full details in **`_testing` skill**.

### E2E Testing (Playwright)

[Playwright](https://playwright.dev/) E2E tests in `apps/e2e/`. Full details in **`_e2e-testing` skill**.

### Skills

Custom skills (in `.agents/skills/`) MUST be prefixed with `_` (e.g., `_e2e-testing`, `_i18n`). Installed skills from registries have no prefix. This makes it immediately obvious which skills are ours vs. third-party.

**Auto-invoke skills** — MUST activate the relevant skill when working in its domain:

| Skill             | Trigger                                                                              |
| :---------------- | :----------------------------------------------------------------------------------- |
| `_frontend`       | Writing/modifying frontend code in `apps/web/`                                       |
| `_i18n`           | Adding/modifying user-facing text                                                    |
| `_e2e-testing`    | Adding/modifying E2E tests                                                           |
| `_auth`           | Auth flows, sessions, Better Auth config in `packages/auth/`                         |
| `_email`          | Email templates, triggers in `packages/email/`                                       |
| `_seo`            | New public routes, meta tags, SEO files                                              |
| `_analytics`      | PostHog events, error tracking, logging                                              |
| `_env`            | Adding env vars, toggling service features or capability flags                       |
| `_database`       | Schema, migrations, queries, oRPC procedures in `packages/db/` or `packages/api/`    |
| `_infra`          | Alchemy IaC, deployment, CI/CD pipeline                                              |
| `_testing`        | Writing/modifying unit or integration tests                                          |
| `_linear`         | Working on Linear tickets or given a Linear link                                     |
| `_skill-creation` | Creating or modifying custom `_` skills                                              |
| `_brand-naming`   | Brainstorming names for projects, packages, companies, or checking name availability |

### General Rules

- **NEVER remove features, UI, or existing code unless explicitly asked.** Broken? FIX IT — don't delete it.
- **NEVER discard unstaged changes** (`git checkout .`, `git restore .`, `git clean`, `git reset --hard`) to "start fresh" when debugging. Fix the problem — don't nuke the work.
- **NEVER remove or rewrite code as a first attempt to fix something.** Diagnose first, then apply the minimal targeted fix. Deleting code you don't understand is not debugging.
- **MUST ask before making unrequested changes.** If a fix involves modifying code outside the immediate scope, or removing/replacing/restructuring anything, STOP and ask. The user decides what changes are acceptable.
- **NEVER use placeholder values when refactoring.** No `0`, `null`, `""` — compute every field properly.
- MUST reference code as `file_path:line_number`
- NEVER run dev servers or call API endpoints — they're already running in watch mode
- NEVER suggest restarting servers
- NEVER undo changes unless explicitly instructed
- **Do it the way you're told.** NEVER substitute with workarounds.
- NEVER use `setTimeout`, `sleep`, or `timeout` on bash commands
- NEVER run background tasks

### Git Workflow

- **NEVER commit or push unless explicitly instructed.** Show changes, wait for instruction. **NEVER commit/push automatically as part of a workflow** — even if a skill or workflow says "commit and push", STOP, show what changed, and wait for explicit instruction.
- `"commit"` = commit EVERYTHING + push. `git add -A && git commit -m "..." && git push`
- `"commit staged only"` = commit only staged files + `--no-verify` + push
- When on a non-main branch: after the final commit + push for a task, **MUST auto-create a PR** without waiting to be asked
- **Review changes:** `git diff HEAD --stat` for summary, `git diff HEAD -- '*.ts' '*.tsx' '*.json' ':!bun.lock'` for code. NEVER read unfiltered diff.
- New branches: `git fetch origin && git checkout -b <name> origin/main` (always from remote)
- First push: `git push -u origin <branch-name>`
- GitHub ops: ALWAYS use `gh` CLI
- **When given a GitHub PR link**, checkout its branch as the **ABSOLUTE FIRST ACTION** — before reading code, before analyzing. Use `gh pr view <number> --json headRefName --jq '.headRefName'` to get the branch name, then checkout.
- **When committing: MUST update CLAUDE.md AND README.md**
- **NEVER add Co-Authored-By or any AI attribution to commit messages**
- **NEVER use `--no-verify`** unless the user explicitly says to skip hooks. If the hook fails, FIX the issue — don't bypass it. If you can't fix it, ask the user for permission to skip.

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
- `console.log('DEBUG:', JSON.stringify(data, null, 2))` — MUST clean up after. Use a common keyword prefix (e.g., `'DEBUG_AUTH:'`) so logs are easy to filter in the browser console
- MUST try solutions before suggesting them

### React & Frontend

**Mobile-first — NON-NEGOTIABLE.** Rules of Hooks (top level only). `"use client"` only when needed. Full details in **`_frontend` skill**.

### Implementation

- MUST implement FULLY — NEVER leave "to be implemented" placeholders
- NEVER create documentation files unless explicitly requested
- Code MUST be safe — NEVER allow unauthorized data access

---

## Key Files

| File                                     | Purpose                                                                              |
| :--------------------------------------- | :----------------------------------------------------------------------------------- |
| `packages/utils/shared/consts.ts`        | App constants + capability flags (appName, siteUrl, auth.password/passkey/magicLink) |
| `packages/utils/server/env.ts`           | Server env vars + feature-gated groups                                               |
| `packages/utils/server/logger.ts`        | Structured console logger (Workers-compatible)                                       |
| `packages/utils/server/posthog.ts`       | PostHog server client (error tracking + analytics)                                   |
| `packages/db/index.ts`                   | Database client (D1 via `initDb()` + proxy)                                          |
| `packages/db/schema.ts`                  | Drizzle schema + indexes                                                             |
| `packages/db/zod-schema.ts`              | Drizzle-Zod select/insert/update schemas for all tables                              |
| `packages/db/utils.ts`                   | `ulidPrimaryKey` helper                                                              |
| `packages/auth/auth.ts`                  | Better Auth config + i18n plugin + all email triggers                                |
| `packages/auth/kv-storage.ts`            | Cloudflare KV adapter for Better Auth secondary storage (sessions + rate limiting)   |
| `packages/auth/auth-i18n.ts`             | `buildAuthTranslations()` — Lingui → Better Auth error codes (null if English-only)  |
| `packages/api/base.ts`                   | Procedure definitions (public/protected/admin)                                       |
| `packages/api/router.ts`                 | oRPC router                                                                          |
| `apps/web/src/lib/env.ts`                | Client features + env groups                                                         |
| `apps/web/src/lib/orpc.ts`               | oRPC client (SSR + browser)                                                          |
| `apps/web/src/lib/auth-client.ts`        | Better Auth React client                                                             |
| `apps/web/src/lib/schemas.ts`            | Shared Zod schemas                                                                   |
| `apps/web/src/lib/seo.ts`                | `seoMeta()` — generates OG + Twitter + meta tags from title/desc                     |
| `apps/web/src/lib/zod-form-resolver.ts`  | Zod v4 resolver for react-hook-form                                                  |
| `apps/web/src/routes/api/icon.tsx`       | Dynamic favicon (dark mode)                                                          |
| `apps/web/src/routes/api/og.tsx`         | Dynamic OG image                                                                     |
| `apps/web/src/components/auth/`          | Auth forms                                                                           |
| `apps/web/src/components/settings/`      | Account settings cards                                                               |
| `apps/web/src/server.ts`                 | Server entry — Lingui i18n middleware for per-request locale                         |
| `apps/web/src/router.tsx`                | TanStack Router config                                                               |
| `apps/web/vite.config.ts`                | Vite config (lingui, tailwind, tanstack, alchemy, react compiler)                    |
| `alchemy.run.ts`                         | Alchemy IaC — D1 + KV + TanStack Start worker definition                             |
| `vite.config.ts`                         | Root Vite+ config (staged linting, oxlint options — NOT used for Vite dev/build)     |
| `.oxlintrc.json`                         | Oxlint config                                                                        |
| `.oxfmtrc.jsonc`                         | Oxfmt config                                                                         |
| `.etc/.syncpackrc`                       | Syncpack config                                                                      |
| `.etc/knip.json`                         | Knip config (unused files, deps, exports)                                            |
| `.github/workflows/ci.yml`               | CI pipeline                                                                          |
| `packages/email/email-capture.ts`        | Email capture for E2E test verification (dev/test only)                              |
| `packages/email/templates.ts`            | Email render functions + localized subject helpers                                   |
| `packages/email/locale.ts`               | Re-exports `createEmailI18n()` from `i18n.ts`                                        |
| `packages/email/emails/email-layout.tsx` | Shared email layout component                                                        |
| `packages/auth/locales/en/messages.po`   | Server i18n strings (auth error messages with `auth_` prefix)                        |
| `packages/email/locales/en/messages.po`  | Email i18n strings (generated by `lingui extract`)                                   |
| `apps/web/src/locales/en/messages.po`    | Frontend i18n strings (generated by `lingui extract`)                                |
| `apps/web/src/lib/i18n.ts`               | Lingui i18n setup — `getI18n()`, `runWithI18n()`, `loadCatalog()`                    |
| `packages/email/i18n.ts`                 | `createEmailI18n()` — per-render i18n instance for email templates                   |
| `package.json` `"lingui"`                | Lingui config — catalog paths for web + email                                        |
| `bunfig.toml`                            | Bun config (exact versions, min release age)                                         |

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
