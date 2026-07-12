"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/lib/nav";
import { Loader2, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth-client";

/**
 * Admin gate — runs in the admin layout.
 *
 * Flow:
 *   1. On first render (SSR + hydration): show a neutral loading state
 *      so we don't flash the sign-in UI for already-authenticated admins.
 *   2. After mount: check localStorage for an admin session.
 *   3. If signed in → render the children (the admin dashboard).
 *   4. If not signed in AND the path is a protected admin route
 *      → redirect to /admin/login?next=<current-path>.
 *   5. If not signed in AND the path is a public auth route
 *      (login / signup / forgot-password) → render children anyway
 *      so the auth pages can do their own thing.
 *
 * Public auth paths are whitelisted to prevent an infinite redirect loop.
 */
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
];

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "signed-in" }
    | { kind: "public" }
    | { kind: "redirecting" }
  >({ kind: "loading" });

  // Public auth paths render immediately, no loading state.
  // These pages handle their own session check.
  const isPublic = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  useEffect(() => {
    if (isPublic) {
      setState({ kind: "public" });
      return;
    }
    const session = getAdminSession();
    if (session) {
      setState({ kind: "signed-in" });
      return;
    }
    // Protected route, not signed in → redirect
    setState({ kind: "redirecting" });
    const next = encodeURIComponent(pathname || "/admin");
    router.replace(`/admin/login?next=${next}`);
  }, [pathname, router, isPublic]);

  // Public auth paths: render children immediately.
  // The auth pages themselves do their own session check on mount
  // (to bounce already-signed-in admins to /admin).
  if (isPublic) {
    return <>{children}</>;
  }

  // Loading / redirecting: show neutral spinner
  if (state.kind === "loading" || state.kind === "redirecting") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {state.kind === "redirecting"
            ? "Redirecting to sign-in…"
            : "Verifying admin session…"}
        </p>
      </div>
    );
  }

  // Signed in or public path — render children
  return <>{children}</>;
}

/**
 * Hook used by /admin/login to short-circuit the redirect when an admin
 * is already signed in. Returns null while checking, true/false after.
 */
export function useAdminSession(): boolean | null {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    setSignedIn(getAdminSession() !== null);
  }, []);
  return signedIn;
}

/** Small icon used by admin auth pages */
export function AdminShieldIcon({ className }: { className?: string }) {
  return (
    <div
      className={
        "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 " +
        (className ?? "")
      }
    >
      <ShieldCheck className="w-7 h-7" />
    </div>
  );
}