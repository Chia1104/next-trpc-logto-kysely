import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { type DB } from "./types";
import { env } from "@/env.mjs";

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
});

export { DB, Kysely };
