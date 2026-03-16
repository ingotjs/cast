import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

export const uuidPrimaryKey = uuid()
  .notNull()
  .primaryKey()
  .$defaultFn(() => sql`uuidv7()`);
