/**
 * Session management for storefront users.
 *
 * The session ID is stored in an HTTP-only cookie that's never
 * accessible to JavaScript (mitigates XSS-based session theft).
 * The server stores the actual session data (user ID, expiry, etc.)
 * in the `sessions` table — so we can revoke instantly.
 *
 * Cookie attributes:
 *   HttpOnly  → not readable from JS (XSS protection)
 *   Secure    → HTTPS only in production
 *   SameSite=Lax → CSRF protection for top-level navigations
 *   Path=/    → sent for all routes
 *
 * Session lifetime:
 *   - Default: 30 days
 *   - With "remember me": 90 days
 *   - Sliding: every request extends by 30 days if <7 days remain
 */

import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { db } from "../db/client";
import { sessions, users, type User } from "../db/schema";
import { generateSessionToken } from "./tokens";

export const SESSION_COOKIE = "pwx_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const REMEMBER_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days
const SLIDING_THRESHOLD_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function createSession(
  userId: string,
  opts: {
    remember?: boolean;
    userAgent?: string;
    ipAddress?: string;
  } = {}
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const ttl = opts.remember ? REMEMBER_TTL_SECONDS : DEFAULT_TTL_SECONDS;
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await db.insert(sessions).values({
    id: token,
    userId,
    expiresAt,
    userAgent: opts.userAgent,
    ipAddress: opts.ipAddress,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttl,
  });

  return { token, expiresAt };
}

/**
 * Read the current session from the cookie. Returns the user record
 * or null. Sliding refresh: extends the session if it's close to expiring.
 */
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, token),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) return null;

  // Check session wasn't revoked
  if (row.session.revokedAt) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  // Check user wasn't deleted
  if (row.user.deletedAt) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  // Sliding refresh
  const secondsLeft =
    (row.session.expiresAt.getTime() - Date.now()) / 1000;
  if (secondsLeft < SLIDING_THRESHOLD_SECONDS) {
    const newExpiry = new Date(Date.now() + DEFAULT_TTL_SECONDS * 1000);
    await db
      .update(sessions)
      .set({ expiresAt: newExpiry })
      .where(eq(sessions.id, token));
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DEFAULT_TTL_SECONDS,
    });
  }

  return row.user;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, token));
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Revoke all sessions for a user (used on password change). */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.userId, userId));
}