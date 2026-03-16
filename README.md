# Start

Turborepo monorepo using [Bun](https://bun.sh/) as the package manager.

## What's inside?

### Apps and Packages

- `web`: a [TanStack Start](https://tanstack.com/start) app (Vite + TanStack Router)
- `@repo/ui`: shared UI component library ([shadcn v4](https://ui.shadcn.com/) + Tailwind CSS + Base UI)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking (via [tsgo](https://github.com/microsoft/typescript-go))
- [Ultracite](https://github.com/haydenbleasel/ultracite) for code linting and formatting (Oxlint + Oxfmt)
- [syncpack](https://syncpack.dev/) for enforcing pinned dependency versions
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
- `bun build` — Build all apps
- `bun ok` — Run all checks (type check + lint)
- `bun ok:ci` — Same as `bun ok` but without auto-fixes (for CI)

<details>
<summary>Claude Code Skills</summary>

This project includes 38 [Claude Code skills](https://skills.sh) for AI-assisted development:

- [shadcn](https://skills.sh/shadcn/ui) — Manages shadcn components: adding, styling, composing UI
- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills) — React and Next.js performance patterns from Vercel
- [better-auth-best-practices](https://skills.sh/better-auth/skills) — Better Auth documentation and best practices
- [find-skills](https://skills.sh/vercel-labs/skills) — Discover and install new skills
- [skill-creator](https://skills.sh/anthropics/skills) — Create and evaluate custom skills
- [Marketing Skills](https://skills.sh/coreyhaines31/marketingskills) — 33 marketing skills (SEO, copywriting, ads, CRO, email sequences, pricing, and more)

</details>
