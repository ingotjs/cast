# Start

> **Keyword Usage:** When writing or updating CLAUDE.md or other instructional files, use **MUST** and **NEVER** keywords to enforce critical requirements. These keywords signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep docs in sync — THIS IS CRITICAL:** CLAUDE.md and README.md MUST ALWAYS be updated when making ANY change to: project structure, new packages/dependencies, new features, config changes, scripts, commands, hosting setup, env vars, or anything a developer or user would want to know. README.md is the public face of this project — it MUST showcase what makes this project great. CLAUDE.md is the internal guide — it MUST reflect the current state of the codebase. **Failing to update these files is unacceptable.** If in doubt, update them.
>
> **Prefer CLAUDE.md over memory:** Always save instructions and feedback in this file instead of the local memory system (`~/.claude/projects/.../memory/`). CLAUDE.md is committed to the repo and persists across machines. NEVER use the memory system.

Turborepo monorepo using bun as the package manager.

## Structure

- `apps/web` — TanStack Start app (Vite + TanStack Router + Nitro, deployed on Railway). Includes admin dashboard at `/admin` (role-guarded).
- `packages/server` — Server-side logic (`@packages/server`) — oRPC router, procedures, Drizzle + PGlite/PostgreSQL, Better Auth (with admin + passkey plugins)
- `packages/shared` — Shared utilities (`@packages/shared`) — feature flags, consts, error handling (client + server)
- `packages/email` — Email templates (`@packages/email`) — react-email + Resend
- `packages/ui` — Shared UI component library (`@packages/ui`) — shadcn v4 + Tailwind CSS + Base UI
- `packages/typescript-config` — Shared TS config (`@packages/typescript-config`)

## Internal Packages

We use **Just-in-Time Packages** — internal packages export raw TypeScript source (no build step). The consuming app transpiles them directly.

Reference: https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages

## Type Checking

