# OmegaStart

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep docs in sync — THIS IS CRITICAL:** CLAUDE.md and README.md MUST ALWAYS be updated when making ANY change to: project structure, packages, features, config, scripts, commands, hosting, env vars, or anything a developer would want to know. **Failing to update these files is unacceptable.** If in doubt, update them.
>
> **README.md tone — THIS IS A PUBLIC REPO:** Written for smart developers — respect their intelligence. Be direct and factual, not salesy. NEVER pad with obvious filler ("changes reflect instantly", "TypeScript catches every broken consumer") or implementation details no one asked for ("simulated locally via miniflare"). State what matters, skip what's obvious. Highlight what's genuinely exceptional about the DX — but earn it with substance, not buzzwords.
>
> **Prefer CLAUDE.md over memory:** Save instructions and feedback here, not in `~/.claude/projects/.../memory/`. CLAUDE.md is committed to the repo and persists across machines. NEVER use the memory system.

Turborepo monorepo. Bun package manager. [Just-in-Time Packages](https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages) — internal packages export raw TypeScript (no build step).

---

## Quick Reference

### Commands

| Command                 | Description                                                |
| :---------------------- | :--------------------------------------------------------- |
| `bun dev`               | Start all apps in dev mode (auto-installs deps)            |
| `bun dev:email`         | Email template preview (port 3002)                         |
| `bun ok`                | Type check + lint + tests — **run after every task**       |
| `bun ok:ci`             | Same without auto-fixes (CI)                               |
| `bun db:generate`       | Generate migrations (**user MUST run manually**)           |
| `bun db:migrate`        | Apply migrations locally (**user MUST run manually**)      |
| `bun db:migrate:remote` | Apply migrations to remote D1 (**user MUST run manually**) |
| `bun db:studio`         | Open Drizzle Studio                                        |
| `bun e2e`               | Run Playwright E2E tests (from `apps/e2e`)                 |

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

