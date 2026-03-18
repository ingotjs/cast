/**
 * Test setup — initializes an in-memory SQLite database for all tests.
 * This file is loaded via bunfig.toml preload before any test runs.
 */
import { Database } from "bun:sqlite";

import { drizzle } from "drizzle-orm/bun-sqlite";

import type { Database as DbType } from "../db";
import { setDb } from "../db";
import * as schema from "../db/schema";

const sqlite = new Database(":memory:");
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = ON;");

// Create all tables matching the D1/SQLite schema
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "email_verified" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "created_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
    "updated_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
    "locale" TEXT NOT NULL DEFAULT 'en',
    "role" TEXT DEFAULT 'user',
    "banned" INTEGER DEFAULT 0,
    "ban_reason" TEXT,
    "ban_expires" INTEGER
  );

  CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT PRIMARY KEY,
    "expires_at" INTEGER NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "created_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
    "updated_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "impersonated_by" TEXT
  );
  CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "sessions"("user_id");

  CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" INTEGER,
    "refresh_token_expires_at" INTEGER,
    "scope" TEXT,
    "password" TEXT,
    "created_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
    "updated_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
  );
  CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts"("user_id");

  CREATE TABLE IF NOT EXISTS "verifications" (
    "id" TEXT PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
    "updated_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
  );
  CREATE INDEX IF NOT EXISTS "verifications_identifier_idx" ON "verifications"("identifier");

  CREATE TABLE IF NOT EXISTS "passkeys" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT,
    "public_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "credential_id" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "device_type" TEXT NOT NULL,
    "backed_up" INTEGER NOT NULL,
    "transports" TEXT,
    "aaguid" TEXT,
    "created_at" INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
  );
  CREATE INDEX IF NOT EXISTS "passkeys_userId_idx" ON "passkeys"("user_id");
`);

const testDb = drizzle(sqlite, { schema }) as unknown as DbType;

setDb(testDb);
