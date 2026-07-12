/**
 * Admin session management. Same shape as storefront, different cookie name
 * and a stricter 8-hour default (admins should re-auth frequently).
 */

import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { db } from "../db/client";
import { adminSessions, adminUsers, type AdminUser } from "../db/schema";
import { generateSessionToken } from "./tokens";

export const ADMIN_SESSION_COOKIE = "pwx_admin_session";
const ADMIN_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const REMEMBER_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days with remember

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 min

export async function createAdminSession(
  adminUserId: string,
  opts: { remember?: boolean; userAgent?: string; ipAddress?: string } = {}
) {
  const token = generateSessionToken();
  const ttl = opts.remember ? REMEMBER_TTL_SECONDS : ADMIN_TTL_SECONDS;
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await db.insert(adminSessions).values({
    id: token,
    adminUserId,
    expiresAt,
    userAgent: opts.userAgent,
    ipAddress: opts.ipAddress,
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // stricter than storefront
    path: "/",
    maxAge: ttl,
  });

  return { token, expiresAt };
}

export async function getAdminSessionUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await db
    .select({ session: adminSessions, user: adminUsers })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
    .where(and(eq(adminSessions.id, token), gt(adminSessions.expiresAt, new Date())))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) return null;
  if (row.session.revokedAt) {
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    return null;
  }
  return row.user;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await db
      .update(adminSessions)
      .set({ revokedAt: new Date() })
      .where(eq(adminSessions.id, token));
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Check account lockout status. Returns the user if locked, else null.
 */
export async function isAccountLocked(
  email: string
): Promise<{ lockedUntil: Date } | null> {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (!user) return null;
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { lockedUntil: user.lockedUntil };
  }
  return null;
}

/** Increment failed login counter, lock if over threshold. */
export async function recordFailedAdminLogin(email: string): Promise<void> {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (!user) return; // don't leak which emails exist

  const newCount = user.failedLoginCount + 1;
  const updates: Partial<AdminUser> = { failedLoginCount: newCount };
  if (newCount >= LOCKOUT_THRESHOLD) {
    updates.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    updates.failedLoginCount = 0;
  }
  await db.update(adminUsers).set(updates).where(eq(adminUsers.id, user.id));
}

/** Reset failed login counter on successful login. */
export async function clearFailedAdminLogins(adminUserId: string): Promise<void> {
  await db
    .update(adminUsers)
    .set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(adminUsers.id, adminUserId));
}

// Role helpers
export function hasRole(user: AdminUser, ...roles: AdminUser["role"][]): boolean {
  return roles.includes(user.role);
}

export function requireRole(
  user: AdminUser | null,
  ...roles: AdminUser["role"][]
): asserts user is AdminUser {
  if (!user) throw new AuthError("Not signed in", 401);
  if (!hasRole(user, ...roles)) throw new AuthError("Forbidden", 403);
}

export class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = "AuthError";
  }
}