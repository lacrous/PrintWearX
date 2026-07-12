/**
 * POST /api/auth/reset-password
 *
 * Consumes a password reset token, updates the password, and revokes
 * all existing sessions (forces re-login on all devices).
 */

import { NextResponse } from "next/server";
import { eq, and, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users, passwordResets } from "@/lib/db/schema";
import { resetPasswordSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/tokens";
import { revokeAllUserSessions } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { token, password } = parsed.data;

  const tokenHash = await hashToken(token);

  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.tokenHash, tokenHash),
        gt(passwordResets.expiresAt, new Date()),
        isNull(passwordResets.usedAt)
      )
    )
    .limit(1);

  if (!reset) {
    return NextResponse.json(
      { error: "Reset link is invalid or expired." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, reset.userId));

  await db
    .update(passwordResets)
    .set({ usedAt: new Date() })
    .where(eq(passwordResets.id, reset.id));

  // Revoke all sessions — force re-login everywhere
  await revokeAllUserSessions(reset.userId);

  await audit({
    actorType: "user",
    actorId: reset.userId,
    action: "user.password_reset_completed",
    ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}