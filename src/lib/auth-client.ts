"use client";

/**
 * Client-side auth helpers.
 *
 * Two surfaces:
 *   1. `authClient` — modern async API, calls /api/auth/* endpoints.
 *      Use this in new code.
 *   2. Legacy exports — sync-ish wrappers for existing components.
 *      These cache the session in memory + call /api/auth/me on demand.
 *
 * Sessions are held in HTTP-only cookies set by the server. JS only
 * sees user metadata, never the session token.
 */

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "vip" | "owner" | "editor" | "support" | "viewer";
};

export type AuthState = {
  status?: "idle" | "error" | "success";
  user?: SessionUser | null;
  loading?: boolean;
  error?: string | null;
  message?: string;
  redirectTo?: string;
};

async function request<T>(
  url: string,
  body?: unknown,
  method: "GET" | "POST" = "POST"
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, {
      method: body || method === "POST" ? "POST" : method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: json.error ?? `HTTP ${res.status}` };
    }
    return { ok: true, data: json as T };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Network error" };
  }
}

// ============================================================
// Modern API
// ============================================================

export const authClient = {
  // Storefront
  signup(input: { email: string; password: string; name: string; marketingOptIn?: boolean }) {
    return request<{ ok: true; userId: string }>("/api/auth/signup", input);
  },
  login(input: { email: string; password: string; remember?: boolean }) {
    return request<{ ok: true; user: SessionUser }>("/api/auth/login", input);
  },
  logout() {
    return request<{ ok: true }>("/api/auth/logout");
  },
  async me() {
    const res = await request<{ user: SessionUser }>("/api/auth/me", undefined, "GET");
    if (!res.ok) return { user: null as SessionUser | null };
    return { user: res.data.user };
  },
  forgotPassword(email: string) {
    return request<{ ok: true }>("/api/auth/forgot-password", { email });
  },
  resetPassword(token: string, password: string) {
    return request<{ ok: true }>("/api/auth/reset-password", { token, password });
  },

  // Admin
  adminLogin(input: { email: string; password: string; remember?: boolean }) {
    return request<{ ok: true; user: SessionUser }>("/api/admin/auth/login", input);
  },
  adminSignup(input: { email: string; password: string; name: string; inviteCode: string }) {
    return request<{ ok: true; user: SessionUser }>("/api/admin/auth/signup", input);
  },
  adminLogout() {
    return request<{ ok: true }>("/api/admin/auth/logout");
  },
  async adminMe() {
    const res = await request<{ user: SessionUser }>("/api/admin/auth/me", undefined, "GET");
    if (!res.ok) return { user: null as SessionUser | null };
    return { user: res.data.user };
  },
};

// ============================================================
// Backwards-compatible wrappers for existing code
// ============================================================

const SESSION_KEY = "printwearx_session_user";
const ADMIN_SESSION_KEY = "printwearx_admin_session_user";
const ADMIN_FLAG_KEY = "printwearx_admin";

/** Cache helpers (session metadata in localStorage, token stays in HTTP-only cookie) */
function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------- Storefront session (legacy) ----------

export function getSession(): SessionUser | null {
  return readCache<SessionUser>(SESSION_KEY);
}

export function setSession(user: SessionUser) {
  writeCache(SESSION_KEY, user);
}

export function clearSession() {
  writeCache(SESSION_KEY, null);
}

/**
 * Login action for useActionState (form submissions).
 * Returns an AuthState object the form can use to show errors / redirect.
 */
export async function loginClient(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  const res = await authClient.login({ email, password, remember });
  if (res.ok) {
    setSession(res.data.user);
    return {
      status: "success",
      user: res.data.user,
      redirectTo: "/",
    };
  }
  return { status: "error", error: res.error };
}

/**
 * Signup action for useActionState.
 */
export async function signupClient(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");
  const marketingOptIn = formData.get("marketingOptIn") === "on";

  if (!name) return { status: "error", error: "Name is required" };

  const res = await authClient.signup({ email, password, name, marketingOptIn });
  if (res.ok) {
    const me = await authClient.me();
    if (me.user) setSession(me.user);
    return { status: "success", redirectTo: "/" };
  }
  return { status: "error", error: res.error };
}

export async function logoutClient() {
  await authClient.logout();
  clearSession();
  return { ok: true as const };
}

export async function requestPasswordReset(email: string) {
  const res = await authClient.forgotPassword(email);
  return { ok: res.ok, error: res.ok ? undefined : res.error };
}

// ---------- Admin session (legacy) ----------

export function getAdminSession(): SessionUser | null {
  return readCache<SessionUser>(ADMIN_SESSION_KEY);
}

export function setAdminSession(user: SessionUser) {
  writeCache(ADMIN_SESSION_KEY, user);
  writeCache(ADMIN_FLAG_KEY, "1");
}

export function clearAdminSession() {
  writeCache(ADMIN_SESSION_KEY, null);
  writeCache(ADMIN_FLAG_KEY, null);
}

export async function loginAdmin(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  const res = await authClient.adminLogin({ email, password, remember });
  if (res.ok) {
    setAdminSession(res.data.user);
    return { status: "success", redirectTo: "/admin" };
  }
  return { status: "error", message: res.error };
}

export async function signupAdmin(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "");

  const res = await authClient.adminSignup({ email, password, name, inviteCode });
  if (res.ok) {
    setAdminSession(res.data.user);
    return { status: "success", redirectTo: "/admin" };
  }
  return { status: "error", message: res.error };
}

export async function adminLogout() {
  await authClient.adminLogout();
  clearAdminSession();
  return { ok: true as const };
}

export async function requestAdminPasswordReset(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const res = await authClient.forgotPassword(email);
  return {
    status: res.ok ? "success" : "error",
    message: res.ok ? "Check your email for a reset link" : res.error,
  };
}

// ============================================================
// Password strength (UI feedback)
// ============================================================

export function passwordStrength(p: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score > 4) score = 4;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"] as const;
  return {
    score: score as 0 | 1 | 2 | 3 | 4,
    label: labels[score as 0 | 1 | 2 | 3 | 4],
    color: colors[score as 0 | 1 | 2 | 3 | 4],
  };
}

// Legacy alias for the old name
export const passwordScore = passwordStrength;