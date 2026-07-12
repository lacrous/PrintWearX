/**
 * POST /api/admin/auth/signup
 *
 * Admin signup is invite-only. Validates the invite code, marks it
 * used, and creates the admin user with the role encoded in the invite.
 */

import { NextResponse } from "next/server";
import { eq, and, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { adminUsers, adminInvites } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { adminSignupSchema } from "@/lib/auth/validation";
import { hashToken } from "@/lib/auth/tokens";
import {
  createAdminSession,
} from "@/lib/auth/admin-cookies";
import { generateId } from "@/lib/auth/id";
import { rateLimit } from "@/lib/auth/rate-limit";
import { audit } from "@/lib/auth/audit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = await rateLimit(`admin-signup:${ip}`, 3, 60 * 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = adminSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { email, password, name, inviteCode } = parsed.data;

  // Hash the invite code to look it up (codes are stored hashed)
  const codeHash = await hashToken(inviteCode);

  const [invite] = await db
    .select()
    .from(adminInvites)
    .where(
      and(
        eq(adminInvites.codeHash, codeHash),
        gt(adminInvites.expiresAt, new Date()),
        isNull(adminInvites.usedAt)
      )
    )
    .limit(1);

  if (!invite) {
    return NextResponse.json(
      { error: "Invalid or expired invite code." },
      { status: 400 }
    );
  }

  // Optional email restriction
  if (invite.emailRestriction && invite.emailRestriction !== email) {
    return NextResponse.json(
      { error: "This invite is for a different email address." },
      { status: 400 }
    );
  }

  // Check if admin already exists
  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "An admin account with this email already exists." },
      { status: 400 }
    );
  }

  const adminUserId = generateId();
  const passwordHash = await hashPassword(password);

  await db.insert(adminUsers).values({
    id: adminUserId,
    email,
    passwordHash,
    name,
    role: invite.role,
  });

  await db
    .update(adminInvites)
    .set({ usedAt: new Date(), usedBy: adminUserId })
    .where(eq(adminInvites.id, invite.id));

  await createAdminSession(adminUserId, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: ip,
  });

  await audit({
    actorType: "admin",
    actorId: adminUserId,
    action: "admin.signup",
    metadata: { inviteId: invite.id, role: invite.role },
    ipAddress: ip,
  });

  return NextResponse.json({
    ok: true,
    user: { id: adminUserId, email, name, role: invite.role },
  });
}