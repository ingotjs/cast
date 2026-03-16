import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";

import { serverEnv } from "../env";
import * as schema from "./schema";

// Reference: https://orm.drizzle.team/docs/connect-pglite
// Reference: https://orm.drizzle.team/docs/get-started/postgresql-new

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
