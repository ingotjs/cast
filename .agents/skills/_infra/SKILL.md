---
name: infra
description: Infrastructure and deployment — wrangler, @cloudflare/vite-plugin, Cloudflare Workers, D1, KV, CI/CD pipeline. Use when modifying wrangler.jsonc, deployment config, CI pipeline, or infrastructure-related settings.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to wrangler config, Cloudflare Workers setup, CI/CD pipeline, or deployment workflow, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Infrastructure & Deployment

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) + [@cloudflare/vite-plugin](https://developers.cloudflare.com/workers/frameworks/framework-guides/tanstack-start/) for Cloudflare Workers + D1 + KV. No IaC framework — just wrangler config and CLI.

## Key Files

| What           | Where                                                                                |
| :------------- | :----------------------------------------------------------------------------------- |
| Worker config  | `wrangler.jsonc` — D1 + KV bindings, compatibility flags, observability      |
| Vite plugin    | `apps/web/vite.config.ts` — `cloudflare({ viteEnvironment: { name: "ssr" } })`       |
| Deploy         | `bun deploy` → `cd apps/web && npx wrangler deploy`                                 |
| Dev server     | `bun dev` → `vite dev` with `@cloudflare/vite-plugin` (Miniflare for D1/KV)         |
| Migrations     | `bun db:migrate` → `wrangler d1 migrations apply db --local`                        |
| CI pipeline    | `.github/workflows/ci.yml` — check → e2e → deploy                                   |
| Setup          | `bun setup` → generates `.env` + checks GitHub secrets                               |

## How It Works

- `@cloudflare/vite-plugin` wraps Miniflare for local dev — D1 + KV emulated automatically
- `wrangler deploy` builds + deploys the Worker with all bindings from `wrangler.jsonc`
- `wrangler secret put` stores production secrets on Cloudflare (not in files or CI)
- `wrangler d1 migrations apply` runs Drizzle migrations against D1

## Environment & Secrets

| Type              | Where                                       | Example                                 |
| :---------------- | :------------------------------------------ | :-------------------------------------- |
| D1/KV bindings    | `wrangler.jsonc`                             | `[[d1_databases]]`, `[[kv_namespaces]]` |
| Non-secret vars   | `wrangler.jsonc` `[vars]`                    | `URL = "https://..."`                   |
| Production secrets| `wrangler secret put`                       | `BETTER_AUTH_SECRET`                    |
| Local dev secrets | `.dev.vars` (gitignored)                    | `BETTER_AUTH_SECRET=...`                |
| Local dev bindings| Auto-emulated by Miniflare                  | D1, KV                                  |

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

- **Push to main** → check + e2e → D1 migrations → `wrangler deploy`
- Only GitHub secret needed: `CLOUDFLARE_API_TOKEN`

### Production Secrets

Set once via CLI (stored on Cloudflare, not in CI):

```sh
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put URL
```

## Rules

- **NEVER hardcode secrets in `wrangler.jsonc`** — use `wrangler secret put` for sensitive values
- **MUST keep `wrangler.jsonc` bindings in sync** with what `apps/web/src/server.ts` expects (`env.DB`, `env.SESSION_KV`)
- **NEVER run `wrangler d1 migrations apply --remote` via Claude Code** — user MUST run manually
