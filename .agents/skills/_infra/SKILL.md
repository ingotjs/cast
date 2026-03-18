---
name: infra
description: Infrastructure and deployment — Alchemy IaC, Cloudflare Workers, D1 provisioning, CI/CD pipeline, and deployment workflow. Use when modifying alchemy.run.ts, deployment config, CI pipeline, or infrastructure-related settings.
---

# Infrastructure & Deployment

[Alchemy](https://alchemy.run/) — TypeScript-native IaC for [Cloudflare Workers](https://workers.cloudflare.com/) + [D1](https://developers.cloudflare.com/d1/) (SQLite). Alchemy wraps `@cloudflare/vite-plugin` and `wrangler`, providing typed infrastructure definitions in pure TypeScript.

## Key Files

| What           | Config                                                                                                      |
| :------------- | :---------------------------------------------------------------------------------------------------------- |
| IaC definition | `alchemy.run.ts` — D1 database + TanStack Start worker                                                      |
| Build/Deploy   | `cd apps/web && bun run deploy` (`alchemy deploy` — builds, provisions D1, applies migrations, deploys)     |
| Dev server     | `bun dev` → `alchemy dev` → generates wrangler config → runs `vite dev`                                     |
| Migrations     | Applied automatically by Alchemy on `dev`/`deploy` via `migrationsDir` in D1Database                        |
| Health check   | `/api/auth/ok`                                                                                              |
| State          | `.alchemy/omegastart/` — encrypted resource state (committed). `.alchemy/miniflare/` — local data (ignored) |
| Wrangler       | `apps/web/wrangler.jsonc` — kept for manual wrangler CLI use (db:studio, db:migrate)                        |

## How It Works

- `alchemy dev` evaluates `alchemy.run.ts`, generates `.alchemy/local/wrangler.jsonc`, then runs `vite dev`
- `alchemy deploy` evaluates `alchemy.run.ts`, provisions/updates D1 + Worker, applies migrations, deploys
- The Alchemy Vite plugin (`alchemy/cloudflare/tanstack-start`) wraps `@cloudflare/vite-plugin`, pointing it at the generated wrangler config
- `ALCHEMY_PASSWORD` env var required for state encryption (generate with `openssl rand -base64 32`)
- `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` required for deploy (not needed for local dev)

Reference: https://alchemy.run/guides/cloudflare-tanstack-start/

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) — runs `bun ok:ci` on push to `main` and PRs. Uses `oven-sh/setup-bun@v2`.

On push to `main`: deploys via `alchemy deploy` (provisions D1, applies migrations, deploys Worker), uploads source maps to PostHog, reports CI metrics. Requires GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ALCHEMY_PASSWORD`, `POSTHOG_PROJECT_ID`, `POSTHOG_CLI_API_KEY`, `POSTHOG_PROJECT_API_KEY`.
