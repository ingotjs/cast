# OmegaStart

**The full-stack TypeScript starter that actually works.** Ship production apps in minutes, not weeks.

Built on [TanStack Start](https://tanstack.com/start) + [Bun](https://bun.sh/) + [Turborepo](https://turborepo.dev/). Everything is type-safe, everything is fast, everything just works.

## Why OmegaStart?

Most starters give you a skeleton. OmegaStart gives you a **production-ready foundation** — auth, API, database, email, i18n, logging, CI/CD, and deployment are all wired up and working together. No glue code, no boilerplate, no "figure it out yourself."

### Blazingly Fast Development

- **Zero-config local database** — [PGlite](https://electric-sql.com/product/pglite) runs PostgreSQL in-process. No Docker, no services, no setup. `bun dev` and you're coding.
- **Auto-migrations** — PGlite applies Drizzle migrations automatically on startup. Production migrations auto-run on deploy via Railway's pre-deploy command.
- **Hot reload everything** — Vite + React Compiler + Nitro. Changes reflect instantly.
- **Type-safe from DB to UI** — Drizzle schema types flow through oRPC procedures to TanStack Query hooks. Change a column, TypeScript catches every broken consumer.

### Production-Ready from Day One

- **Auth** — Email/password + passkeys (WebAuthn) + Google OAuth + magic link via [Better Auth](https://better-auth.com/). Email verification on signup, custom sign-in/sign-up/forgot-password forms. Account settings with session management and account deletion. OAuth and magic link toggle via env vars.
- **API** — Type-safe RPC via [oRPC](https://orpc.dev/) with TanStack Query integration. Public, protected, and admin procedure levels.
- **Database** — [Drizzle ORM](https://orm.drizzle.team/) with PGlite (dev) / PostgreSQL (prod) auto-switching. Migrations, studio, the works.
- **Email** — [React Email](https://react.email/) templates + [Resend](https://resend.com/) delivery. Email verification, password reset, password changed notification, account deleted confirmation, and welcome emails — all i18n-ready and sent in the user's preferred locale.
- **i18n** — [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) across the entire stack — frontend, backend, emails, and auth errors. Type-safe, locale-aware, zero runtime cost. See [Internationalization](#internationalization-i18n) for the full story.
- **Service toggles** — External services (PostHog, Resend, Google OAuth) activate by env var presence. No code changes — set the env vars and the feature turns on.
- **SEO & LLMO** — Per-page meta tags (OG + Twitter), JSON-LD structured data, `sitemap.xml`, `llms.txt`, `robots.txt`, dynamic favicon + OG image via `@vercel/og`. FAQ page with FAQPage schema for AI discoverability.
- **Admin** — Role-guarded dashboard with user management (ban, roles, sessions).
- **Observability** — Full-stack observability out of the box. See [Observability](#observability) for details.

### Deploy in 60 Seconds

**[Cloudflare Workers](https://workers.cloudflare.com/)** + **[Neon](https://neon.tech/)** — serverless edge deployment with serverless Postgres:

1. Create a Neon database, copy the connection string
2. Set secrets: `wrangler secret put DATABASE_URL`, `wrangler secret put BETTER_AUTH_SECRET`
3. Deploy: `cd apps/web && bun run deploy`

CI auto-deploys on push to `main` — runs migrations against Neon, then deploys to Cloudflare. Pre-configured in `.github/workflows/ci.yml`.

### CI/CD Included

GitHub Actions runs `bun ok:ci` on every push and PR. On `main`, also deploys to Cloudflare Workers, runs DB migrations, uploads source maps to PostHog, and reports CI metrics.

## Quick Start

```sh
cp .env.example .env  # Create your env file, fill in values for enabled features
bun install
bun dev
```

`bun dev` auto-installs deps and starts all apps. PGlite creates a local database with migrations applied automatically. Open `http://localhost:3000`.

> **Note:** The `.env` file is only needed for feature-flagged services (PostHog, Resend, Google OAuth). The app runs without it — disabled features are simply skipped.

## Architecture

```
apps/web          → TanStack Start (Vite + Router + Nitro)
packages/server   → oRPC + Drizzle + Better Auth + Pino
packages/shared   → Constants + capability flags
packages/email    → React Email + Resend
packages/ui       → shadcn v4 + Tailwind CSS + Base UI
packages/config   → Shared TypeScript configs
```

## Commands

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `bun dev`         | Start all apps in dev mode                       |
| `bun dev:email`   | Email template preview (port 3002)               |
| `bun ok`          | Type check + lint + test (run before committing) |
| `bun ok:ci`       | Same without auto-fixes (CI)                     |
| `bun db:generate` | Generate database migrations                     |
| `bun db:migrate`  | Apply migrations                                 |
| `bun db:studio`   | Open Drizzle Studio                              |

## Environment Variables

### Required (Production)

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `DATABASE_URL`       | Neon PostgreSQL connection string       |
| `BETTER_AUTH_SECRET` | Auth encryption secret (min 32 chars)   |
| `URL`                | Production URL (e.g. https://myapp.com) |

### Optional (Service Features)

Services activate when their env vars are set. Leave them out and the service is simply off — no code changes needed.

| Service      | Env Vars                                                               |
| ------------ | ---------------------------------------------------------------------- |
| Email        | `RESEND_API_KEY`, `EMAIL_FROM`                                         |
| Google OAuth | `VITE_PUBLIC_GOOGLE_OAUTH`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Magic Link   | `VITE_PUBLIC_MAGIC_LINK` (requires Email env vars)                     |
| PostHog      | `VITE_PUBLIC_POSTHOG_KEY` (host defaults to US Cloud)                  |

## Testing

- **Unit & integration tests** via `bun:test` with PGlite — tests run against a real PostgreSQL engine, not mocks
- **Test utilities** for creating authenticated users and calling oRPC procedures
- **E2E tests** via [Playwright](https://playwright.dev/) — full auth flow coverage (sign-up, sign-in, sign-out, change password, delete account) with email capture verification. Run `cd apps/e2e && bunx playwright test`

## Observability

OmegaStart ships with a complete observability stack — all centralized in [PostHog](https://posthog.com/). Analytics, error tracking, event capture, and server logs in one dashboard. Just set `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`.

### Structured Logging — [Pino](https://getpino.io/) + [PostHog Logs](https://posthog.com/docs/logs)

- [Pino](https://getpino.io/) for local dev (pretty-printed) and stdout (Railway/any log aggregator)
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

OmegaStart is **i18n-ready from day one** — every user-facing string flows through [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs), from UI labels to auth errors to transactional emails. Adding a new language is a JSON file, not a refactor.

### Architecture

Three separate Paraglide projects keep bundles lean and concerns separated:

| Project  | Path                        | Covers                                                          |
| -------- | --------------------------- | --------------------------------------------------------------- |
| Frontend | `apps/web/messages/`        | UI labels, buttons, forms, toasts, meta tags, validation errors |
| Backend  | `packages/server/messages/` | Auth error messages, API responses, validation errors           |
| Email    | `packages/email/messages/`  | Subject lines, body copy, CTAs, transactional email content     |

Each project generates its own type-safe message functions. Server strings never leak into the client bundle.

### What's Covered

- **UI text** — All labels, buttons, placeholders, and toasts use Paraglide (`m.key()`)
- **Auth errors** — Base + passkey [Better Auth error codes](https://better-auth.com/docs/reference/errors) translated via the [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n). Error messages managed in Paraglide, automatically mapped to Better Auth's i18n system. English skipped at runtime (Better Auth provides defaults natively). Locale detection: user's stored preference (DB) → `Accept-Language` header.
- **Zod validation** — Frontend and backend validation errors resolve per-locale via Paraglide message functions
- **Transactional emails** — All email templates (verification, password reset, welcome, etc.) render in the recipient's preferred locale
- **Meta tags & SEO** — Page titles, descriptions, and OG tags are i18n-aware

### Adding a New Language

1. Add the locale to each `project.inlang/settings.json` `locales` array
2. Create `messages/{locale}.json` in each Paraglide project with translated strings
3. Run `bun run build` in each package (or `bun ok` from root) to compile
4. Auth error translations flow through automatically — no code changes needed

### How Auth Error i18n Works

The [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n) is conditionally added in `packages/server/src/auth.ts`. English uses Better Auth's built-in defaults — no duplication. The `auth_*` keys in `en.json` serve as Paraglide's canonical key list and translation reference for future locales.

When a non-English locale is added, `buildAuthTranslations()` (`packages/server/src/auth-i18n.ts`) dynamically maps `auth_*` Paraglide messages to error codes. The plugin activates automatically — no code changes needed.

```
English only:     i18n plugin NOT added (zero overhead)
With new locale:  Paraglide fr.json auth_* keys  →  buildAuthTranslations()  →  i18n plugin
                    "Utilisateur non trouvé"         { fr: { USER_NOT_FOUND:     session locale
                                                       "...", ... } }            → Accept-Language
```

## Tech Stack

| Layer           | Technology                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------- |
| Framework       | [TanStack Start](https://tanstack.com/start) (Vite + TanStack Router + Cloudflare Workers)  |
| Language        | TypeScript 5.9 (type-checked via [tsgo](https://github.com/microsoft/typescript-go))        |
| API             | [oRPC](https://orpc.dev/) + [TanStack Query](https://tanstack.com/query)                    |
| Database        | [Drizzle ORM](https://orm.drizzle.team/) + PGlite (dev) / [Neon](https://neon.tech/) (prod) |
| Auth            | [Better Auth](https://better-auth.com/) (email/password, passkeys, admin)                   |
| UI              | [shadcn v4](https://ui.shadcn.com/) + Tailwind CSS 4 + [Base UI](https://base-ui.com/)      |
| Email           | [React Email](https://react.email/) + [Resend](https://resend.com/)                         |
| i18n            | [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (full-stack)       |
| Logging         | Structured console logger (Cloudflare Logpush compatible)                                   |
| Analytics       | [PostHog](https://posthog.com/) (client + server, error tracking)                           |
| Linting         | [Ultracite](https://github.com/haydenbleasel/ultracite) (Oxlint + Oxfmt)                    |
| Package Manager | [Bun](https://bun.sh/)                                                                      |
| Monorepo        | [Turborepo](https://turborepo.dev/)                                                         |
| Deployment      | [Cloudflare Workers](https://workers.cloudflare.com/) + [Neon](https://neon.tech/)          |
| CI/CD           | GitHub Actions                                                                              |

<details>
<summary>Claude Code Skills</summary>

This project includes 42 [Claude Code skills](https://skills.sh) for AI-assisted development:

- [shadcn](https://skills.sh/shadcn/ui) — Manages shadcn components: adding, styling, composing UI
- [ultracite](https://skills.sh/haydenbleasel/ultracite) — Linting and formatting with Oxlint + Oxfmt
- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills) — React and Next.js performance patterns from Vercel
- [better-auth-best-practices](https://skills.sh/better-auth/skills) — Better Auth documentation and best practices
- [react-email](https://skills.sh/resend/react-email) — Building HTML email templates with React components
- [email-best-practices](https://skills.sh/resend/email-best-practices) — Email deliverability, compliance, and reliability
- [resend](https://skills.sh/resend/resend-skills) — Resend API integration for sending emails
- [find-skills](https://skills.sh/vercel-labs/skills) — Discover and install new skills
- [skill-creator](https://skills.sh/anthropics/skills) — Create and evaluate custom skills
- [Marketing Skills](https://skills.sh/coreyhaines31/marketingskills) — 33 marketing skills (SEO, copywriting, ads, CRO, email sequences, pricing, and more)

</details>
