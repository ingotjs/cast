import { describe, expect, test } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "../schema";

describe("PGlite", () => {
  test("connects and runs a query", async () => {
    const client = new PGlite();
    const db = drizzle({ client, schema });

    const result = await db.execute(sql`SELECT 1 as value`);
    expect(result.rows[0]?.value).toBe(1);
  });

  test("creates tables from schema and inserts data", async () => {
    const client = new PGlite();
    const db = drizzle({ client, schema });

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        locale TEXT NOT NULL DEFAULT 'en',
        role TEXT DEFAULT 'user',
        banned BOOLEAN DEFAULT FALSE,
        ban_reason TEXT,
        ban_expires TIMESTAMP
      )
    `);

    await db.insert(schema.users).values({
      id: "test-1",
      name: "Test User",
      email: "test@example.com",
    });

    const users = await db.select().from(schema.users);
    expect(users).toHaveLength(1);
    expect(users[0]?.name).toBe("Test User");
    expect(users[0]?.email).toBe("test@example.com");
  });
});
