---
name: database
description: Database layer — Drizzle ORM, Cloudflare D1 (SQLite), Drizzle-Zod schema validation, migrations, ULID helpers, and test setup. Use when modifying schema, adding tables/indexes, working with migrations, or writing database queries in packages/db/.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to schema, migrations, ORM config, D1/KV setup, or oRPC procedures, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Database

[Drizzle ORM](https://orm.drizzle.team/) + [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) + [Cloudflare KV](https://developers.cloudflare.com/kv/) (session/rate-limit storage). D1 for relational data, KV for fast key-value lookups.

## Key Files

| What        | Where                                                                   |
| :---------- | :---------------------------------------------------------------------- |
| DB client   | `packages/db/index.ts` — `initDb(env.DB)` called from server.ts         |
| KV storage  | `packages/auth/kv-storage.ts` — `initKv(env.SESSION_KV)` from server.ts |
| Schema      | `packages/db/schema.ts` — Better Auth tables (SQLite) + indexes         |
| Zod schemas | `packages/db/zod-schema.ts` — Drizzle-Zod select/insert/update schemas |
| ULID helper | `packages/db/utils.ts` — `ulidPrimaryKey` (text + ULID)                 |
| D1 types    | `packages/db/d1.d.ts` — minimal D1Database type declaration             |
| Migrations  | `packages/db/drizzle/` — applied via `wrangler d1 migrations apply`  |
| Local data  | `.wrangler/state/` (gitignored) — miniflare simulates D1+KV locally |
| Test DB     | `packages/db/tests/setup.ts` — in-memory bun:sqlite for tests       |

## How It Works

- D1 binding `DB` + KV binding `SESSION_KV` defined in `wrangler.jsonc`, initialized in `apps/web/src/server.ts`
- No `DATABASE_URL` — D1 is accessed via native Worker binding, not a connection string
- KV used as Better Auth secondary storage (sessions + rate limiting) for globally-replicated sub-10ms reads
- Local dev: D1 + KV simulated by miniflare via `@cloudflare/vite-plugin`
- Tests: in-memory `bun:sqlite` via preload setup (`packages/db/bunfig.toml`). KV no-ops gracefully when uninitialized.

## CRITICAL

- **NEVER run `bun db:generate` or `bun db:migrate` via Claude Code** — requires interactive input
- Schema MUST use SQLite types (text, integer, blob) — NEVER use Postgres types
- MUST use `ulidPrimaryKey` from `packages/db/utils.ts` for primary keys

## Drizzle-Zod (Schema Validation)

Reference: https://orm.drizzle.team/docs/zod

[`drizzle-zod`](https://orm.drizzle.team/docs/zod) generates Zod schemas directly from Drizzle table definitions. Pre-built schemas are exported from `@ingot/db/zod-schema`.

```ts
import { selectUserSchema, insertUserSchema, updateUserSchema } from "@ingot/db/zod-schema";

// Validate a select result
const user = selectUserSchema.parse(row);

// Validate insert data
const data = insertUserSchema.parse(input);

// Validate update data (all fields optional, generated columns excluded)
const patch = updateUserSchema.parse(input);
```

**When adding a new table**, MUST also add corresponding Zod schemas to `packages/db/zod-schema.ts`:

```ts
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { myTable } from "./schema";

export const selectMyTableSchema = createSelectSchema(myTable);
export const insertMyTableSchema = createInsertSchema(myTable);
export const updateMyTableSchema = createUpdateSchema(myTable);
```

**Refinements** — extend generated schemas with custom validations:

```ts
const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.max(100),
  email: (schema) => schema.email(),
});
```

MUST prefer Drizzle-Zod schemas over manually written Zod schemas when validating data that maps to a database table. This ensures validation stays in sync with the schema automatically.

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
