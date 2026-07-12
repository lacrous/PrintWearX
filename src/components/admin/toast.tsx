"use client";

/**
 * Tiny toast notification system. Zero deps, listens for a custom DOM event
 * `pwx:toast` so any client component can call:
 *
 *   window.dispatchEvent(new CustomEvent("pwx:toast", {
 *     detail: { kind: "success", message: "Saved" }
 *   }));
 */

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  description?: string;
}

let id = 0;
let push: ((t: Omit<Toast, "id">) => void) | null = null;

export function toast(t: Omit<Toast, "id">) {
  if (push) push(t);
  else if (typeof window !== "undefined") {
    // Fallback before mount
    window.dispatchEvent(new CustomEvent("pwx:toast", { detail: t }));
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("pwx:toast", ((e: CustomEvent<Omit<Toast, "id">>) => {
    if (push) push(e.detail);
  }) as EventListener);
}

const ICONS: Record<ToastKind, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const COLORS: Record<ToastKind, string> = {
  success: "bg-success/10 text-success border-success/20",
  error: "bg-error/10 text-error border-error/20",
  info: "bg-info/10 text-info border-info/20",
};

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    push = (t) => {
      const next = { id: ++id, ...t };
      setToasts((cur) => [...cur, next]);
      setTimeout(() => {
        setToasts((cur) => cur.filter((x) => x.id !== next.id));
      }, 3500);
    };
    return () => {
      push = null;
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.kind];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3 rounded-2xl border shadow-lg",
              "bg-white dark:bg-neutral-900 toast-in",
              COLORS[t.kind]
            )}
            role="status"
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                {t.message}
              </div>
              {t.description && (
                <div className="text-xs text-neutral-500 mt-0.5">
                  {t.description}
                </div>
              )}
            </div>
            <button
              onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}