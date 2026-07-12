"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "@/lib/nav";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { loginAdmin, getAdminSession, type AuthState } from "@/lib/auth-client";

export function LoginAdminView() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next") || "/admin";

  // Already-signed-in check — bounce to /admin immediately
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    if (getAdminSession()) {
      router.replace(nextPath);
    }
  }, [router, nextPath]);

  const [email, setEmail] = useState("admin@printwearx.com");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const result: AuthState = await loginAdmin(
      { status: "idle" },
      new FormData(formRef.current!)
    );
    setLoading(false);
    if (result.status === "success" && result.redirectTo) {
      router.replace(result.redirectTo);
    } else {
      setError(result.message ?? "Sign-in failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-neutral-950">
      {/* Left side — branding (desktop only) */}
      <aside className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,122,255,0.2),transparent_60%)]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-700/15 blur-3xl" />

        <div className="relative">
          <a
            href="/"
            className="inline-flex items-center gap-2.5 group"
            aria-label="PrintWearX home"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PrintWearX</span>
            <span className="ml-1 text-[10px] uppercase tracking-wider font-bold text-primary-300 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded">
              Admin
            </span>
          </a>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Manage your store from one place.
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-8">
            Orders, inventory, customers, content, marketing — everything
            you need to run PrintWearX, in one dashboard.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              "Live revenue and conversion tracking",
              "Inventory alerts and supplier workflows",
              "Built-in CMS for banners and collections",
              "24/7 priority support for admins",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-neutral-500">
          &copy; 2026 Nurovia · PrintWearX v2.1.0
        </div>
      </aside>

      {/* Right side — sign-in form */}
      <main className="flex flex-col p-6 sm:p-8 lg:p-12">
        {/* Mobile-only brand bar */}
        <header className="lg:hidden flex items-center justify-between mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              PrintWearX
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary-600 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded">
              Admin
            </span>
          </a>
          <a
            href="/"
            className="text-xs text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Store
          </a>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Hidden heading for SSR — replaced after hydration */}
            <div className="mb-6 text-center">
              {!hydrated ? (
                <>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                    Admin sign-in
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Sign in to manage the store.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                    Welcome back
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Sign in to continue to the dashboard.
                  </p>
                </>
              )}
            </div>

            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-1.5"
                >
                  Work email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@printwearx.com"
                    autoComplete="email"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-sm font-semibold text-neutral-900 dark:text-white"
                  >
                    Password
                  </label>
                  <a
                    href="/admin/forgot-password"
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 inline-flex items-center justify-center"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                  Demo admin
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@printwearx.com");
                    setPassword("admin123");
                  }}
                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                >
                  <code className="text-neutral-900 dark:text-white font-mono text-[11px]">
                    admin@printwearx.com
                  </code>
                  <code className="text-neutral-500 font-mono text-[11px]">
                    admin123
                  </code>
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
                    Owner
                  </span>
                </button>
                <p className="text-[10px] text-neutral-500 pt-1">
                  Tip: any email starting with <code className="font-mono">admin</code> + 6+ char password also works.
                </p>
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
              <p>
                Have an invite code?{" "}
                <a
                  href="/admin/signup"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Create admin account →
                </a>
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-1.5 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to PrintWearX store
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}