"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/nav";
import {
  CheckCircle2,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  Store,
  Sparkles,
  LogOut,
  HelpCircle,
  Keyboard,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    setDark(isDark);
    try { localStorage.setItem("pwx_theme", isDark ? "dark" : "light"); } catch {}
  };

  const signOut = () => {
    import("@/lib/auth-client").then(({ clearAdminSession }) => {
      clearAdminSession();
      window.location.href = "/admin/login";
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 sm:gap-2.5 h-10 pl-1.5 pr-2 sm:pr-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-xs shadow-lg shadow-primary-500/20">
          HE
        </div>
        <div className="hidden xl:block leading-tight text-left">
          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
            Hassan E.
          </div>
          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-success" />
            Founder · Owner
          </div>
        </div>
        <ChevronDown
          className={cn(
            "hidden xl:block w-3.5 h-3.5 text-neutral-400 transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden notif-pop-in"
        >
          {/* Profile card */}
          <div className="relative p-4 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                HE
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                  Hassan El-Deghidy
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  hassan@nurovia.dev
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  Owner
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <MenuLink
              href="/admin/settings"
              icon={User}
              label="Your profile"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/admin/settings"
              icon={SettingsIcon}
              label="Workspace settings"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/"
              icon={Store}
              label="View storefront"
              description="See the public site as a customer"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/admin/support"
              icon={HelpCircle}
              label="Help & support"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="p-1.5 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[36px]"
            >
              <span className="flex items-center gap-2.5">
                {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {dark ? "Dark mode" : "Light mode"}
              </span>
              <span
                className={cn(
                  "inline-flex items-center w-8 h-5 rounded-full transition-colors",
                  dark ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700"
                )}
              >
                <span
                  className={cn(
                    "inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform",
                    dark ? "translate-x-3.5" : "translate-x-0.5"
                  )}
                />
              </span>
            </button>
            <button
              onClick={() => {
                const ev = new CustomEvent("pwx:open-cmd");
                window.dispatchEvent(ev);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[36px]"
            >
              <span className="flex items-center gap-2.5">
                <Keyboard className="w-4 h-4" />
                Keyboard shortcuts
              </span>
              <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                <span className="text-[8px]">⌘</span>K
              </kbd>
            </button>
          </div>

          <div className="p-1.5 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-error hover:bg-error/10 transition-colors min-h-[36px]"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  description,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[36px]"
    >
      <Icon className="w-4 h-4 mt-0.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-neutral-900 dark:text-white">
          {label}
        </div>
        {description && (
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {description}
          </div>
        )}
      </div>
    </Link>
  );
}
