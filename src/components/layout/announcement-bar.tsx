"use client";
import { useEffect, useState } from "react";
import { Truck, X, Sparkles, Shield, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  {
    icon: Truck,
    text: "Free shipping on orders over $50",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: RotateCcw,
    text: "30-day hassle-free returns",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Shield,
    text: "Secure checkout · Powered by Stripe",
    accent: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Sparkles,
    text: "New drops every Friday — limited runs",
    accent: "text-amber-600 dark:text-amber-400",
  },
];

const STORAGE_KEY = "pwx_ann_dismissed_v1";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(true); // SSR-safe default = hidden

  useEffect(() => {
    // Hydrate: was it dismissed?
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    setDismissed(wasDismissed);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(t);
  }, [dismissed]);

  if (dismissed) return null;

  const Current = MESSAGES[index];

  return (
    <div
      role="region"
      aria-label="Site announcements"
      className="relative bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden"
    >
      {/* subtle moving gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-primary-500/20 blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[36px] sm:min-h-[40px] py-1.5">
          <div
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
            aria-live="polite"
          >
            <Current.icon
              className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0", Current.accent)}
            />
            <span className="truncate">{Current.text}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
