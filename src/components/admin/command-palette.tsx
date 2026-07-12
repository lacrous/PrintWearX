"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "@/lib/nav";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Activity,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Package,
  Layers,
  Star,
  Users,
  Megaphone,
  FileText,
  Plug,
  Settings,
  Plus,
  ArrowRight,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href?: string;
  icon: React.ElementType;
  group: string;
  shortcut?: string;
  keywords?: string[];
  action?: () => void;
}

const NAV_ITEMS: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard, group: "Navigate", keywords: ["home", "overview"] },
  { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3, group: "Navigate" },
  { id: "audit-log", label: "Audit log", href: "/admin/audit-log", icon: Activity, group: "Navigate" },
  { id: "orders", label: "Orders", href: "/admin/orders", icon: Receipt, group: "Navigate", keywords: ["sales", "purchases"] },
  { id: "refunds", label: "Refunds", href: "/admin/refunds", icon: RotateCcw, group: "Navigate" },
  { id: "products", label: "Products", href: "/admin/products", icon: ShoppingBag, group: "Navigate", keywords: ["catalog", "items"] },
  { id: "inventory", label: "Inventory", href: "/admin/inventory", icon: Package, group: "Navigate", keywords: ["stock"] },
  { id: "collections", label: "Collections", href: "/admin/collections", icon: Layers, group: "Navigate" },
  { id: "reviews", label: "Reviews", href: "/admin/reviews", icon: Star, group: "Navigate" },
  { id: "customers", label: "Customers", href: "/admin/customers", icon: Users, group: "Navigate", keywords: ["audience", "users"] },
  { id: "marketing", label: "Marketing", href: "/admin/marketing", icon: Megaphone, group: "Navigate" },
  { id: "content", label: "Content", href: "/admin/content", icon: FileText, group: "Navigate" },
  { id: "integrations", label: "Integrations", href: "/admin/integrations", icon: Plug, group: "Navigate" },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings, group: "Navigate" },
];

const CREATE_ITEMS: CommandItem[] = [
  { id: "new-product", label: "New product", href: "/admin/products/new", icon: ShoppingBag, group: "Create", shortcut: "P" },
  { id: "new-campaign", label: "New campaign", href: "/admin/campaigns/new", icon: Megaphone, group: "Create", shortcut: "C" },
  { id: "new-discount", label: "New discount", href: "/admin/discounts/new", icon: Sparkles, group: "Create", shortcut: "D" },
  { id: "new-content", label: "New content", href: "/admin/content/new", icon: FileText, group: "Create" },
];

const ACTION_ITEMS: CommandItem[] = [
  {
    id: "go-store",
    label: "Back to storefront",
    description: "View the public site as a customer",
    href: "/",
    icon: ArrowRight,
    group: "Actions",
    keywords: ["home", "public", "store"],
  },
  {
    id: "theme-toggle",
    label: "Toggle theme",
    description: "Switch between light and dark mode",
    icon: Sparkles,
    group: "Actions",
    keywords: ["dark", "light", "mode"],
    action: () => {
      const html = document.documentElement;
      const isDark = html.classList.toggle("dark");
      try { localStorage.setItem("pwx_theme", isDark ? "dark" : "light"); } catch {}
      window.dispatchEvent(new CustomEvent("pwx:toast", { detail: { kind: "success", message: isDark ? "Dark mode" : "Light mode" } }));
    },
  },
  {
    id: "sign-out",
    label: "Sign out",
    description: "End your admin session",
    href: "/admin/login",
    icon: Shield,
    group: "Actions",
    keywords: ["logout", "exit"],
    action: () => {
      import("@/lib/auth-client").then(({ clearAdminSession }) => {
        clearAdminSession();
        window.location.href = "/admin/login";
      });
    },
  },
];

const ALL_ITEMS = [...NAV_ITEMS, ...CREATE_ITEMS, ...ACTION_ITEMS];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter((item) => {
      if (item.label.toLowerCase().includes(q)) return true;
      if (item.description?.toLowerCase().includes(q)) return true;
      if (item.group.toLowerCase().includes(q)) return true;
      if (item.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query]);

  // Group results
  const groupedResults = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of results) {
      groups[item.group] = groups[item.group] ?? [];
      groups[item.group].push(item);
    }
    return groups;
  }, [results]);

  // Flatten for keyboard nav
  const flatResults = results;

  // Run selected item
  const runItem = (item: CommandItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
    setOpen(false);
  };

  // Keyboard nav
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatResults[activeIdx];
      if (item) runItem(item);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Reset active idx on query change
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm cmd-backdrop-in"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed left-1/2 top-[20vh] -translate-x-1/2 z-[101] w-[min(640px,92vw)] cmd-palette-in"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 sm:px-5 h-14 border-b border-neutral-200 dark:border-neutral-800">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search pages, actions, settings…"
              className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-neutral-400 text-neutral-900 dark:text-white"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-neutral-500">
                <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-xs">Try a different search term</p>
              </div>
            )}

            {Object.entries(groupedResults).map(([group, items]) => (
              <div key={group} className="mb-1 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                  {group}
                </div>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    // Find flat index for keyboard nav
                    const flatIdx = flatResults.indexOf(item);
                    const active = flatIdx === activeIdx;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => runItem(item)}
                          onMouseEnter={() => setActiveIdx(flatIdx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            active
                              ? "bg-primary-50 dark:bg-primary-500/10"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          )}
                        >
                          <div
                            className={cn(
                              "shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg",
                              active
                                ? "bg-primary-500 text-white"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "text-sm font-medium",
                                active
                                  ? "text-primary-700 dark:text-primary-300"
                                  : "text-neutral-900 dark:text-white"
                              )}
                            >
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-neutral-500 truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                          {item.shortcut ? (
                            <kbd className="inline-flex items-center text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                              {item.shortcut}
                            </kbd>
                          ) : active ? (
                            <CornerDownLeft className="w-3.5 h-3.5 text-primary-500" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-[11px] text-neutral-500">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                  <ArrowUp className="w-2.5 h-2.5" />
                  <ArrowDown className="w-2.5 h-2.5" />
                </kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                  <CornerDownLeft className="w-2.5 h-2.5" />
                </kbd>
                select
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                <span className="text-[8px]">⌘</span>K
              </kbd>
              to open
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
