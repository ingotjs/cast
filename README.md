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

- **Auth** — Email/password + passkeys (WebAuthn) via [Better Auth](https://better-auth.com/). Email verification on signup, custom sign-in/sign-up/forgot-password forms. Account settings with session management and account deletion.
- **API** — Type-safe RPC via [oRPC](https://orpc.dev/) with TanStack Query integration. Public, protected, and admin procedure levels.
- **Database** — [Drizzle ORM](https://orm.drizzle.team/) with PGlite (dev) / PostgreSQL (prod) auto-switching. Migrations, studio, the works.
- **Email** — [React Email](https://react.email/) templates + [Resend](https://resend.com/) delivery. Email verification, password reset, password changed notification, account deleted confirmation, and welcome emails — all i18n-ready and sent in the user's preferred locale.
- **i18n** — [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) across the entire stack — frontend, backend, emails. Type-safe, locale-aware, zero runtime cost.
- **Feature Flags** — `true | undefined` per feature. Enable a flag, its env vars are validated at startup. Disable it, the whole feature tree-shakes away.
- **Logging** — [Pino](https://getpino.io/) structured logging with oRPC integration. JSON in prod (Railway-native), pretty-printed in dev. Every request gets a unique ID.
- **SEO** — Dynamic favicon with dark mode support, OG image generation via `@vercel/og`, proper meta tags.
- **Admin** — Role-guarded dashboard with user management (ban, roles, sessions).
- **Analytics & Error Tracking** — [PostHog](https://posthog.com/) on both client and server. Auto-captures uncaught exceptions, React rendering errors, and unhandled promise rejections. Feature-flagged.

### Deploy in 60 Seconds

**[Railway](https://railway.com/)** is the recommended deployment target — fastest path from code to production:

1. Connect your repo to Railway
2. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`
3. Deploy. Database migrations run automatically.

That's it. Health checks, restart policies, and build detection are pre-configured in `railway.json`. Other providers (Vercel, Fly.io, etc.) work too.

### CI/CD Included

GitHub Actions runs `bun ok:ci` on every push and PR — type checking, linting, and tests. Push with confidence.

## Quick Start

```sh
bun install
bun dev
```

`bun dev` auto-installs deps and starts all apps. PGlite creates a local database with migrations applied automatically. Open `http://localhost:3000`.

## Architecture

```
apps/web          → TanStack Start (Vite + Router + Nitro)
packages/server   → oRPC + Drizzle + Better Auth + Pino
packages/shared   → Feature flags + constants
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

| Variable                | Description                           |
| ----------------------- | ------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string          |
| `BETTER_AUTH_SECRET`    | Auth encryption secret (min 32 chars) |
| `RAILWAY_PUBLIC_DOMAIN` | Auto-set by Railway                   |

### Feature-Gated

Enable a feature flag in `packages/shared/src/features.ts` and its env vars become required at startup:

| Feature       | Env Vars                                              |
| ------------- | ----------------------------------------------------- |
| `email`       | `RESEND_API_KEY`, `EMAIL_FROM`                        |
| `googleOAuth` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`            |
| `posthog`     | `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST` |

## Testing

- **Unit & integration tests** via `bun:test` with PGlite — tests run against a real PostgreSQL engine, not mocks
- **Test utilities** for creating authenticated users and calling oRPC procedures
- **E2E tests** via [Playwright](https://playwright.dev/) — full auth flow coverage (sign-up, sign-in, sign-out, change password, delete account) with email capture verification. Run `cd apps/e2e && bunx playwright test`

## Tech Stack

| Layer           | Technology                                                                             |
| --------------- | -------------------------------------------------------------------------------------- |
| Framework       | [TanStack Start](https://tanstack.com/start) (Vite + TanStack Router + Nitro)          |
| Language        | TypeScript 5.9 (type-checked via [tsgo](https://github.com/microsoft/typescript-go))   |
| API             | [oRPC](https://orpc.dev/) + [TanStack Query](https://tanstack.com/query)               |
| Database        | [Drizzle ORM](https://orm.drizzle.team/) + PGlite / PostgreSQL                         |
| Auth            | [Better Auth](https://better-auth.com/) (email/password, passkeys, admin)              |
| UI              | [shadcn v4](https://ui.shadcn.com/) + Tailwind CSS 4 + [Base UI](https://base-ui.com/) |
| Email           | [React Email](https://react.email/) + [Resend](https://resend.com/)                    |
| i18n            | [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (full-stack)  |
| Logging         | [Pino](https://getpino.io/) + oRPC plugin                                              |
| Linting         | [Ultracite](https://github.com/haydenbleasel/ultracite) (Oxlint + Oxfmt)               |
| Package Manager | [Bun](https://bun.sh/)                                                                 |
| Monorepo        | [Turborepo](https://turborepo.dev/)                                                    |
| Deployment      | [Railway](https://railway.com/)                                                        |
| CI/CD           | GitHub Actions                                                                         |

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
