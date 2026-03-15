# Start

> **Keep docs in sync:** If any information in this file is wrong or outdated, or if important new information should be captured, update this file. Also keep `README.md` up to date — this is a public project.

Turborepo monorepo using bun as the package manager.

## Structure

- `apps/web` — Next.js app
- `packages/ui` — Shared React component library (`@repo/ui`)
- `packages/eslint-config` — Shared ESLint config (`@repo/eslint-config`)
- `packages/typescript-config` — Shared TS config (`@repo/typescript-config`)

## Internal Packages

We use **Just-in-Time Packages** — internal packages export raw TypeScript source (no build step). The consuming app transpiles them directly.

Reference: https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages

## Commands

- `bun install` — Install dependencies
- `turbo dev` — Run all apps in dev mode
- `turbo build` — Build all apps
- `turbo lint` — Lint all packages
- `turbo check-types` — Type check all packages
