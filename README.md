# Start

Turborepo monorepo using [Bun](https://bun.sh/) as the package manager.

## What's inside?

### Apps and Packages

- `web`: a [TanStack Start](https://tanstack.com/start) app (Vite + TanStack Router)
- `@packages/server`: server-side logic — [oRPC](https://orpc.dev/), [Drizzle](https://orm.drizzle.team/) + PGlite/PostgreSQL, [Better Auth](https://better-auth.com/) with passkey support
- `@packages/shared`: shared utilities (client + server)
- `@packages/email`: email templates ([react-email](https://react.email/) + [Resend](https://resend.com/))
- `@packages/ui`: shared UI component library ([shadcn v4](https://ui.shadcn.com/) + Tailwind CSS + Base UI)
- `@packages/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking (via [tsgo](https://github.com/microsoft/typescript-go))
- [Ultracite](https://github.com/haydenbleasel/ultracite) for code linting and formatting (Oxlint + Oxfmt)
- [syncpack](https://syncpack.dev/) for enforcing pinned dependency versions
- [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe i18n
- [@socketsecurity/bun-security-scanner](https://www.npmjs.com/package/@socketsecurity/bun-security-scanner) for supply chain security scanning (free tier — checks for known vulnerabilities on `bun install`)

## Hosting

Deployed on [Railway](https://railway.com/).

See the [TanStack Start Railway hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#railway--official-partner) for setup instructions.

## Getting Started

```sh
bun install
bun dev
```

## Commands

- `bun dev` — Start all apps in dev mode
- `bun dev:email` — Start email template preview (port 3002)
- `bun build` — Build all apps
- `bun ok` — Run all checks (type check + lint + tests)
- `bun ok:ci` — Same as `bun ok` but without auto-fixes (for CI)

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
