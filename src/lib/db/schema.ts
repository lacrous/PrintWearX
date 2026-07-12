/**
 * Database schema for PrintWearX.
 *
 * Two separate identity pools (matches the existing UI split):
 *   - Storefront: users / sessions / password_resets
 *   - Admin:      admin_users / admin_sessions / admin_invites
 *
 * Why two pools? Security. A leaked customer session can never grant
 * admin access, and the invite-only admin signup flow stays separate
 * from public customer signup.
 *
 * Stack: SQLite for dev (single file, zero setup). Drizzle ORM
 * abstracts the queries, so swapping to PostgreSQL in production is
 * a 5-line change in client.ts.
 */

import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

// ============================================================================
// Storefront: customer accounts
// ============================================================================

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    emailVerifiedAt: integer("email_verified_at", { mode: "timestamp" }),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    role: text("role", { enum: ["customer", "vip"] })
      .notNull()
      .default("customer"),
    marketingOptIn: integer("marketing_opt_in", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
    // For soft-delete / GDPR right-to-erasure
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

/**
 * Sessions are stored server-side. The cookie only holds an opaque
 * session ID. This lets us revoke sessions instantly (logout from
 * all devices, suspicious activity, etc.) without rotating a signing key.
 */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(), // random 32-byte hex, also the cookie value
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    // Revoke all sessions for a user on password change or "log out everywhere"
    revokedAt: integer("revoked_at", { mode: "timestamp" }),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
  })
);

/**
 * One-time tokens for password reset. The token is hashed before
 * storage — even if the DB leaks, attackers can't reset passwords.
 */
export const passwordResets = sqliteTable(
  "password_resets",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    usedAt: integer("used_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("password_resets_user_id_idx").on(table.userId),
  })
);

// ============================================================================
// Admin: staff accounts (separate identity pool)
// ============================================================================

export const adminUsers = sqliteTable(
  "admin_users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    role: text("role", { enum: ["owner", "editor", "support", "viewer"] })
      .notNull()
      .default("viewer"),
    // 2FA-ready: TOTP secret and backup codes
    totpSecret: text("totp_secret"),
    totpEnabled: integer("totp_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    // Account lockout after N failed attempts
    failedLoginCount: integer("failed_login_count").notNull().default(0),
    lockedUntil: integer("locked_until", { mode: "timestamp" }),
  },
  (table) => ({
    emailIdx: index("admin_users_email_idx").on(table.email),
  })
);

export const adminSessions = sqliteTable(
  "admin_sessions",
  {
    id: text("id").primaryKey(),
    adminUserId: text("admin_user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    revokedAt: integer("revoked_at", { mode: "timestamp" }),
  },
  (table) => ({
    adminUserIdIdx: index("admin_sessions_admin_user_id_idx").on(
      table.adminUserId
    ),
  })
);

/**
 * Invite codes for admin signup. Single-use, time-limited.
 * Codes are hashed at rest (the plain code is only shown once at
 * generation time).
 */
export const adminInvites = sqliteTable(
  "admin_invites",
  {
    id: text("id").primaryKey(),
    codeHash: text("code_hash").notNull().unique(),
    role: text("role", { enum: ["owner", "editor", "support", "viewer"] })
      .notNull(),
    createdBy: text("created_by").references(() => adminUsers.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    usedAt: integer("used_at", { mode: "timestamp" }),
    usedBy: text("used_by").references(() => adminUsers.id),
    // Optional email restriction: invite only works for this email
    emailRestriction: text("email_restriction"),
    note: text("note"), // "For Sarah starting 2026-08-01"
  },
  (table) => ({
    codeHashIdx: index("admin_invites_code_hash_idx").on(table.codeHash),
  })
);

// ============================================================================
// Audit log (for admin actions)
// ============================================================================

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorType: text("actor_type", { enum: ["admin", "user", "system"] })
      .notNull(),
    actorId: text("actor_id"),
    action: text("action").notNull(), // e.g. "user.login", "product.delete"
    targetType: text("target_type"),
    targetId: text("target_id"),
    metadata: text("metadata"), // JSON string
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    actorIdx: index("audit_log_actor_idx").on(
      table.actorType,
      table.actorId
    ),
    actionIdx: index("audit_log_action_idx").on(table.action),
    createdAtIdx: index("audit_log_created_at_idx").on(table.createdAt),
  })
);

// Type exports for use across the codebase
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AdminInvite = typeof adminInvites.$inferSelect;
export type PasswordReset = typeof passwordResets.$inferSelect;