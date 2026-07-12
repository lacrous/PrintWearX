/**
 * Secure random tokens for sessions, password resets, and invite codes.
 *
 * Uses Web Crypto (works in Node 20+ and the Edge runtime).
 * Never use Math.random() for security-sensitive tokens.
 */

const TOKEN_BYTES = 32;

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

/** 64-char hex string. Used as the session ID (also the cookie value). */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/** 32-char human-readable code with dashes, e.g. "PWX-A7K2-9XQ3-M4N8". */
export function generateInviteCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L for clarity
  let raw = "";
  for (let i = 0; i < bytes.length; i++) {
    raw += chars[bytes[i] % chars.length];
  }
  return `PWX-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

/** SHA-256 hash for storing tokens at rest. */
export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(buf));
}