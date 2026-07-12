/**
 * Audit log for sensitive actions.
 *
 * Use this for any action that:
 *   - Touches user data (create/update/delete)
 *   - Changes auth state (login, password change, role change)
 *   - Has financial impact (orders, refunds)
 *   - Affects admin actions (content moderation, etc.)
 */

import { db } from "../db/client";
import { auditLog } from "../db/schema";
import { generateId } from "./id";

export async function audit(entry: {
  actorType: "admin" | "user" | "system";
  actorId?: string;
  action: string; // dot.notation: "user.login", "product.delete"
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await db.insert(auditLog).values({
      id: generateId(),
      actorType: entry.actorType,
      actorId: entry.actorId,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
    });
  } catch (err) {
    // Never let audit failures break the main flow
    console.error("[audit]", entry.action, err);
  }
}