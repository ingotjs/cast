import { defineConfig } from "drizzle-kit";

// Reference: https://orm.drizzle.team/docs/connect-d1

/**
 * Drizzle Kit configuration for Cloudflare D1 (SQLite).
 *
 * Generate migrations: `bun db:generate`
 * Apply locally:       `bun db:migrate`
 * Apply remotely:      `bun db:migrate:remote`
 */
export default defineConfig({
  out: "./_etc/drizzle",
  schema: "./schema/index.ts",
  dialect: "sqlite",
});
