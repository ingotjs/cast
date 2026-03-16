import { resolve } from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import { serverEnv } from "../env";
import * as schema from "./schema";

// Reference: https://orm.drizzle.team/docs/connect-pglite
// Reference: https://orm.drizzle.team/docs/get-started/postgresql-new
// Reference: https://orm.drizzle.team/docs/kit-custom-migrations#pglite
// Reference: https://github.com/drizzle-team/drizzle-orm/discussions/2532

/** Whether the database is using PGlite (local development mode) */
export const isPglite = !serverEnv.DATABASE_URL;

export type Database =
  | ReturnType<typeof drizzleNodePostgres<typeof schema>>
  | ReturnType<typeof drizzlePglite<typeof schema>>;

/**
 * Database client that automatically switches between:
 * - PGlite (local development): when DATABASE_URL is not set
 * - PostgreSQL (production/Railway): when DATABASE_URL is set
 */
const createDb = (): Database => {
  if (serverEnv.DATABASE_URL) {
    return drizzleNodePostgres({
      connection: { connectionString: serverEnv.DATABASE_URL },
      schema,
    });
  }

  const client = new PGlite(".pglite");
  return drizzlePglite({ client, schema });
};

export const db = createDb();

// Auto-apply migrations for PGlite (local dev) — in production, migrations
// are applied via Railway's preDeployCommand (`bun db:migrate`)
if (isPglite) {
  const migrationsFolder = resolve(import.meta.dirname, "../../drizzle");
  await migrate(db as ReturnType<typeof drizzlePglite<typeof schema>>, {
    migrationsFolder,
  });
}