We use [typescript-go](https://github.com/microsoft/typescript-go) (`tsgo`) for type checking via `@typescript/native-preview`. The regular `typescript` package is still installed for tooling compatibility.

## Linting & Formatting

We use [Ultracite](https://github.com/haydenbleasel/ultracite), a zero-config preset that enforces strict code quality through Oxlint + Oxfmt. Config files: `.oxlintrc.json` and `.oxfmtrc.jsonc`.

**Key oxlint overrides (`.oxlintrc.json`):**

- `eslint/sort-keys`: off
- `node/no-process-env`: error (only `**/env.ts` exempt via override)
- `promise/prefer-await-to-callbacks`: off
- `react-perf/jsx-no-new-function-as-prop`: off (React Compiler handles memoization)
- `typescript/consistent-type-definitions`: error, "type" (NEVER use `interface` — except for module augmentation like TanStack Router's `Register`)

**Ignored paths:** `.agents`, `.claude`, `**/routeTree.gen.ts`, `**/*.md`

## Environment Variables

**NEVER use `process.env` or `import.meta.env` directly.** Enforced by `node/no-process-env` oxlint rule. Use the typed env objects instead:

- **Server env:** `import { serverEnv } from "@packages/server/env"` — for server-only vars (`DATABASE_URL`, `URL`, `NODE_ENV`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, etc.)
- **Client env:** `import { env } from "@/lib/env"` — for `VITE_` prefixed client vars (`VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`)

The only files allowed to access `process.env` are the env definition files themselves (`**/env.ts`).

## Feature Flags

Feature flags live in `packages/shared/src/consts.ts`. Each feature has an `enabled: { dev: boolean, prod: boolean }` object that controls:

- Whether the feature is active in each environment
- Whether related env vars are required or optional (via `requireIfEnabled()`)

Current features: `posthog`, `googleOAuth`, `email`.

## Authentication

- [Better Auth](https://better-auth.com/) with email/password + passkey + admin plugins
- Auth config at `packages/server/src/auth.ts`
- Auth UI via [@daveyplate/better-auth-ui](https://better-auth-ui.com/) — pre-built sign-in/sign-up/forgot-password forms at `/auth/$path`
- `AuthUIProvider` wraps the app in `apps/web/src/components/providers.tsx`
- Auth client at `apps/web/src/lib/auth-client.ts` — exports `signIn`, `signUp`, `signOut`, `useSession`, `passkey`
- Auth API route at `apps/web/src/routes/api/auth.$.ts`
- Admin role guard on `/admin` routes via `beforeLoad` (checks `user.role === "admin"`)
- Session cookie caching (5 min), 30-day expiry with daily refresh
- `trustedOrigins` configured for CSRF protection
- `BETTER_AUTH_SECRET` required in prod, auto-generated static fallback in dev
- `user.additionalFields.role` configured so `role` is included in user type
- Sonner `<Toaster />` in root layout for auth notifications
- `apps/web/src/styles.css` imports `@packages/ui/globals.css` for shadcn CSS variables (required by auth UI)

## API (oRPC)

- [oRPC](https://orpc.dev/) with TanStack Query integration — no contract-first, define procedures inline
- Three procedure levels: `publicProcedure`, `protectedProcedure` (auth required), `adminProcedure` (admin role required)
- Base procedures at `packages/server/src/orpc/base.ts`
- Router at `packages/server/src/orpc/router.ts`, API route at `apps/web/src/routes/api/rpc.$.ts`
- Client with SSR support at `apps/web/src/lib/orpc.ts` (uses `createIsomorphicFn` — server calls bypass HTTP, client uses `RPCLink`)
- Admin procedures under `router.admin.users.*` (list, ban, unban, setRole, remove)
- Usage in components: `import { orpc } from "@/lib/orpc"` then `useQuery(orpc.health.queryOptions())`

## Database

- [Drizzle ORM](https://orm.drizzle.team/) with auto-switching PGlite (local dev) / PostgreSQL (production)
- `DATABASE_URL` optional in dev (uses PGlite), required in prod (enforced via `requireIfEnabled`)
- Schema at `packages/server/src/db/schema.ts` — Better Auth tables (users, sessions, accounts, verifications, passkeys) with indexes
- Local database stored in `.pglite/` (gitignored)
- Migrations in `packages/server/drizzle/` — auto-applied on Railway deploy via `preDeployCommand` in `railway.json`
- NEVER run `bun db:generate` or `bun db:migrate` via Claude Code — requires interactive input. Prompt the user to run manually.

## Analytics

- [PostHog](https://posthog.com/) via `@posthog/react` — `PostHogProvider` wraps the app (conditional on `VITE_PUBLIC_POSTHOG_KEY`)
- Admin analytics page at `/admin/analytics`

## Internationalization (i18n)

We use [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe i18n. **All user-facing text (frontend and backend) MUST be internationalized** — never hardcode user-facing strings.

**i18n projects (separate concerns):**

- `apps/web/messages/` — frontend UI text
- `packages/server/messages/` — backend text (error messages, API responses)
- `packages/email/messages/` — email template text

**Languages:** Currently only English (`en`). When adding a new string for English, you MUST also add translations for all other languages listed in the `locales` array of each `project.inlang/settings.json`.

**Translations:** Do NOT use machine translation. Write translations manually with full project context — understand where and how the text is used before translating.

**Usage:** Import from the generated `paraglide/messages` in each package.

**Server-side i18n:** Paraglide's `overwriteGetLocale()` handles per-request locale on the server. Reference: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy#server-side

**Zod validation errors:**

- **Frontend:** Zod's built-in locale system (`z.config()`) — set on app init based on user's locale.
- **Backend:** Use paraglide message functions in Zod custom error messages (e.g., `z.string({ error: () => m.field_required() })`). These resolve per-request via paraglide's server runtime.

## Dependency Management

- All dependency versions MUST be pinned (no `^` or `~`). Enforced by [syncpack](https://syncpack.dev/) and `bunfig.toml` (`install.exact = true`).
- New packages won't install if published less than 3 days ago (`install.minimumReleaseAge` in `bunfig.toml`).
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) is installed for supply chain security scanning (free tier). It checks for known vulnerabilities on `bun install`.

## Hosting

Deployed on [Railway](https://railway.com/) via `railway.json`:

- **Build:** Railpack
- **Pre-deploy:** `bun db:migrate` (auto-applies pending migrations)
- **Start:** `bun run --cwd apps/web start` (Nitro server)
- **Health check:** `/api/auth/ok`

Reference: https://tanstack.com/start/latest/docs/framework/react/guide/hosting#railway--official-partner

## Commands

- `bun install` — Install dependencies
- `bun dev` — Run all apps in dev mode (auto-runs `bun install` first)
- `bun dev:email` — Run email template preview (port 3002)
- `bun build` — Build all apps
- `bun ok` — Run all checks (type check + lint + tests). Use this to validate changes.
- `bun ok:ci` — Same as `bun ok` but without auto-fixes (for CI)
- `bun db:generate` — Generate database migrations (user MUST run manually — requires interactive input)
- `bun db:migrate` — Apply database migrations (user MUST run manually)
- `bun db:studio` — Open Drizzle Studio

---

## Testing

- **Tests are REQUIRED.** MUST add tests when adding or modifying endpoints, server functions, utilities, or business logic.
- Test files colocated with source: `{name}.test.ts` as siblings or in `__tests__/` directory.
- Use `bun:test` for packages/server tests.
- After completing any task, verify test coverage for changed files:
  - Modified behavior — update affected tests
  - New functionality — add tests for it
  - Tests MUST catch regressions
- NEVER ship backend changes without test coverage.

## Quality Verification

- **ALWAYS run `bun ok` after finishing any task or when facing issues**
- A task is NOT complete until `bun ok` passes fully
- **`bun ok` MUST ALWAYS be run from the project root directory** — NEVER from subdirectories
- **ALWAYS use `bun ok`** for type checking and linting — NEVER use `bun ts`, `bun lint`, or `tsc` directly
- **NEVER run `tsc` or `tsgo` directly** — always use `bun ok`
- **NEVER run `bun build`** — use `bun ok` to validate types and linting

## General Rules

- **NEVER remove features, UI elements, or content unless explicitly asked.** If something is broken, FIX IT — NEVER delete or disable it.
- **NEVER use placeholder/dummy values when refactoring.** Every field MUST be properly computed. Hardcoding `0`, `null`, `""` is forbidden. If a field existed before, the new implementation MUST compute it correctly.
- When referring to code (files, functions, lines), MUST ALWAYS provide the reference in `file_path:line_number` format.
- NEVER try to run development servers — they should already be running and are not accessible to you. NEVER try to call API endpoints.
- **NEVER suggest restarting any server.** All services run in watch mode and automatically pick up code changes.
- NEVER undo changes or revert to previous code unless explicitly instructed.
- **If told to do something in a specific way, MUST do it that way.** NEVER substitute with workarounds or alternative approaches.
- When in doubt, ask for clarifications.
- NEVER use `setTimeout` or similar for delaying code execution. Use proper async/await patterns or event-driven approaches.
- NEVER use `sleep` commands — they are unnecessary and wasteful.
- NEVER add `timeout` to bash commands.
- NEVER run background tasks. Run everything directly.

## Git Workflow

- **NEVER commit or push code unless explicitly instructed.** Do not commit as part of a workflow (e.g., after fixing PR comments, after completing a task, after `bun ok`). Show what changed and wait for explicit instruction.
- When told to "commit", **MUST commit EVERYTHING** — all unstaged, staged, modified, and untracked files. Also push to the remote. **NEVER skip files or question what should be committed.** The instruction is absolute.
- When told to "commit staged only", commit ONLY what's already staged. Use `git commit --no-verify` to skip the pre-commit hook (which auto-stages formatting changes). Then push.
- Use a single chained command for committing: `git add -A && git commit -m "..." && git push`. No separate calls.
- **When reviewing changes for a commit message**, use `git diff HEAD --stat` for a quick summary. If you need to see actual code changes, filter out noise: `git diff HEAD -- '*.ts' '*.tsx' '*.json' ':!bun.lock'`. NEVER read the full unfiltered `git diff` — it's huge (especially `bun.lock`) and wastes time with chunked reads.
- When creating a new branch, MUST ALWAYS base it on `origin/main` (remote), not local `main`. Use `git fetch origin && git checkout -b <branch-name> origin/main`.
- When creating a branch, MUST immediately set tracking on first push with `git push -u origin <branch-name>`.
- MUST ALWAYS use `gh` CLI for GitHub operations (viewing PRs, checking CI status, etc.) — NEVER access GitHub URLs directly.
- **CRITICAL: When committing, MUST update `CLAUDE.md` AND `README.md` to reflect ALL changes being committed.** Every new feature, config change, script change, or architectural decision MUST be documented. This is NOT optional — undocumented changes are unacceptable.

## Code Standards

Follow **Clean Code + SOLID + KISS + YAGNI**:

- **Clean Code**: Self-documenting, readable code with meaningful names and single responsibility
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Simplest solution that solves the problem, avoid over-engineering
- **YAGNI**: Don't add functionality until actually needed

### TypeScript Conventions

- **NEVER use `any` type** — Use `unknown` if type is truly unknown
- **NEVER use `as any` assertions** — Find the proper type or use specific type assertions
- **NEVER use `interface`** — Always use `type` instead
- NEVER use `catch (error: any)` — leave it untyped so `unknown` is used by TS
- MUST reuse existing types — NEVER create duplicate types
- MUST prefer type-safe solutions. MUST use existing Zod schemas and types if they fit.
- Prefer optional chaining for callbacks: `onComplete?.(data)` instead of `if (onComplete) onComplete(data)`
- Add comments to properties of object types only if not self-explanatory (skip obvious ones like `className`)

### Import Conventions

- **NEVER use barrel files** — Barrel files (index.ts files that re-export everything) are forbidden
- **MUST ALWAYS import directly from source files** — Import from the actual file where the code is defined
- **NEVER use dynamic imports** — MUST use static `import` over `await import()`. Only use dynamic imports for genuine code splitting or conditional loading.

### Function Parameters

- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

### Comments

- NEVER add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- **MUST ALWAYS add reference links** when implementing code from documentation or external sources
  - Format: `// Reference: https://example.com/docs/feature`

### Console Logging (Debug)

- MUST ALWAYS stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- MUST use a common keyword prefix (e.g., `DEBUG:`) for easy filtering and bulk copying
- **MUST ALWAYS clean up debug code** once the root cause is found

### React Conventions

- **Server Components by default** — Use `"use client"` directive only when needed
- **ALWAYS follow the Rules of Hooks** — Only call hooks at the top level, never inside loops/conditions/nested functions. Do not return early if there's a hook later.

#### CSS Flexbox — `min-w-0` Pattern

**Problem**: Flex items have `min-width: auto` by default, preventing them from shrinking below their content size. This breaks `truncate` on text elements.

**Pattern for truncating text in flex layouts**:

```tsx
<div className="flex min-w-0">
  <Icon className="flex-shrink-0" /> {/* Fixed elements: Prevent shrinking */}
  <span className="min-w-0 flex-1 truncate">
    {" "}
    {/* Text: Shrink + truncate */}
    Long text here...
  </span>
  <Button className="flex-shrink-0" /> {/* Fixed elements: Prevent shrinking */}
</div>
```

### Implementation Standards

- When asked to implement something, MUST implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later"
- If something cannot be completed, MUST explain why explicitly rather than leaving incomplete code
- **NEVER create documentation files** unless explicitly requested — the only exception is updating CLAUDE.md when architecture changes

### Debugging Mindset

- **NEVER assume the cause** — MUST add targeted debugging to see what's actually happening
- **MUST trace data flow backwards** — From error location, work backwards to see where data originates
- **MUST question "obvious" fixes** — If data should exist, find out why it doesn't
- **MUST try solutions before suggesting them** — Attempt fixes until things fully work
- **MUST ALWAYS clean up debug code** once the root cause is found

### Security

- Code MUST ALWAYS be safe. NEVER allow users to change other users' data when they shouldn't.

## Key File Locations

Quick reference for the most important files:

- `packages/shared/src/consts.ts` — Feature flags and app constants
- `packages/server/src/env.ts` — Server env vars (t3-env)
- `packages/server/src/auth.ts` — Better Auth configuration
- `packages/server/src/db/index.ts` — Database client (PGlite/PostgreSQL auto-switch)
- `packages/server/src/db/schema.ts` — Drizzle schema (Better Auth tables + indexes)
- `packages/server/src/db/utils.ts` — `uuidPrimaryKey` helper for custom tables
- `packages/server/src/orpc/base.ts` — oRPC procedure definitions (public/protected/admin)
- `packages/server/src/orpc/router.ts` — oRPC router
- `apps/web/src/lib/env.ts` — Client env vars (t3-env, VITE\_ prefix)
- `apps/web/src/lib/orpc.ts` — oRPC client (SSR + client)
- `apps/web/src/lib/auth-client.ts` — Better Auth React client
- `apps/web/src/lib/posthog.ts` — PostHog config
- `apps/web/src/components/providers.tsx` — AuthUIProvider wrapper
- `apps/web/src/routes/admin/route.tsx` — Admin layout + role guard
- `apps/web/vite.config.ts` — Vite config (paraglide, tailwind, tanstack, nitro, react compiler)
- `.oxlintrc.json` — Oxlint config with custom rules
- `.oxfmtrc.jsonc` — Oxfmt config (formatting)
- `.syncpackrc` — Syncpack config (version pinning)
- `railway.json` — Railway deployment config
- `bunfig.toml` — Bun config (exact versions, minimum release age)
