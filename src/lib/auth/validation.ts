/**
 * Input validation schemas for auth endpoints.
 *
 * Uses Zod for runtime validation + TS type inference.
 * One source of truth for what the API accepts.
 */

import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .max(128, "Password too long");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(80, "Name is too long");

// ---- Storefront ----

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  marketingOptIn: z.boolean().optional().default(false),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ---- Admin ----

export const adminSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  inviteCode: z
    .string()
    .trim()
    .min(8)
    .max(64)
    .regex(/^PWX-[A-Z0-9]{4}-[A-Z0-9]{4}$/, "Invalid invite code format"),
});
export type AdminSignupInput = z.infer<typeof adminSignupSchema>;

export const adminLoginSchema = loginSchema;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// ---- Helpers ----

export function parseFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { ok: true; data: T } | { ok: false; errors: Record<string, string> } {
  const raw: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key in raw) {
      const existing = raw[key];
      raw[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      raw[key] = value;
    }
  });
  // Coerce checkbox values (formData gives "on" or null)
  if ("marketingOptIn" in raw) raw.marketingOptIn = raw.marketingOptIn === "on";
  if ("remember" in raw) raw.remember = raw.remember === "on";

  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}