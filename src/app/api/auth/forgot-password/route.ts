/**
 * POST /api/auth/forgot-password
 *
 * Creates a one-time password reset token. Always returns success
 * (don't leak whether the email exists).
 *
 * In production: send the user an email with a link to
 * /reset-password?token=...
 * In dev: log the link to the server console.
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users, passwordResets } from "@/lib/db/schema";
import { forgotPasswordSchema } from "@/lib/auth/validation";
import { generateSessionToken, hashToken } from "@/lib/auth/tokens";
import { generateId } from "@/lib/auth/id";
import { rateLimit } from "@/lib/auth/rate-limit";
import { audit } from "@/lib/auth/audit";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = await rateLimit(`forgot:${ip}`, 3, 60 * 60); // 3 per hour
  if (!limit.ok) {
    return NextResponse.json({ ok: true }); // don't leak
  }

  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true });

  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (user) {
    const rawToken = generateSessionToken();
    const tokenHash = await hashToken(rawToken);
    await db.insert(passwordResets).values({
      id: generateId(),
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=${rawToken}`;

    // In dev, log to console. In prod, send via email service (Resend, etc.)
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n📧 Password reset for ${user.email}: ${resetUrl}\n`);
    } else {
      // TODO: send via email service
      // await sendEmail({ to: user.email, template: 'password-reset', data: { url: resetUrl } });
    }

    await audit({
      actorType: "user",
      actorId: user.id,
      action: "user.password_reset_requested",
      ipAddress: ip,
    });
  }

  return NextResponse.json({ ok: true });
}