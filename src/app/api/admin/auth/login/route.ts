/**
 * POST /api/admin/auth/login
 *
 * Admin login with lockout after 5 failed attempts.
 * Stricter rate limit than storefront (admin brute-force is high-impact).
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { adminLoginSchema } from "@/lib/auth/validation";
import {
  createAdminSession,
  isAccountLocked,
  recordFailedAdminLogin,
  clearFailedAdminLogins,
} from "@/lib/auth/admin-cookies";
import { rateLimit } from "@/lib/auth/rate-limit";
import { audit } from "@/lib/auth/audit";

const GENERIC_ERROR = "Invalid email or password.";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = await rateLimit(`admin-login:${ip}`, 5, 60 * 5); // 5 per 5 min
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }
  const { email, password, remember } = parsed.data;

  // Check lockout
  const locked = await isAccountLocked(email);
  if (locked) {
    const minutes = Math.ceil(
      (locked.lockedUntil.getTime() - Date.now()) / 60000
    );
    return NextResponse.json(
      { error: `Account temporarily locked. Try again in ${minutes} min.` },
      { status: 429 }
    );
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (!user) {
    await verifyPassword(password, "$argon2id$v=19$m=65536,t=3,p=1$dummy$dummy");
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await recordFailedAdminLogin(email);
    await audit({
      actorType: "admin",
      actorId: user.id,
      action: "admin.login_failed",
      ipAddress: ip,
    });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  await clearFailedAdminLogins(user.id);
  await createAdminSession(user.id, {
    remember,
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: ip,
  });

  await audit({
    actorType: "admin",
    actorId: user.id,
    action: "admin.login",
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