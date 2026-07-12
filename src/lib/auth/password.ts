/**
 * Password hashing.
 *
 * Uses @node-rs/argon2 (Rust bindings, no native compilation needed,
 * 10x faster than the pure-JS argon2 package).
 *
 * Algorithm: Argon2id
 * - Memory cost: 64 MB (resistant to GPU/ASIC attacks)
 * - Time cost:   3 iterations
 * - Parallelism: 1 thread
 *
 * These settings are tuned for ~50ms hash time on a modern server.
 * Increase memory cost if your hardware can spare it.
 */

import { hash, verify } from "@node-rs/argon2";

const HASH_OPTS = {
  // Algorithm: Argon2id (constant 2 in @node-rs/argon2)
  algorithm: 2 as const,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(plaintext: string): Promise<string> {
  if (plaintext.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (plaintext.length > 1024) {
    // Prevent DoS via long-password hashing
    throw new Error("Password too long");
  }
  return hash(plaintext, HASH_OPTS);
}

export async function verifyPassword(
  plaintext: string,
  hashStr: string
): Promise<boolean> {
  try {
    return await verify(hashStr, plaintext);
  } catch {
    return false;
  }
}

/**
 * Strength score for client-side feedback (0..4).
 * Server should always re-validate before accepting.
 */
export function passwordStrength(p: string): 0 | 1 | 2 | 3 | 4 {
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}