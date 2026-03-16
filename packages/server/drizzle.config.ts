import { defineConfig } from "drizzle-kit";

import { serverEnv } from "./src/env";

// Reference: https://orm.drizzle.team/docs/connect-pglite

/**
 * Drizzle Kit configuration that supports both:
 * - PGlite (local development): when DATABASE_URL is not set
 * - PostgreSQL (production/Railway): when DATABASE_URL is set
 */
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  ...(serverEnv.DATABASE_URL
    ? {
        dbCredentials: {
          url: serverEnv.DATABASE_URL,
        },
      }
    : {
        driver: "pglite",
        dbCredentials: {
          url: ".pglite",
        },
      }),
});
