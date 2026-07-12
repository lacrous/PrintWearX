/**
 * POST /api/auth/login
 *
 * Authenticates by email + password. Generic error message on
 * failure (doesn't leak whether the email exists).
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";
import { createSession, revokeAllUserSessions } from "@/lib/auth/cookies";
import { rateLimit } from "@/lib/auth/rate-limit";
import { audit } from "@/lib/auth/audit";

const GENERIC_ERROR = "Invalid email or password.";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = await rateLimit(`login:${ip}`, 10, 60 * 5); // 10 per 5 min
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }
  const { email, password, remember } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || user.deletedAt) {
    // Run verify anyway to avoid timing oracle
    await verifyPassword(password, "$argon2id$v=19$m=65536,t=3,p=1$dummy$dummy");
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await audit({
      actorType: "user",
      actorId: user.id,
      action: "user.login_failed",
      ipAddress: ip,
    });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  await createSession(user.id, {
    remember,
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: ip,
  });

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  await audit({
    actorType: "user",
    actorId: user.id,
    action: "user.login",
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}