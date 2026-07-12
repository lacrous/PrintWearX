"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/nav";
import {
  Mail,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  requestAdminPasswordReset,
  getAdminSession,
  type AuthState,
} from "@/lib/auth-client";

export function ForgotPasswordAdminView() {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    if (getAdminSession()) {
      router.replace("/admin");
    }
  }, [router]);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const result: AuthState = await requestAdminPasswordReset(
      { status: "idle" },
      new FormData(formRef.current!)
    );
    setLoading(false);
    if (result.status === "success") {
      setSent(true);
    } else {
      setError(result.message ?? "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <header className="flex items-center justify-between p-6 sm:p-8">
        <a href="/admin/login" className="inline-flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
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

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Reset your password
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              Enter the email address associated with your admin account.
              We'll send you a secure link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 text-success mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                If an admin account exists for{" "}
                <code className="font-mono font-semibold text-neutral-900 dark:text-white">
                  {email}
                </code>
                , a reset link has been sent. The link expires in 30 minutes.
              </p>
              <a
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-colors"
              >
                Back to sign-in
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm"
            >
              <div>
                <label
                  htmlFor="admin-reset-email"
                  className="block text-sm font-semibold text-neutral-900 dark:text-white mb-1.5"
                >
                  Work email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    id="admin-reset-email"
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
                    Sending…
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to sign-in
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}