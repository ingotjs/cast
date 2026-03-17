import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import { isDevelopment, serverEnv } from "../env";
import * as schema from "./schema";

// Reference: https://orm.drizzle.team/docs/connect-neon
// Reference: https://orm.drizzle.team/docs/connect-pglite

/** Whether the database is using PGlite (local development mode) */
export const isPglite = isDevelopment && !serverEnv.DATABASE_URL;

export type Database =
  | ReturnType<typeof drizzleNeonHttp<typeof schema>>
  | ReturnType<typeof drizzlePglite<typeof schema>>;

/**
 * Database client that automatically switches between:
 * - PGlite (local development): when DATABASE_URL is not set in dev
 * - Neon (production/Cloudflare): when DATABASE_URL is set (required in prod)
 */
const createDb = (): Database => {
  if (serverEnv.DATABASE_URL) {
    const client = neon(serverEnv.DATABASE_URL);
    return drizzleNeonHttp({ client, schema });
  }

  const client = new PGlite(".pglite");
  return drizzlePglite({ client, schema });
};

export const db = createDb();

// Auto-apply migrations for PGlite (local dev only) — in production, migrations
// are applied via CI (`bun db:migrate` with DATABASE_URL pointing to Neon).
// This code path never runs in Workers (isPglite requires isDevelopment).
if (isPglite) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const migrationsFolder = resolve(currentDir, "../../drizzle");
  await migrate(db as ReturnType<typeof drizzlePglite<typeof schema>>, {
    migrationsFolder,
  });
}
