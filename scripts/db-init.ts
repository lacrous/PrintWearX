/**
 * Database initialization script.
 *
 * Run with: npm run db:init
 *
 * Creates the SQLite database file and applies the schema.
 * Idempotent — safe to re-run.
 */

import Database from "better-sqlite3";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DATABASE_PATH || ".data/printwearx.db";
const SQL_PATH = "./src/lib/db/init.sql";

const parentDir = dirname(DB_PATH);
if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const sql = readFileSync(SQL_PATH, "utf8");
db.exec(sql);

console.log(`✓ Schema applied to ${DB_PATH}`);

// Show tables
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all() as { name: string }[];
console.log(`  Tables: ${tables.map((t) => t.name).join(", ")}`);

db.close();