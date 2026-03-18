import { text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

/** Generate a ULID — used for all primary keys (auth tables + custom tables) */
export const generateId = () => ulid();

export const ulidPrimaryKey = text("id")
  .notNull()
  .primaryKey()
  .$defaultFn(generateId);
