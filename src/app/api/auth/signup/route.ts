/**
 * POST /api/auth/signup
 *
 * Creates a new customer account, hashes the password, and starts
 * a session. Email verification is opt-in (off by default to keep
 * signup friction low — flip the env flag when ready).
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/auth/validation";
import { createSession } from "@/lib/auth/cookies";
import { generateId } from "@/lib/auth/id";
import { rateLimit } from "@/lib/auth/rate-limit";
import { audit } from "@/lib/auth/audit";

export async function POST(req: Request) {
  // Rate limit: 5 signups per IP per hour
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = await rateLimit(`signup:${ip}`, 5, 60 * 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many signups. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { email, password, name, marketingOptIn } = parsed.data;

  // Check if email is already taken
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    // Don't leak whether email exists — return same shape as success
    return NextResponse.json(
      { error: "Could not create account with these details." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  const userId = generateId();

  await db.insert(users).values({
    id: userId,
    email,
    passwordHash,
    name,
    marketingOptIn,
    role: "customer",
  });

  await createSession(userId, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: ip,
  });

  await audit({
    actorType: "user",
    actorId: userId,
    action: "user.signup",
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({ ok: true, userId });
}