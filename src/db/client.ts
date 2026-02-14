import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "../config.ts";
import { logger } from "../utils/logger.ts";
import * as schema from "./schema.ts";

// Ensure the data directory exists
mkdirSync(dirname(config.DB_PATH), { recursive: true });

const sqlite = new Database(config.DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export function runMigrations() {
  logger.info({ dbPath: config.DB_PATH }, "Running database migrations...");
  migrate(db, { migrationsFolder: "src/db/migrations" });
  logger.info("Database migrations complete");
}
