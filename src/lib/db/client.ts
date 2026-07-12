/**
 * Drizzle database client.
 *
 * SQLite for development (single file, zero setup). To switch to
 * PostgreSQL in production, replace better-sqlite3 + drizzle-orm/better-sqlite3
 * with postgres + drizzle-orm/postgres-js, and update schema.ts to use
 * pgTable instead of sqliteTable. The query API stays identical.
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";

const DB_PATH =
  process.env.DATABASE_PATH ||
  (process.env.NODE_ENV === "production"
    ? "/var/data/printwearx.db"
    : ".data/printwearx.db");

// Ensure parent dir exists
const parentDir = dirname(DB_PATH);
if (!existsSync(parentDir)) {
  mkdirSync(parentDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL"); // better concurrency
sqlite.pragma("foreign_keys = ON"); // enforce FK constraints

export const db = drizzle(sqlite, { schema });
export { schema };
export type DB = typeof db;

// Close gracefully on shutdown
if (typeof process !== "undefined") {
  process.on("SIGINT", () => {
    sqlite.close();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    sqlite.close();
    process.exit(0);
  });
}