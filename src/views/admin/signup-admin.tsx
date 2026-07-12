"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/nav";
import {
  Mail,
  Lock,
  User,
  Key,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  signupAdmin,
  getAdminSession,
  type AuthState,
} from "@/lib/auth-client";

export function SignupAdminView() {
  const router = useRouter();

  // Already-signed-in check
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    if (getAdminSession()) {
      router.replace("/admin");
    }
  }, [router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const result: AuthState = await signupAdmin(
      { status: "idle" },
      new FormData(formRef.current!)
    );
    setLoading(false);
    if (result.status === "success" && result.redirectTo) {
      router.replace(result.redirectTo);
    } else {
      setError(result.message ?? "Sign-up failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-neutral-950">
      {/* Left side — same branding */}
      <aside className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,122,255,0.18),transparent_60%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl" />

        <div className="relative">
          <a href="/admin/login" className="inline-flex items-center gap-2.5 group">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-6">
            <Sparkles className="w-3 h-3" />
            Invite-only
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join the team.
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-8">
            Admin accounts are created by invitation only. If you've been
            given an invite code by an existing admin, you can set up your
            account here.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              "Owner — full access including billing and team management",
              "Admin — manage products, orders, customers, and content",
              "Editor — manage content and marketing campaigns only",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-neutral-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-neutral-500">
          &copy; 2026 Nurovia · PrintWearX v2.1.0
        </div>
      </aside>

      {/* Right side — signup form */}
      <main className="flex flex-col p-6 sm:p-8 lg:p-12">
        <header className="lg:hidden flex items-center justify-between mb-8">
          <a href="/admin/login" className="inline-flex items-center gap-2">
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
            href="/admin/login"
            className="text-xs text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Sign in
          </a>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                Create admin account
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You need an invite code from an existing admin.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm"
            >
              <div>
                <label
                  htmlFor="admin-name"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-1.5"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    autoComplete="name"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-signup-email"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-1.5"
                >
                  Work email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-signup-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@printwearx.com"
                    autoComplete="email"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-signup-password"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-1.5"
                >
                  Password
                  <span className="ml-1 text-[10px] font-normal text-neutral-500">
                    (8+ characters)
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-signup-password"
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    minLength={8}
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

              <div>
                <label
                  htmlFor="admin-invite"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-1.5"
                >
                  Invite code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-invite"
                    type="text"
                    name="inviteCode"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="PWX-STAFF-2026"
                    autoComplete="off"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-mono uppercase tracking-wider"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  Demo codes: <code className="font-mono">PWX-STAFF-2026</code>,{" "}
                  <code className="font-mono">PWX-EDITOR-2026</code>,{" "}
                  <code className="font-mono">PWX-OWNER-2026</code>
                </p>
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
                    Creating account…
                  </>
                ) : (
                  <>
                    Create admin account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
              <p>
                Already have an account?{" "}
                <a
                  href="/admin/login"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Sign in →
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