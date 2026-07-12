"use client";
import { Link } from "@/lib/nav";
import { Sparkles, Star, ShieldCheck, Truck, RotateCcw, Zap } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";

export function LoginPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white dark:bg-neutral-950">
      {/* Animated background — visible everywhere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-primary-500/10" />
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-primary-500/10 dark:bg-primary-500/15 blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -right-40 w-[35rem] h-[35rem] rounded-full bg-pink-500/10 dark:bg-primary-700/10 blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-[25rem] h-[25rem] rounded-full bg-yellow-400/10 dark:bg-primary-500/5 blur-3xl animate-float"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div className="relative grid lg:grid-cols-2 min-h-screen">
        {/* Left brand panel — desktop only */}
        <aside className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 text-white p-12 flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_50%)]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
          <div
            className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-primary-300/20 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span>PrintWearX</span>
            </Link>
          </div>

          <div className="relative space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
              Your next favorite thing
              <br />
              is one click away.
            </h2>
            <p className="text-white/85 text-lg max-w-md leading-relaxed">
              Sign in to track orders, save favorites, and unlock member-only
              deals.
            </p>

            <div className="flex items-center gap-1 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              ))}
              <span className="ml-2 text-sm text-white/85">
                4.9 from 12k reviews
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                { Icon: Truck, label: "Free shipping" },
                { Icon: ShieldCheck, label: "Secure checkout" },
                { Icon: RotateCcw, label: "30-day returns" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative element */}
          <div className="relative flex items-center gap-2 text-xs text-white/60">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Signed-in members save 15% on average</span>
          </div>
        </aside>

        {/* Right side — auth card */}
        <section className="flex items-center justify-center px-6 sm:px-10 py-14 pb-24 lg:pb-14">
          <AuthCard mode="login" />
        </section>
      </div>
    </main>
  );
}
