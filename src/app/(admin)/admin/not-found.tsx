import Link from "next/link";
import { ArrowLeft, Search, FileQuestion } from "lucide-react";

/**
 * Admin 404 — shown when a user navigates to an admin route that
 * doesn't exist (e.g. /admin/products/999/edit for a deleted product).
 *
 * This file takes precedence over app/not-found.tsx for any URL
 * starting with /admin/. Next.js's App Router uses the closest
 * not-found.tsx in the route tree.
 *
 * Renders BARE (no admin shell) because the shell depends on the
 * page being valid. Showing the admin shell around a not-found
 * state would be confusing.
 */
export default function AdminNotFound() {
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