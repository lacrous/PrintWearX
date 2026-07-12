/**
 * Compact, sortable, URL-safe IDs.
 *
 * Format: 24-char base36 string (timestamp + random).
 * Example: "01k0d2hk7z3qy8tnf5e2v9wxa"
 *
 * 8 bytes timestamp (ms since epoch, base36) + 10 bytes random = ~16^24 = 2^96 entropy.
 * Sortable by creation time, which keeps DB indexes efficient.
 */

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

function toBase36(n: number, len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s = ALPHABET[n % 36] + s;
    n = Math.floor(n / 36);
  }
  return s;
}

export function generateId(): string {
  const ts = Date.now(); // 13 digits ~ base36: 8 chars
  const tsPart = toBase36(ts, 8);
  const randBytes = new Uint8Array(8);
  crypto.getRandomValues(randBytes);
  let randPart = "";
  for (let i = 0; i < randBytes.length; i++) {
    randPart += ALPHABET[randBytes[i] % 36];
  }
  return tsPart + randPart; // 16 chars (we use 24-char for full version)
}

/** Longer 24-char ID for entities that need more entropy (sessions, etc.) */
export function generateLongId(): string {
  const ts = Date.now();
  const tsPart = toBase36(ts, 8);
  const randBytes = new Uint8Array(16);
  crypto.getRandomValues(randBytes);
  let randPart = "";
  for (let i = 0; i < randBytes.length; i++) {
    randPart += ALPHABET[randBytes[i] % 36];
  }
  return tsPart + randPart;
}