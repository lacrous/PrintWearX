"use client";

/**
 * Stripe client helpers (static-export-compatible)
 *
 * In a Node-runtime deployment, replace these with calls to the server
 * actions in `app/actions/payment.ts`:
 *
 *   import { createPaymentIntent } from "@/app/actions/payment";
 *   const intent = await createPaymentIntent(lines, "usd");
 *
 * For static export (this build), we expose a parallel client function that
 * performs the same job — mints a fake intent that gets handed to the
 * StripeElements provider. The Elements provider in demo mode short-circuits
 * to a styled fallback form, so the user flow is identical.
 */

export interface PaymentIntentResult {
  clientSecret: string;
  amount: number;
  currency: string;
  status: "demo" | "requires_payment_method" | "succeeded";
}

interface CartLine {
  productId: string;
  quantity: number;
  unitAmount: number; // cents
}

export async function createPaymentIntentClient(
  lines: CartLine[],
  currency: string = "usd"
): Promise<PaymentIntentResult> {
  // Demo mode — return a deterministic fake clientSecret.
  // Real Stripe path (Node runtime) would return the real PaymentIntent.
  const amount = lines.reduce(
    (acc, l) => acc + l.unitAmount * l.quantity,
    0
  );

  return {
    clientSecret: `demo_pi_${Math.random().toString(36).slice(2, 12)}`,
    amount,
    currency,
    status: "demo",
  };
}