import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "../../schema";

describe("D1 (SQLite)", () => {
  test("connects and runs a query", () => {
    const sqlite = new Database(":memory:");
    const db = drizzle(sqlite, { schema });

    const result = db.all<{ value: number }>(sql`SELECT 1 as value`);
    expect(result[0]?.value).toBe(1);
  });

  test("creates tables from schema and inserts data", () => {
    const sqlite = new Database(":memory:");
    sqlite.exec("PRAGMA foreign_keys = ON;");
    const db = drizzle(sqlite, { schema });

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS "users" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
        locale TEXT NOT NULL DEFAULT 'en',
        role TEXT DEFAULT 'user',
        banned INTEGER DEFAULT 0,
        ban_reason TEXT,
        ban_expires INTEGER
      )
    `);

    db.insert(schema.users)
      .values({
        id: "test-1",
        name: "Test User",
        email: "test@example.com",
      })
      .run();

    const users = db.select().from(schema.users).all();
    expect(users).toHaveLength(1);
    expect(users[0]?.name).toBe("Test User");
    expect(users[0]?.email).toBe("test@example.com");
  });
});
