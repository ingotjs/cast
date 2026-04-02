<p align="center">
  <img src="meta/site/public/logo.svg" alt="ingot" height="48" />
</p>

# Cast

**AI-first full-stack TypeScript starter.** Ship production apps in minutes, not weeks.

Built on [TanStack Start](https://tanstack.com/start) + [Bun](https://bun.sh/) + [Vite+](https://vite.dev/plus/). Designed from the ground up for AI-assisted development — with 42 [Claude Code skills](https://skills.sh), comprehensive `CLAUDE.md` instructions, and a codebase structure that AI agents navigate effortlessly.

## Why Cast?

Most starters give you a skeleton. Cast gives you a **production-ready foundation** — auth, API, database, email, i18n, logging, CI/CD, and deployment are all wired up and working together. No glue code, no boilerplate, no "figure it out yourself."

### AI-First by Design

Cast isn't just AI-compatible — it's **built for AI agents to be productive from the first prompt**. Detailed `CLAUDE.md` project instructions, auto-invoked skills per domain, strict code standards that eliminate ambiguity, and a dependency graph that AI can reason about. The result: AI writes better code in Cast than in most hand-rolled projects.

# Pillars

### 1. Blazingly Fast Development

- **Zero-config local database** — [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) works locally out of the box. No Docker, no services, no connection strings. `bun dev` and you're coding.
- **Edge-native database** — D1 runs on the same Cloudflare edge as your Workers. Global read replication, zero egress fees. If you outgrow D1's 10GB limit, migrate to [Turso](https://turso.tech/) (same SQLite dialect).

### 2. Production-Ready from Day One

- **Auth** — Email/password + passkeys (WebAuthn) + Google OAuth + magic link via [Better Auth](https://better-auth.com/). Email verification on signup, custom sign-in/sign-up/forgot-password forms. Account settings with session management and account deletion. OAuth and magic link toggle via env vars.
- **API** — Type-safe RPC via [oRPC](https://orpc.dev/) with TanStack Query integration. Public, protected, and admin procedure levels.
- **Database** — [Drizzle ORM](https://orm.drizzle.team/) with [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + [Cloudflare KV](https://developers.cloudflare.com/kv/) for session/rate-limit storage. D1 for relational data, KV for globally-replicated sub-10ms reads.
- **Email** — [React Email](https://react.email/) templates + [Resend](https://resend.com/) delivery. Email verification, password reset, password changed notification, account deleted confirmation, and welcome emails — all i18n-ready and sent in the user's preferred locale.
- **Service toggles** — External services (PostHog, Resend, Google OAuth) activate by env var presence. No code changes — set the env vars and the feature turns on.
- **SEO & LLMO** — Per-page meta tags (OG + Twitter), JSON-LD structured data, `sitemap.xml`, `llms.txt`, `robots.txt`, dynamic favicon + OG image via `@vercel/og`. FAQ page with FAQPage schema for AI discoverability.
- **Admin** — Role-guarded dashboard with user management (ban, roles, sessions).
- **Observability** — Full-stack observability out of the box. See [Observability](#observability) for details.

### 3. Internationalization (i18n)

[Lingui](https://lingui.dev/) across the entire stack — frontend, backend, emails, and auth errors. Type-safe, locale-aware, message catalogs with ICU syntax. Every user-facing string is internationalized from day one. Adding a new language is a PO file, not a refactor. See [Internationalization](#internationalization-i18n-1) for the full story.

### 4. Testing

- **Unit & integration tests** via `bun:test` with in-memory SQLite — tests run against a real database engine, not mocks
- **Test utilities** for creating authenticated users and calling oRPC procedures directly
- **E2E tests** via [Playwright](https://playwright.dev/) + [`@ingot/prospect`](https://www.npmjs.com/package/@ingot/prospect) — coverage mapping, flakiness tracking, test artifacts, and a dev overlay that shows coverage/flakiness directly in your app
- **Pre-commit hook** via [Vite+](https://vite.dev/plus/) — `vp staged` runs format + lint on staged files before every commit. Broken code doesn't get committed.

### 5. Code Quality & Reliability

Zero-config, zero-compromise. Every layer of the stack is guarded by automated tooling that catches issues before they reach production.

- **Linting & formatting** — [Vite+](https://vite.dev/plus/) bundles [Oxlint](https://oxc.rs/docs/guide/usage/linter) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter). Rust-based linting and formatting — no ESLint, no Prettier.
- **Type checking** — [typescript-go](https://github.com/microsoft/typescript-go) (`tsgo`) via `@typescript/native-preview`. 10x faster type checking than standard `tsc`.
- **Dependency management** — [syncpack](https://syncpack.dev/) enforces pinned versions (no `^` or `~`), consistent versions across all packages, and workspace protocol for internal packages. No version drift, no "works on my machine."
- **Supply chain security** — [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) scans for known vulnerabilities on every `bun install`. Combined with Bun's `install.minimumReleaseAge` (3-day quarantine on new packages) to block supply chain attacks.
- **Dead code detection** — [Knip](https://knip.dev/) finds unused files, dependencies, and exports across the entire monorepo. Run `bun knip`.
- **Pre-commit enforcement** — [Vite+](https://vite.dev/plus/) `vp staged` runs format + lint on staged files on every commit.
- **CI/CD** — GitHub Actions runs `bun ok:ci` on every push and PR. On `main`, also deploys via wrangler (applies D1 migrations, deploys Worker).
- **One command to rule them all** — `bun ok` runs syncpack + type check + lint + test in sequence. If it passes, your code is clean.

### 6. Deploy in 60 Seconds

**[Cloudflare Workers](https://workers.cloudflare.com/)** + **[Cloudflare D1](https://developers.cloudflare.com/d1/)** via **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** — everything on the edge:

1. Set `CLOUDFLARE_API_TOKEN`
2. Deploy: `bun deploy`

That's it. Wrangler applies D1 migrations and deploys the Worker — all from `wrangler.jsonc`.

CI auto-deploys on push to `main`. Pre-configured in `.github/workflows/ci.yml`.

## Quick Start

Requires [Bun](https://bun.sh/).

```sh
bunx @ingot/cast
```

Scaffolds the project, runs setup, and starts the dev server. Open `http://localhost:2000`.

> **Note:** The `.env` file is only needed for feature-flagged services (PostHog, Resend, Google OAuth). The app runs without it — disabled features are simply skipped.

## Architecture

```
apps/web          → TanStack Start (Vite + Router + Nitro)
packages/db       → Drizzle ORM + Cloudflare D1 (schema, migrations, client)
packages/utils    → Constants, server env/logger/posthog (shared/, server/, client/)
packages/auth     → Better Auth + KV storage + i18n
packages/api      → oRPC router + procedures
packages/email    → React Email + Resend + email capture (E2E)
packages/ui       → shadcn v4 + Tailwind CSS + Base UI
packages/prospect → Full Playwright companion (coverage, overlay, flakiness, artifacts)
packages/config   → Shared TypeScript configs
```

`@ingot/db` (leaf) ← `@ingot/auth` ← `@ingot/api`

## Commands

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `bun dev`               | Start dev server (Vite + Miniflare for D1/KV)    |
| `bun dev:email`         | Email template preview (port 3002)               |
| `bun ok`                | Type check + lint + test (run before committing) |
| `bun ok:ci`             | Same without auto-fixes (CI)                     |
| `bun db:generate`       | Generate database migrations                     |
| `bun db:migrate`        | Apply migrations locally (D1)                    |
| `bun db:migrate:remote` | Apply migrations to remote D1                    |
| `bun db:studio`         | Open Drizzle Studio                              |
| `bun knip`              | Find unused files, deps, and exports             |

## Deploy

CI auto-deploys on push to `main`. Add this one GitHub Actions secret:

```sh
gh secret set CLOUDFLARE_API_TOKEN  # paste your token from dash.cloudflare.com → API Tokens
```

### Production Secrets

Production secrets are stored on Cloudflare — not in files, not in CI:

```sh
npx wrangler secret put BETTER_AUTH_SECRET   # openssl rand -base64 32
```

### Optional (Service Features)

Services activate when their env vars are set. Leave them out and the service is simply off — no code changes needed.

| Service      | Env Vars                                               |
| ------------ | ------------------------------------------------------ |
| Email        | `RESEND_API_KEY`, `EMAIL_FROM`                         |
| Google OAuth | `VITE_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| PostHog      | `VITE_PUBLIC_POSTHOG_KEY` (host defaults to US Cloud)  |

## Observability

Cast ships with a complete observability stack — all centralized in [PostHog](https://posthog.com/). Analytics, error tracking, event capture, and server logs in one dashboard. Just set `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`.

### Structured Logging — [Pino](https://getpino.io/) + [PostHog Logs](https://posthog.com/docs/logs)

- [Pino](https://getpino.io/) for local dev (pretty-printed) and stdout (Cloudflare Logpush/any log aggregator)
- [OpenTelemetry](https://opentelemetry.io/) exports server logs to PostHog Logs when enabled — view them alongside analytics and session replays
- oRPC integration via [`@orpc/experimental-pino`](https://orpc.dev/docs/integrations/pino) — every API request gets a unique ID and automatic request/response logging

### Analytics & Event Capture — [PostHog](https://posthog.com/)

One API key — works on both client and server. Enabled by env var presence.

- **Product analytics** — Page views, user sessions, feature usage (client via `@posthog/react`)
- **User identification** — `posthog.identify()` on sign-in/sign-up links events to users
- **Custom events** — 11 tracked events across auth and account flows. Full tracking plan in `.posthog-events.json`
- **Server-side events** — `user_created` and `user_deleted` fired from Better Auth database hooks via `posthog-node`
- **Reverse proxy** — Client traffic routes through `/api/ph/` on your domain via [Nitro route rules](https://nitro.build/docs/routing#route-rules), avoiding ad blockers. Auto-detects US/EU region from `VITE_PUBLIC_POSTHOG_HOST`.

### Error Tracking — [PostHog](https://posthog.com/docs/error-tracking)

Automatic on both client and server — no extra setup required.

- **Client:** `capture_exceptions: true` auto-captures uncaught errors and unhandled promise rejections. `PostHogErrorBoundary` catches React rendering errors.
- **Server:** `posthog-node` with `enableExceptionAutocapture: true` catches process-level crashes.
- **Manual capture:** `posthog.captureException(error)` (client) or `posthog?.captureException(error, distinctId)` (server) for custom error handling.

## Internationalization (i18n)

Cast is **i18n-ready from day one** — every user-facing string flows through [Lingui](https://lingui.dev/), from UI labels to auth errors to transactional emails. Adding a new language is a PO file, not a refactor.

### Architecture

Three separate Lingui catalogs keep bundles lean and concerns separated:

| Catalog  | Path                           | Covers                                                          |
| -------- | ------------------------------ | --------------------------------------------------------------- |
| Frontend | `apps/web/src/_etc/locales/`   | UI labels, buttons, forms, toasts, meta tags, validation errors |
| Backend  | `packages/auth/_etc/locales/`  | Auth error messages, API responses, validation errors           |
| Email    | `packages/email/_etc/locales/` | Subject lines, body copy, CTAs, transactional email content     |

Each catalog compiles independently. Server strings never leak into the client bundle.

### What's Covered

- **UI text** — All labels, buttons, placeholders, and toasts use Lingui macros (`<Trans>`, `t`, `msg`)
- **Auth errors** — Base + passkey [Better Auth error codes](https://better-auth.com/docs/reference/errors) translated via the [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n). Error messages managed in Lingui catalogs, automatically mapped to Better Auth's i18n system. English skipped at runtime (Better Auth provides defaults natively). Locale detection: user's stored preference (DB) → `Accept-Language` header.
- **Zod validation** — Frontend and backend validation errors resolve per-locale via Lingui message descriptors
- **Transactional emails** — All email templates (verification, password reset, welcome, etc.) render in the recipient's preferred locale
- **Meta tags & SEO** — Page titles, descriptions, and OG tags are i18n-aware

### Adding a New Language

1. Add the locale to `lingui.config.ts` `locales` array
2. Run `bun lingui extract` to generate PO files for the new locale
3. Translate the strings in each `locales/{locale}/messages.po`
4. Run `bun lingui compile` (or `bun ok` from root) to compile
5. Auth error translations flow through automatically — no code changes needed

### How Auth Error i18n Works

The [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n) is conditionally added in `packages/auth/auth.ts`. English uses Better Auth's built-in defaults — no duplication. The `auth_*` keys in `en/messages.po` serve as Lingui's canonical key list and translation reference for future locales.

When a non-English locale is added, `buildAuthTranslations()` (`packages/auth/i18n.ts`) dynamically maps `auth_*` Lingui messages to error codes. The plugin activates automatically — no code changes needed.

```
English only:     i18n plugin NOT added (zero overhead)
With new locale:  Lingui fr/messages.po auth_* →  buildAuthTranslations()  →  i18n plugin
                    "Utilisateur non trouvé"       { fr: { USER_NOT_FOUND:     session locale
                                                     "...", ... } }            → Accept-Language
```

## Tech Stack

| Layer           | Technology                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | [TanStack Start](https://tanstack.com/start) (Vite + TanStack Router + Cloudflare Workers)                                                               |
| Language        | TypeScript 5.9 (type-checked via [tsgo](https://github.com/microsoft/typescript-go))                                                                     |
| API             | [oRPC](https://orpc.dev/) + [TanStack Query](https://tanstack.com/query)                                                                                 |
| Database        | [Drizzle ORM](https://orm.drizzle.team/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + [KV](https://developers.cloudflare.com/kv/) |
| Auth            | [Better Auth](https://better-auth.com/) (email/password, passkeys, admin)                                                                                |
| UI              | [shadcn v4](https://ui.shadcn.com/) + Tailwind CSS 4 + [Base UI](https://base-ui.com/)                                                                   |
| Email           | [React Email](https://react.email/) + [Resend](https://resend.com/)                                                                                      |
| i18n            | [Lingui](https://lingui.dev/) (full-stack)                                                                                                               |
| Logging         | Structured console logger (Cloudflare Logpush compatible)                                                                                                |
| Analytics       | [PostHog](https://posthog.com/) (client + server, error tracking)                                                                                        |
| Linting         | [Vite+](https://vite.dev/plus/) (Oxlint + Oxfmt)                                                                                                         |
| Package Manager | [Bun](https://bun.sh/)                                                                                                                                   |
| Monorepo        | [Vite+](https://vite.dev/plus/) (`vp run -r`)                                                                                                            |
| Deploy          | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) + [@cloudflare/vite-plugin](https://www.npmjs.com/package/@cloudflare/vite-plugin)       |
| Deployment      | [Cloudflare Workers](https://workers.cloudflare.com/) + [Cloudflare D1](https://developers.cloudflare.com/d1/)                                           |
| CI/CD           | GitHub Actions                                                                                                                                           |

<details>
<summary>Claude Code Skills</summary>

This project includes 42 [Claude Code skills](https://skills.sh) for AI-assisted development:

- [shadcn](https://skills.sh/shadcn/ui) — Manages shadcn components: adding, styling, composing UI
- [vite-plus](https://vite.dev/plus/) — Linting and formatting with Oxlint + Oxfmt
- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills) — React and Next.js performance patterns from Vercel
- [better-auth-best-practices](https://skills.sh/better-auth/skills) — Better Auth documentation and best practices
- [react-email](https://skills.sh/resend/react-email) — Building HTML email templates with React components
- [email-best-practices](https://skills.sh/resend/email-best-practices) — Email deliverability, compliance, and reliability
- [resend](https://skills.sh/resend/resend-skills) — Resend API integration for sending emails
- [find-skills](https://skills.sh/vercel-labs/skills) — Discover and install new skills
- [skill-creator](https://skills.sh/anthropics/skills) — Create and evaluate custom skills
- [Marketing Skills](https://skills.sh/coreyhaines31/marketingskills) — 33 marketing skills (SEO, copywriting, ads, CRO, email sequences, pricing, and more)

</details>
