"use client";
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* ignore — service worker optional */
      });
    }

    // Capture install prompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show after 30 seconds of use, don't be pushy
      setTimeout(() => setShow(true), 30_000);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {show && deferredPrompt && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 sm:max-w-sm z-50 pointer-events-auto pwa-install-anim"
          role="dialog"
          aria-label="Install PrintWearX app"
        >
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 sm:p-5 backdrop-blur-2xl">
            <button
              onClick={() => setShow(false)}
              aria-label="Dismiss"
              className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white text-sm mb-0.5">
                  Install PrintWearX
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">
                  Add to your home screen for instant access, offline browsing
                  and a faster checkout.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={install}
                className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setShow(false)}
                className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}