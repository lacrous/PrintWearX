"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Search,
  FileQuestion,
  Home,
  ShoppingBag,
  ShieldAlert,
} from "lucide-react";

/**
 * Global not-found page.
 *
 * With `output: "export"`, Next.js renders this page to /404/index.html
 * for every host that serves that file on 404 responses.
 *
 * Detection runs SYNCHRONOUSLY on first render (no useEffect, no
 * flash of wrong content). We check:
 *
 *   1. window.location.pathname (URL preserved by host on 404)
 *   2. sessionStorage['pwx_last_path'] (clean-URL script remembered it)
 *   3. document.referrer (came from an admin page)
 *   4. localStorage['printwearx_admin'] === '1' (signed in as admin)
 *
 * If ANY of these say "admin context", we render the admin theme.
 * Otherwise storefront theme.
 *
 * On SSR the page defaults to storefront (we can't read browser state
 * on the server). Hydration swaps to the correct theme immediately.
 */
function detectAdminContext(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // 1. Current URL — most hosts preserve this on 404
    const p = window.location.pathname || "/";
    if (p.startsWith("/admin")) return true;

    // If we're on /404/, the host redirected — use fallbacks
    if (p === "/404" || p === "/404/") {
      // 2. sessionStorage — clean URL script saved the original path
      try {
        const saved = sessionStorage.getItem("pwx_last_path");
        if (saved && saved.startsWith("/admin")) return true;
      } catch {}

      // 3. document.referrer — where the user came from
      try {
        const ref = document.referrer || "";
        if (ref) {
          const refPath = new URL(ref).pathname;
          if (refPath.startsWith("/admin")) return true;
        }
      } catch {}
    }

    // 4. localStorage — if signed in as admin, must be admin context
    try {
      if (localStorage.getItem("printwearx_admin") === "1") return true;
    } catch {}
  } catch {
    // any error — fall through
  }
  return false;
}

export default function NotFound() {
  // Note: even though this runs on SSR (where window is undefined),
  // hydration swaps to the correct theme on first paint.
  const isAdmin = detectAdminContext();

  if (isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 mb-5">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Admin page not found
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
            The page you were looking for doesn&apos;t exist. It may have
            been deleted, renamed, or the link is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/30 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              Browse products
            </Link>
          </div>
          <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-500">
            Need help? Press{" "}
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono font-bold">
              ⌘K
            </kbd>{" "}
            to open the command palette.
          </p>
        </div>
      </main>
    );
  }

  // Storefront 404
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-6">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500 mb-5">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
          We couldn&apos;t find what you&apos;re looking for. It might have
          been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            Back home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse shop
          </Link>
        </div>
      </div>
    </main>
  );
}