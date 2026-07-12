/**
 * GET /api/auth/me
 *
 * Returns the current user, or 401 if not signed in.
 * Used by client components to refresh the session on mount.
 */

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/cookies";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
}