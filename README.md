# Start

Turborepo monorepo using [Bun](https://bun.sh/) as the package manager.

## What's inside?

### Apps and Packages

- `web`: a [TanStack Start](https://tanstack.com/start) app (Vite + TanStack Router). Includes admin dashboard at `/admin` (role-guarded).
- `@packages/server`: server-side logic — [oRPC](https://orpc.dev/), [Drizzle](https://orm.drizzle.team/) + PGlite/PostgreSQL, [Better Auth](https://better-auth.com/) with admin + passkey plugins
- `@packages/shared`: shared utilities and feature flags (client + server)
- `@packages/email`: email templates ([react-email](https://react.email/) + [Resend](https://resend.com/))
- `@packages/ui`: shared UI component library ([shadcn v4](https://ui.shadcn.com/) + Tailwind CSS + Base UI)
- `@packages/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Key Features

- **Auth**: Email/password + passkey login via [Better Auth](https://better-auth.com/) with pre-built UI ([better-auth-ui](https://better-auth-ui.com/))
- **API**: Type-safe RPC via [oRPC](https://orpc.dev/) with TanStack Query integration
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) — PGlite for local dev (zero config), PostgreSQL in production. Migrations auto-applied on deploy.
- **Admin**: Role-guarded admin dashboard with user management (ban, roles, impersonation)
- **Analytics**: [PostHog](https://posthog.com/) integration (conditional on env)
- **i18n**: [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe translations
- **Feature Flags**: Centralized in `packages/shared/consts` with per-environment (`dev`/`prod`) control

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking (via [tsgo](https://github.com/microsoft/typescript-go))
- [Ultracite](https://github.com/haydenbleasel/ultracite) for code linting and formatting (Oxlint + Oxfmt)
- [syncpack](https://syncpack.dev/) for enforcing pinned dependency versions
- [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe i18n
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) for supply chain security scanning (free tier — checks for known vulnerabilities on `bun install`)

## Hosting

Deployed on [Railway](https://railway.com/) with automatic database migrations on deploy.

See the [TanStack Start Railway hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#railway--official-partner) for setup instructions.

### Required Environment Variables (Production)

| Variable                | Description                           |
| ----------------------- | ------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string          |
| `BETTER_AUTH_SECRET`    | Auth encryption secret (min 32 chars) |
| `RAILWAY_PUBLIC_DOMAIN` | Auto-set by Railway                   |

All other env vars are controlled by [feature flags](packages/shared/src/consts.ts) — enable a feature and its env vars become required.

## Getting Started

```sh
bun install
bun dev
```

`bun dev` auto-runs `bun install` to ensure dependencies are up to date.

## Commands

- `bun dev` — Start all apps in dev mode (auto-installs deps)
- `bun dev:email` — Start email template preview (port 3002)
- `bun build` — Build all apps
- `bun ok` — Run all checks (type check + lint + tests)
- `bun ok:ci` — Same as `bun ok` but without auto-fixes (for CI)
- `bun db:generate` — Generate database migrations
- `bun db:migrate` — Apply database migrations
- `bun db:studio` — Open Drizzle Studio

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