[Ultracite](https://github.com/haydenbleasel/ultracite) — zero-config Oxlint + Oxfmt. Config: `.oxlintrc.json` + `.oxfmtrc.jsonc`.

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

[Better Auth](https://better-auth.com/) with email/password + passkey + Google OAuth + magic link + admin + i18n plugins.

| What              | Where                                                                                                            |
| :---------------- | :--------------------------------------------------------------------------------------------------------------- |
| Auth config       | `packages/auth/auth.ts`                                                                                          |
| KV storage        | `packages/auth/kv-storage.ts` — Cloudflare KV adapter for Better Auth secondary storage                          |
| Auth i18n builder | `packages/auth/auth-i18n.ts` — builds translations dict from Paraglide messages                                  |
| Auth client       | `apps/web/src/lib/auth-client.ts` — exports `signIn`, `signUp`, `signOut`, `useSession`, `passkey`, `authClient` |
| Auth API route    | `apps/web/src/routes/api/auth.$.ts`                                                                              |
| Auth forms        | `apps/web/src/components/auth/` — sign-in, sign-up, forgot/reset password, social OAuth, magic link              |
| Account settings  | `apps/web/src/components/settings/` — profile, password, sessions, passkeys, delete                              |
| Password schema   | `apps/web/src/lib/schemas.ts` — shared across sign-up, reset-password, change-password                           |
| Auth error msgs   | `packages/auth/messages/en.json` — all Better Auth error codes as Paraglide messages                             |

- Auth routes at `/auth/$path`, account at `/account` (redirects to sign-in if unauthenticated)
- Admin role guard on `/admin` via `beforeLoad` (`user.role === "admin"`)
- **Secondary storage** — [Cloudflare KV](https://developers.cloudflare.com/kv/) via `packages/auth/kv-storage.ts`. Sessions and rate limiting stored in KV for fast globally-replicated reads (<10ms). Sessions also stored in D1 (`storeSessionInDatabase: true`) for admin queries. Rate limiting uses KV (`storage: "secondary-storage"`) instead of in-memory (required for Workers — each isolate has separate memory).
- Session: cookie caching (5 min), 30-day expiry, daily refresh, `trustedOrigins` for CSRF
- `BETTER_AUTH_SECRET` required in prod, auto-generated static fallback in dev
- Sonner `<Toaster />` in root layout for auth notifications
- User `locale` field stored in DB (default `"en"`, updatable via `input: true` in additionalFields)
- `user.deleteUser` enabled — users can delete their own account with password confirmation
- Email verification enabled (`sendOnSignUp: true`, `autoSignInAfterVerification: true`)
- **Auth error i18n** — [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n) translates base + passkey [error codes](https://better-auth.com/docs/reference/errors) via Paraglide. English skipped (Better Auth defaults). Detection: session locale → Accept-Language. See `packages/auth/auth-i18n.ts`.

### Transactional Emails

All transactional emails are in `packages/email/`. Emails are fully i18n via Paraglide — text is NEVER hardcoded. Emails are sent in the user's preferred `locale` (stored in the users table).

| Email              | Trigger                                                 | Template                        |
| :----------------- | :------------------------------------------------------ | :------------------------------ |
| Email verification | On signup (`emailVerification.sendOnSignUp`)            | `emails/email-verification.tsx` |
| Password reset     | Forgot password (`sendResetPassword`)                   | `emails/reset-password.tsx`     |
| Password changed   | After change-password (`hooks.after`)                   | `emails/password-changed.tsx`   |
| Account deleted    | After user deletion (`deleteUser.afterDelete`)          | `emails/account-deleted.tsx`    |
| Welcome            | After user creation (`databaseHooks.user.create.after`) | `emails/welcome.tsx`            |
| Magic link         | Magic link auth (disabled)                              | `emails/magic-link.tsx`         |

**Architecture:**

- `packages/email/emails/email-layout.tsx` — Shared layout (Html, Head, Preview, Tailwind, Body, footer)
- `packages/email/locale.ts` — `loc()` helper to bridge string locale → Paraglide's narrow locale literal types
- `packages/email/templates.ts` — Render functions (`renderXxxEmail`) + localized subject helpers (`getEmailSubject.xxx`)
- `packages/email/send.ts` — `createEmailSender` factory (Resend API)
- `packages/auth/auth.ts` — All email triggers configured here (hooks, databaseHooks, emailVerification, deleteUser)

**Email i18n pattern:** All email text uses `m.email_xxx({...}, loc(locale))` where `loc()` casts the string locale to Paraglide's type.

**Welcome email config:** `consts.auth.welcomeEmail` (boolean) in `packages/utils/src/shared/consts.ts` — set to `false` to disable.

**Adding a new email template:**

1. Add message keys to `packages/email/messages/en.json` (pattern: `email_{template}_{element}`)
2. Create template in `packages/email/emails/` using `EmailLayout` + `loc()` + `m.email_xxx()`
3. Add render function to `packages/email/templates.ts`
4. Add subject to `getEmailSubject` in `packages/email/templates.ts`
5. Wire trigger in `packages/auth/auth.ts`
6. Add tests to `packages/auth/__tests__/email-notifications.test.ts`

### API (oRPC)

[oRPC](https://orpc.dev/) with TanStack Query — define procedures inline, no contract-first.

| Procedure Level      | Access              |
| :------------------- | :------------------ |
| `publicProcedure`    | Anyone              |
| `protectedProcedure` | Authenticated users |
| `adminProcedure`     | Admin role required |

| What                   | Where                                                                        |
| :--------------------- | :--------------------------------------------------------------------------- |
| Base procedures        | `packages/api/base.ts`                                                       |
| Router                 | `packages/api/router.ts`                                                     |
| API route              | `apps/web/src/routes/api/rpc.$.ts`                                           |
| Client (SSR + browser) | `apps/web/src/lib/orpc.ts` — server calls bypass HTTP, client uses `RPCLink` |

Admin procedures: `router.admin.users.*` (list, ban, unban, setRole, remove).

**Usage:** `import { orpc } from "@/lib/orpc"` then `useQuery(orpc.health.queryOptions())`

### Database

[Drizzle ORM](https://orm.drizzle.team/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + [Cloudflare KV](https://developers.cloudflare.com/kv/) (session/rate-limit storage). D1 for relational data, KV for fast key-value lookups.

| What        | Where                                                                   |
| :---------- | :---------------------------------------------------------------------- |
| DB client   | `packages/db/index.ts` — `initDb(env.DB)` called from server.ts         |
| KV storage  | `packages/auth/kv-storage.ts` — `initKv(env.SESSION_KV)` from server.ts |
| Schema      | `packages/db/schema.ts` — Better Auth tables (SQLite) + indexes         |
| ULID helper | `packages/db/utils.ts` — `ulidPrimaryKey` (text + ULID)                 |
| D1 types    | `packages/db/d1.d.ts` — minimal D1Database type declaration             |
| Migrations  | `packages/db/drizzle/` — applied automatically by Alchemy on dev/deploy |
| Local data  | `.alchemy/miniflare/` (gitignored) — miniflare simulates D1+KV locally  |
| Test DB     | `packages/db/__tests__/setup.ts` — in-memory bun:sqlite for tests       |

- D1 binding `DB` + KV binding `SESSION_KV` defined in `alchemy.run.ts`, initialized in `apps/web/src/server.ts`
- No `DATABASE_URL` — D1 is accessed via native Worker binding, not a connection string
- KV used as Better Auth secondary storage (sessions + rate limiting) for globally-replicated sub-10ms reads
- Local dev: D1 + KV simulated by miniflare via Alchemy's Vite plugin (wraps `@cloudflare/vite-plugin`)
- Tests: in-memory `bun:sqlite` via preload setup (`packages/db/bunfig.toml`). KV no-ops gracefully when uninitialized.
- NEVER run `bun db:generate` or `bun db:migrate` via Claude Code — requires interactive input

### SEO, Open Graph & LLMO

**References:** [TanStack Start SEO guide](https://tanstack.com/start/latest/docs/framework/react/guide/seo) · [TanStack Start LLMO guide](https://tanstack.com/start/latest/docs/framework/react/guide/llmo)

**Core setup:**

- `consts.siteUrl` in `packages/utils/src/shared/consts.ts` — **MUST update before deploying** (used in sitemap, robots.txt, JSON-LD)
- SSR enabled by default — crawlers receive fully rendered HTML
- Per-page `head()` on every public route — title, description, OG tags (i18n via Paraglide)
- Dynamic favicon at `/api/icon?theme=light|dark` — renders via `@vercel/og`, adapts to dark/light mode
- Dynamic OG image at `/api/og?title=...&description=...` — branded 1200×630 image, 1-hour cache

**Structured data (JSON-LD):**

- Root route (`__root.tsx`): `WebSite` + `Organization` schema using `consts.appName` / `consts.siteUrl`
- FAQ page (`/faq`): `FAQPage` schema with all Q&A pairs — highly effective for LLMO (AI systems extract Q&A pairs)

**SEO files (all in `apps/web/public/`):**

| File          | Purpose                                                                |
| :------------ | :--------------------------------------------------------------------- |
| `robots.txt`  | Allows all crawlers, disallows `/admin`, `/account`, `/auth/`, `/api/` |
| `sitemap.xml` | Static sitemap for all public pages                                    |
| `llms.txt`    | Machine-readable project summary for AI systems (LLMO)                 |

**Per-page SEO pattern (MUST follow for all new public routes):**

```tsx
import { seoMeta } from "../lib/seo";
import { m } from "../paraglide/messages";

export const Route = createFileRoute("/my-page")({
  head: () => ({
    meta: [
      ...seoMeta({
        title: m.meta_mypage_title(),
        description: m.meta_mypage_description(),
      }),
    ],
  }),
  component: MyPage,
});
```

**Adding a new public page (SEO checklist):**

1. Create route with `head()` containing title, description, and OG meta tags (i18n)
2. Add i18n keys to `apps/web/messages/en.json` (pattern: `meta_{page}_title`, `meta_{page}_description`)
3. Add page to `apps/web/public/sitemap.xml`
4. Add page to `apps/web/public/llms.txt`
5. If FAQ-like content, add `FAQPage` JSON-LD schema in `head().scripts`
6. Add link in footer nav (`apps/web/src/components/footer.tsx`)
7. Regenerate paraglide: `cd apps/web && npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/paraglide`

**i18n for meta tags:** All meta tag values MUST use Paraglide message functions (e.g., `m.meta_home_title()`). Keys are in `apps/web/messages/en.json`.

### Logging

Structured console logger — Cloudflare Workers compatible. JSON in prod (Cloudflare Logpush), colored output in dev.

| What            | Where                                              |
| :-------------- | :------------------------------------------------- |
| Logger instance | `packages/utils/src/server/logger.ts`              |
| Methods         | `logger.info()`, `.warn()`, `.error()`, `.debug()` |

Cloudflare Workers observability is enabled via `alchemy.run.ts` wrangler transform (`"observability": { "enabled": true }`).

### Analytics, Error Tracking & Event Capture

[PostHog](https://posthog.com/) — full-stack analytics, error tracking, and event capture. Enabled by env var presence. Admin analytics at `/admin/analytics`.

| What                | Where                                                                                     |
| :------------------ | :---------------------------------------------------------------------------------------- |
| Client provider     | `apps/web/src/routes/__root.tsx` — `PostHogProvider` + `PostHogErrorBoundary`             |
| Client env          | `apps/web/src/lib/env.ts` — `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`         |
| Server client       | `packages/utils/src/server/posthog.ts` — `posthog-node` with `enableExceptionAutocapture` |
| Server env          | `packages/utils/src/server/env.ts` — same `VITE_PUBLIC_POSTHOG_*` env vars as client      |
| Reverse proxy       | `apps/web/vite.config.ts` — Nitro `routeRules` proxies `/api/ph/**` to `us.i.posthog.com` |
| Event tracking plan | `.posthog-events.json` — all tracked events with descriptions and source files            |

**Reverse proxy** ([reference](https://posthog.com/docs/advanced/proxy)): All client-side PostHog traffic flows through `/api/ph/` on your own domain via Nitro `routeRules`. This avoids ad blockers. Static assets route to `us-assets.i.posthog.com`, API calls to `us.i.posthog.com`. Client uses `api_host: "/api/ph"` + `ui_host` for toolbar/session replay. E2E tested in `apps/e2e/tests/proxy/`.

**Error tracking (both client + server):**

- **Client:** `capture_exceptions: true` auto-captures uncaught errors + unhandled promise rejections. `PostHogErrorBoundary` catches React rendering errors.
- **Server:** `enableExceptionAutocapture: true` catches uncaught exceptions + unhandled promise rejections at the process level. Client initialized via import in `auth.ts`.
- **Manual capture:** Client: `posthog.captureException(error)`. Server: `posthog?.captureException(error, distinctId)`.

**Event capture:**

- **Client-side** (via `usePostHog()` hook): `user_signed_in`, `user_signed_up`, `user_signed_out`, `password_reset_requested`, `password_reset_completed`, `password_changed`, `profile_updated`, `passkey_added`, `passkey_deleted`, `session_revoked`, `account_deleted`
- **Server-side** (via `posthog?.capture()`): `user_created`, `user_deleted` — fired in Better Auth database hooks (`packages/auth/auth.ts`)
- **User identification:** `posthog.identify(userId, { email, name })` called on sign-in and sign-up

**Usage pattern:**

```tsx
// Client: import { usePostHog } from "@posthog/react"
const posthog = usePostHog();
posthog?.capture("event_name", { property: "value" });

// Server: import { posthog } from "@packages/utils/server/posthog"
posthog?.capture({ distinctId: userId, event: "event_name", properties: { ... } });
```

### Internationalization (i18n)

[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe i18n across the entire stack. **All user-facing text MUST be internationalized** — NEVER hardcode strings. Full details in the **i18n skill** (`.agents/skills/i18n/SKILL.md`).

**CRITICAL — ZERO TOLERANCE for non-i18n strings.** Every text the user sees — browser, email, or API error — MUST come from a Paraglide message function.

Three Paraglide projects: Frontend (`apps/web/messages/`), Backend (`packages/auth/messages/`), Email (`packages/email/messages/`). Import: `import { m } from "@/paraglide/messages"` (named import, NOT `import * as m`).

Auth errors: [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n) maps `auth_*` Paraglide keys to error codes. Covers base + passkey codes (55 total). English skipped at runtime (Better Auth handles defaults). See `packages/auth/auth-i18n.ts`.

### Dependency Management

- Versions MUST be pinned (no `^` / `~`) — enforced by [syncpack](https://syncpack.dev/) + `bunfig.toml`
- New packages blocked if published < 3 days ago (`install.minimumReleaseAge`)
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) checks for vulnerabilities on `bun install`

### Infrastructure & Deployment

[Alchemy](https://alchemy.run/) — TypeScript-native IaC for [Cloudflare Workers](https://workers.cloudflare.com/) + [D1](https://developers.cloudflare.com/d1/) (SQLite). Alchemy wraps `@cloudflare/vite-plugin` and `wrangler`, providing typed infrastructure definitions in pure TypeScript.

| What           | Config                                                                                                      |
| :------------- | :---------------------------------------------------------------------------------------------------------- |
| IaC definition | `alchemy.run.ts` — D1 database + TanStack Start worker                                                      |
| Build/Deploy   | `cd apps/web && bun run deploy` (`alchemy deploy` — builds, provisions D1, applies migrations, deploys)     |
| Dev server     | `bun dev` → `alchemy dev` → generates wrangler config → runs `vite dev`                                     |
| Migrations     | Applied automatically by Alchemy on `dev`/`deploy` via `migrationsDir` in D1Database                        |
| Health check   | `/api/auth/ok`                                                                                              |
| State          | `.alchemy/omegastart/` — encrypted resource state (committed). `.alchemy/miniflare/` — local data (ignored) |
| Wrangler       | `apps/web/wrangler.jsonc` — kept for manual wrangler CLI use (db:studio, db:migrate)                        |

**How it works:**

- `alchemy dev` evaluates `alchemy.run.ts`, generates `.alchemy/local/wrangler.jsonc`, then runs `vite dev`
- `alchemy deploy` evaluates `alchemy.run.ts`, provisions/updates D1 + Worker, applies migrations, deploys
- The Alchemy Vite plugin (`alchemy/cloudflare/tanstack-start`) wraps `@cloudflare/vite-plugin`, pointing it at the generated wrangler config
- `ALCHEMY_PASSWORD` env var required for state encryption (generate with `openssl rand -base64 32`)
- `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` required for deploy (not needed for local dev)

Reference: https://alchemy.run/guides/cloudflare-tanstack-start/

### CI/CD

GitHub Actions (`.github/workflows/ci.yml`) — runs `bun ok:ci` on push to `main` and PRs. Uses `oven-sh/setup-bun@v2`.

On push to `main`: deploys via `alchemy deploy` (provisions D1, applies migrations, deploys Worker), uploads source maps to PostHog, reports CI metrics. Requires GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ALCHEMY_PASSWORD`, `POSTHOG_PROJECT_ID`, `POSTHOG_CLI_API_KEY`, `POSTHOG_PROJECT_API_KEY`.

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

[Playwright](https://playwright.dev/) E2E tests in `apps/e2e/`. See `apps/e2e/FEATURES.md` for full coverage table. See `.agents/skills/e2e-testing/SKILL.md` for detailed guidance.

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

### React

- Server Components by default — `"use client"` only when needed
- **Rules of Hooks** — top level only, never conditional, no early return before hooks

<details>
<summary><strong>CSS Flexbox min-w-0 pattern</strong></summary>

Flex items have `min-width: auto` by default, breaking `truncate`:

```tsx
<div className="flex min-w-0">
  <Icon className="flex-shrink-0" />
  <span className="min-w-0 flex-1 truncate">Long text...</span>
  <Button className="flex-shrink-0" />
</div>
```

</details>

### Frontend & UI

**Mobile-first — THIS IS NON-NEGOTIABLE.** Every screen, component, and layout MUST be designed mobile-first. Desktop is the enhancement, not the other way around. The app may eventually ship as a native app via Capacitor, so touch-friendly UX is mandatory.

**Core principles:**

- **Mobile-first responsive:** MUST start with the mobile layout (`sm:`, `md:`, `lg:` breakpoints upward). NEVER design for desktop and then try to squeeze it into mobile.
- **Touch targets:** Interactive elements MUST be at least 44×44px tap area. Use adequate padding on buttons, links, and form controls.
- **i18n-safe layouts:** Since we use Paraglide, text can be significantly longer or shorter depending on locale. UI MUST accommodate variable text lengths:
  - NEVER use fixed widths on text containers — use `min-w-0`, `flex-1`, `w-full`
  - Prefer wrapping (`flex-wrap`) over truncation for important content
  - Use `truncate` only for secondary/non-critical text (e.g. email addresses in lists)
  - Buttons MUST grow with their label — NEVER fixed-width buttons with text
  - Test mentally: "Would this break if the label were 2× longer?"
- **Clean, small components:** Prefer composition of small shadcn primitives over custom CSS. Use Tailwind utilities directly — NEVER create CSS files. Keep component files short and focused.
- **Spacing & layout:** Use consistent spacing via Tailwind's scale (`gap-2`, `p-4`, `space-y-3`). Use `container` + `max-w-*` for content width. Stack vertically on mobile, go horizontal on larger screens (`flex-col sm:flex-row`).
- **Typography:** Use Tailwind's responsive text sizes (`text-sm md:text-base`). Ensure readable line lengths (`max-w-prose` for long-form text).
- **Forms:** Full-width inputs on mobile. Stack labels above inputs (not beside). Use shadcn form components consistently.

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
| `.oxlintrc.json`                         | Oxlint config                                                                          |
| `.oxfmtrc.jsonc`                         | Oxfmt config                                                                           |
| `.syncpackrc`                            | Syncpack config                                                                        |
| `apps/web/wrangler.jsonc`                | Fallback wrangler config (manual CLI use only — Alchemy generates its own)             |
| `.github/workflows/ci.yml`               | CI pipeline                                                                            |
| `packages/email/email-capture.ts`        | Email capture for E2E test verification (dev/test only)                                |
| `packages/email/templates.ts`            | Email render functions + localized subject helpers                                     |
| `packages/email/locale.ts`               | `loc()` — locale string → Paraglide type bridge                                        |
| `packages/email/emails/email-layout.tsx` | Shared email layout component                                                          |
| `packages/auth/messages/en.json`         | Server i18n strings (auth error messages with `auth_` prefix)                          |
| `packages/email/messages/en.json`        | Email i18n strings                                                                     |
| `bunfig.toml`                            | Bun config (exact versions, min release age)                                           |
