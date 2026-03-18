---
name: database
description: Database layer — Drizzle ORM, Cloudflare D1 (SQLite), schema, migrations, ULID helpers, and test setup. Use when modifying schema, adding tables/indexes, working with migrations, or writing database queries in packages/db/.
---

# Database

[Drizzle ORM](https://orm.drizzle.team/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + [Cloudflare KV](https://developers.cloudflare.com/kv/) (session/rate-limit storage). D1 for relational data, KV for fast key-value lookups.

## Key Files

| What        | Where                                                                   |
| :---------- | :---------------------------------------------------------------------- |
| DB client   | `packages/db/index.ts` — `initDb(env.DB)` called from server.ts         |
| KV storage  | `packages/auth/kv-storage.ts` — `initKv(env.SESSION_KV)` from server.ts |
| Schema      | `packages/db/schema.ts` — Better Auth tables (SQLite) + indexes         |
| ULID helper | `packages/db/utils.ts` — `ulidPrimaryKey` (text + ULID)                 |
| D1 types    | `packages/db/d1.d.ts` — minimal D1Database type declaration             |
| Migrations  | `packages/db/drizzle/` — applied automatically by Alchemy on dev/deploy |
| Local data  | `.alchemy/miniflare/` (gitignored) — miniflare simulates D1+KV locally  |
| Test DB     | `packages/db/__tests__/setup.ts` — in-memory bun:sqlite for tests       |

## How It Works

- D1 binding `DB` + KV binding `SESSION_KV` defined in `alchemy.run.ts`, initialized in `apps/web/src/server.ts`
- No `DATABASE_URL` — D1 is accessed via native Worker binding, not a connection string
- KV used as Better Auth secondary storage (sessions + rate limiting) for globally-replicated sub-10ms reads
- Local dev: D1 + KV simulated by miniflare via Alchemy's Vite plugin (wraps `@cloudflare/vite-plugin`)
- Tests: in-memory `bun:sqlite` via preload setup (`packages/db/bunfig.toml`). KV no-ops gracefully when uninitialized.

## CRITICAL

- **NEVER run `bun db:generate` or `bun db:migrate` via Claude Code** — requires interactive input
- Schema uses SQLite types (text, integer, blob) — NOT Postgres types
- Use `ulidPrimaryKey` from `packages/db/utils.ts` for primary keys

## API (oRPC)

[oRPC](https://orpc.dev/) with TanStack Query — define procedures inline, no contract-first.

| Procedure Level      | Access              |
| :------------------- | :------------------ |
| `publicProcedure`    | Anyone              |
| `protectedProcedure` | Authenticated users |
| `adminProcedure`     | Admin role required |

| What                   | Where                                                                        |
| :--------------------- | :--------------------------------------------------------------------------- |
| Base procedures        | `packages/api/base.ts`                                                       |
| Router                 | `packages/api/router.ts`                                                     |
| API route              | `apps/web/src/routes/api/rpc.$.ts`                                           |
| Client (SSR + browser) | `apps/web/src/lib/orpc.ts` — server calls bypass HTTP, client uses `RPCLink` |

Admin procedures: `router.admin.users.*` (list, ban, unban, setRole, remove).

**Usage:** `import { orpc } from "@/lib/orpc"` then `useQuery(orpc.health.queryOptions())`
