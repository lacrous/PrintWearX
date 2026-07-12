/**
 * One-shot migration runner.
 *
 * SQLite doesn't have a proper migration history out of the box, so
 * we use Drizzle's migrator to apply SQL files from ./migrations.
 *
 * Run via:  npm run db:migrate
 *
 * For dev, this creates .data/printwearx.db and applies all migrations.
 * For prod, run this before starting the server (or use a migration
 * service like Drizzle Studio / a custom script).
 */

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./client";

migrate(db, { migrationsFolder: "./drizzle" });
console.log("✓ Migrations applied");