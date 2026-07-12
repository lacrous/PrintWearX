/**
 * POST /api/admin/auth/logout
 */

import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/auth/admin-cookies";

export async function POST() {
  await destroyAdminSession();
  return NextResponse.json({ ok: true });
}