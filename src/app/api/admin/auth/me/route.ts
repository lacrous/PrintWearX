/**
 * GET /api/admin/auth/me
 */

import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth/admin-cookies";

export async function GET() {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}