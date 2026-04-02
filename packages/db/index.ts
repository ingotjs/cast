// oxlint-disable-next-line typescript-eslint/triple-slash-reference -- ambient D1Database type needed for cross-package resolution
/// <reference path="./d1.d.ts" />
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

// Reference: https://orm.drizzle.team/docs/connect-d1

export type Database = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Global database instance.
 *
 * In Workers: initialized via `initDb(env.DB)` from the app entry point (server.ts).
 * In tests: initialized via `setDb()` with a bun:sqlite-backed instance.
 */
let _db: Database | undefined;

/** Initialize the database with a D1 binding (called from server.ts) */
export const initDb = (d1: D1Database) => {
  _db = drizzle(d1, { schema });
};

/** Set the database instance directly (used by test setup) */
export const setDb = (instance: Database) => {
  _db = instance;
};

/** Lazily-accessed database — throws if not initialized */
export const db: Database = new Proxy({} as Database, {
  get(_, prop) {
    if (!_db) {
      throw new Error("Database not initialized. Call initDb(env.DB) or setDb().");
    }
    return Reflect.get(_db, prop);
  },
});
