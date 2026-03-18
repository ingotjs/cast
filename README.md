# OmegaStart

**The full-stack TypeScript starter that actually works.** Ship production apps in minutes, not weeks.

Built on [TanStack Start](https://tanstack.com/start) + [Bun](https://bun.sh/) + [Turborepo](https://turborepo.dev/). Everything is type-safe, everything is fast, everything just works.

## Why OmegaStart?

Most starters give you a skeleton. OmegaStart gives you a **production-ready foundation** — auth, API, database, email, i18n, logging, CI/CD, and deployment are all wired up and working together. No glue code, no boilerplate, no "figure it out yourself."

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

[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) across the entire stack — frontend, backend, emails, and auth errors. Type-safe, locale-aware, zero runtime cost. Every user-facing string is internationalized from day one. Adding a new language is a JSON file, not a refactor. See [Internationalization](#internationalization-i18n-1) for the full story.

### 4. Testing

- **Unit & integration tests** via `bun:test` with in-memory SQLite — tests run against a real database engine, not mocks
- **Test utilities** for creating authenticated users and calling oRPC procedures directly
- **E2E tests** via [Playwright](https://playwright.dev/) — full auth flow coverage (sign-up, sign-in, sign-out, change password, delete account) with email capture verification
- **Pre-commit hook** via [Husky](https://typicode.github.io/husky/) — runs the full `bun ok` pipeline (type check + lint + test) before every commit. Broken code doesn't get committed.

### 5. Code Quality & Reliability

Zero-config, zero-compromise. Every layer of the stack is guarded by automated tooling that catches issues before they reach production.

- **Linting & formatting** — [Ultracite](https://github.com/haydenbleasel/ultracite) wraps [Oxlint](https://oxc.rs/docs/guide/usage/linter) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) into a single zero-config preset. Blazingly fast Rust-based linting and formatting — no ESLint, no Prettier, no config files to maintain.
- **Type checking** — [typescript-go](https://github.com/microsoft/typescript-go) (`tsgo`) via `@typescript/native-preview`. 10x faster type checking than standard `tsc`.
- **Dependency management** — [syncpack](https://syncpack.dev/) enforces pinned versions (no `^` or `~`), consistent versions across all packages, and workspace protocol for internal packages. No version drift, no "works on my machine."
- **Supply chain security** — [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) scans for known vulnerabilities on every `bun install`. Combined with Bun's `install.minimumReleaseAge` (3-day quarantine on new packages) to block supply chain attacks.
- **Pre-commit enforcement** — [Husky](https://typicode.github.io/husky/) runs `bun ok` (type check + lint + test) on every commit. Nothing ships without passing the full pipeline.
- **CI/CD** — GitHub Actions runs `bun ok:ci` on every push and PR. On `main`, also deploys via Alchemy (provisions D1, applies migrations, deploys Worker), uploads source maps to PostHog, and reports CI metrics.
- **One command to rule them all** — `bun ok` runs syncpack + type check + lint + test in sequence. If it passes, your code is clean.

### 6. Deploy in 60 Seconds

**[Cloudflare Workers](https://workers.cloudflare.com/)** + **[Cloudflare D1](https://developers.cloudflare.com/d1/)** via **[Alchemy](https://alchemy.run/)** — TypeScript-native IaC, everything on the edge:

1. Set env vars: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ALCHEMY_PASSWORD`
2. Deploy: `cd apps/web && bun run deploy`

That's it. Alchemy provisions the D1 database, applies migrations, and deploys the Worker — all from `alchemy.run.ts`.

CI auto-deploys on push to `main`. Pre-configured in `.github/workflows/ci.yml`.

## Quick Start

```sh
cp .env.example .env  # Create your env file, fill in values for enabled features
bun install
bun dev
```

`bun dev` auto-installs deps and starts all apps. Alchemy generates the wrangler config and runs Vite with D1 simulated locally via miniflare. Migrations are applied automatically. Open `http://localhost:3000`.

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
packages/config   → Shared TypeScript configs
```

`@packages/db` (leaf) ← `@packages/auth` ← `@packages/api`

## Commands

| Command                 | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `bun dev`               | Start all apps in dev mode (Alchemy generates wrangler config, runs Vite) |
| `bun dev:email`         | Email template preview (port 3002)                                        |
| `bun ok`                | Type check + lint + test (run before committing)                          |
| `bun ok:ci`             | Same without auto-fixes (CI)                                              |
| `bun db:generate`       | Generate database migrations                                              |
| `bun db:migrate`        | Apply migrations locally (D1)                                             |
| `bun db:migrate:remote` | Apply migrations to remote D1                                             |
| `bun db:studio`         | Open Drizzle Studio                                                       |

## Environment Variables

### Required (Production)

| Variable                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `ALCHEMY_PASSWORD`      | IaC state encryption (`openssl rand -base64 32`) |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token (for deploy)                |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (for deploy)               |
| `BETTER_AUTH_SECRET`    | Auth encryption secret (min 32 chars)            |
| `URL`                   | Production URL (e.g. https://myapp.com)          |

### Optional (Service Features)

Services activate when their env vars are set. Leave them out and the service is simply off — no code changes needed.

| Service      | Env Vars                                                               |
| ------------ | ---------------------------------------------------------------------- |
| Email        | `RESEND_API_KEY`, `EMAIL_FROM`                                         |
| Google OAuth | `VITE_PUBLIC_GOOGLE_OAUTH`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Magic Link   | `VITE_PUBLIC_MAGIC_LINK` (requires Email env vars)                     |
| PostHog      | `VITE_PUBLIC_POSTHOG_KEY` (host defaults to US Cloud)                  |

## Observability

OmegaStart ships with a complete observability stack — all centralized in [PostHog](https://posthog.com/). Analytics, error tracking, event capture, and server logs in one dashboard. Just set `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`.

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

OmegaStart is **i18n-ready from day one** — every user-facing string flows through [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs), from UI labels to auth errors to transactional emails. Adding a new language is a JSON file, not a refactor.

### Architecture

Three separate Paraglide projects keep bundles lean and concerns separated:

| Project  | Path                       | Covers                                                          |
| -------- | -------------------------- | --------------------------------------------------------------- |
| Frontend | `apps/web/messages/`       | UI labels, buttons, forms, toasts, meta tags, validation errors |
| Backend  | `packages/auth/messages/`  | Auth error messages, API responses, validation errors           |
| Email    | `packages/email/messages/` | Subject lines, body copy, CTAs, transactional email content     |

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

The [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n) is conditionally added in `packages/auth/auth.ts`. English uses Better Auth's built-in defaults — no duplication. The `auth_*` keys in `en.json` serve as Paraglide's canonical key list and translation reference for future locales.

When a non-English locale is added, `buildAuthTranslations()` (`packages/auth/auth-i18n.ts`) dynamically maps `auth_*` Paraglide messages to error codes. The plugin activates automatically — no code changes needed.

```
English only:     i18n plugin NOT added (zero overhead)
With new locale:  Paraglide fr.json auth_* keys  →  buildAuthTranslations()  →  i18n plugin
                    "Utilisateur non trouvé"         { fr: { USER_NOT_FOUND:     session locale
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
| i18n            | [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (full-stack)                                                                    |
| Logging         | Structured console logger (Cloudflare Logpush compatible)                                                                                                |
| Analytics       | [PostHog](https://posthog.com/) (client + server, error tracking)                                                                                        |
| Linting         | [Ultracite](https://github.com/haydenbleasel/ultracite) (Oxlint + Oxfmt)                                                                                 |
| Package Manager | [Bun](https://bun.sh/)                                                                                                                                   |
| Monorepo        | [Turborepo](https://turborepo.dev/)                                                                                                                      |
| IaC             | [Alchemy](https://alchemy.run/) (TypeScript-native, wraps Cloudflare APIs directly)                                                                      |
| Deployment      | [Cloudflare Workers](https://workers.cloudflare.com/) + [Cloudflare D1](https://developers.cloudflare.com/d1/)                                           |
| CI/CD           | GitHub Actions                                                                                                                                           |

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
