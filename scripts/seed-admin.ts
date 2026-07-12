/**
 * Seed script: create the first admin user with a known invite code.
 *
 * Run with: npm run db:seed-admin
 *
 * This generates a one-time invite code that you can use to sign up
 * the very first admin. After using it, run this script again only
 * if you need to create another bootstrap invite.
 */

import Database from "better-sqlite3";
import { hash } from "@node-rs/argon2";
import { generateId } from "../src/lib/auth/id";
import { generateInviteCode, hashToken } from "../src/lib/auth/tokens";

const DB_PATH = process.env.DATABASE_PATH || ".data/printwearx.db";
const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

async function main() {
  const adminId = generateId();
  const email = process.env.ADMIN_EMAIL || "hassan@nurovia.dev";
  const password = process.env.ADMIN_PASSWORD || generateStrongPassword();
  const name = process.env.ADMIN_NAME || "Hassan El-Deghidy";

  const passwordHash = await hash(password, {
    algorithm: 2,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  db.prepare(
    `INSERT INTO admin_users (id, email, password_hash, name, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'owner', ?, ?)`
  ).run(adminId, email, passwordHash, name, Date.now(), Date.now());

  console.log(`✓ Created admin: ${email} (id: ${adminId})`);
  console.log(`  Password: ${password}`);
  console.log(`  ⚠ Change this password after first login!`);

  // Generate a bootstrap invite code for creating more admins
  const inviteCode = generateInviteCode();
  const codeHash = await hashToken(inviteCode);
  db.prepare(
    `INSERT INTO admin_invites (id, code_hash, role, created_by, created_at, expires_at, note)
     VALUES (?, ?, 'owner', ?, ?, ?, 'Bootstrap invite')`
  ).run(
    generateId(),
    codeHash,
    adminId,
    Date.now(),
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  console.log(`\n✓ Invite code (one-time, 7-day expiry): ${inviteCode}`);
  console.log(`  Use at /admin/signup\n`);

  db.close();
}

function generateStrongPassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*";
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  let p = "";
  for (let i = 0; i < bytes.length; i++) p += chars[bytes[i] % chars.length];
  return p;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});