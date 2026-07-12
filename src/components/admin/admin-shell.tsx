"use client";

import { useState, useEffect } from "react";
import { Link } from "@/lib/nav";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Plus, ShoppingBag, Tag, Megaphone, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";
import { NotificationPanel } from "./notification-panel";
import { UserMenu } from "./user-menu";
import { Sidebar, useSidebarCollapsed } from "./sidebar";

/**
 * Paths inside /admin that are PUBLIC (no dashboard chrome).
 * Auth pages should render bare — no sidebar, no topbar, no shell.
 */
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
];

function isPublicAdminPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// Helper to open the command palette by dispatching a synthetic ⌘K
function openCommandPalette() {
  const ev = new KeyboardEvent("keydown", {
    key: "k",
    metaKey: true,
    bubbles: true,
  });
  window.dispatchEvent(ev);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { collapsed, toggle, setCollapsed } = useSidebarCollapsed();

  // Close drawer on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Ctrl/Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "b" &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // Don't fire while typing in an input
        const t = e.target as HTMLElement | null;
        if (
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  // Auto-expand on mobile (sidebar is a drawer there, not collapsible)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!e.matches) setCollapsed(false);
    };
    onChange(mql);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [setCollapsed]);

  // Auth pages (login, signup, forgot-password) render bare —
  // no sidebar, no topbar, no shell chrome.
  if (isPublicAdminPath(pathname)) {
    return (
      <>
        {children}
        <CommandPalette />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile top bar — shows current page title */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link
          href="/admin"
          className="flex-1 min-w-0 flex items-center justify-center gap-2"
        >
          <span className="font-bold text-sm truncate">
            {getCurrentPageTitle(pathname).title}
          </span>
        </Link>
        <button
          onClick={openCommandPalette}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Open command palette"
        >
          <Search className="w-5 h-5" />
        </button>
        <div className="lg:hidden">
          <NotificationPanel />
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar — collapsible */}
        <aside
          className={cn(
            "hidden lg:flex lg:flex-col fixed inset-y-0 left-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-30 transition-[width] duration-200 ease-out",
            collapsed ? "w-[72px]" : "w-64"
          )}
        >
          <Sidebar
            pathname={pathname}
            collapsed={collapsed}
            onToggle={toggle}
            onOpenCmd={openCommandPalette}
          />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 26, stiffness: 240 }}
                className="lg:hidden fixed inset-y-0 left-0 w-80 max-w-[88vw] bg-white dark:bg-neutral-900 z-50 shadow-2xl flex flex-col"
              >
                <Sidebar
                  pathname={pathname}
                  collapsed={false}
                  onToggle={toggle}
                  onOpenCmd={openCommandPalette}
                  onClose={() => setOpen(false)}
                  isMobile
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <main
          className={cn(
            "flex-1 min-w-0 min-h-screen overflow-x-hidden transition-[padding] duration-200 ease-out",
            collapsed ? "lg:pl-[72px]" : "lg:pl-64"
          )}
        >
          <TopBar onOpenCmd={openCommandPalette} />
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

function TopBar({ onOpenCmd }: { onOpenCmd: () => void }) {
  const pathname = usePathname();
  const page = getCurrentPageTitle(pathname);

  return (
    <header className="hidden lg:flex sticky top-0 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 h-16 px-6 xl:px-8 items-center gap-4">
      {/* Page title + breadcrumbs */}
      <div className="flex flex-col leading-tight min-w-0">
        {page.group && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">
            {page.group}
          </span>
        )}
        <span className="text-base font-semibold text-neutral-900 dark:text-white truncate">
          {page.title}
        </span>
      </div>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="hidden xl:flex items-center gap-1 text-xs text-neutral-500"
      >
        {page.trail.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3 opacity-50" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-700 dark:text-neutral-300">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search trigger (opens command palette) */}
      <button
        onClick={onOpenCmd}
        className="w-72 inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm text-neutral-500 transition-colors group"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Search orders, products…</span>
        <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-white dark:bg-neutral-900 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5">
        {/* Quick create */}
        <div className="relative group">
          <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/30">
            <Plus className="w-4 h-4" />
            <span className="hidden xl:inline">Create</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-56 origin-top-right rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 p-1.5">
            <a href="/admin/products/new" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <ShoppingBag className="w-4 h-4 text-primary-500" /> New product
            </a>
            <a href="/admin/campaigns/new" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Megaphone className="w-4 h-4 text-primary-500" /> New campaign
            </a>
            <a href="/admin/discounts/new" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Tag className="w-4 h-4 text-primary-500" /> New discount
            </a>
            <a href="/admin/content/new" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <FileText className="w-4 h-4 text-primary-500" /> New content
            </a>
          </div>
        </div>

        <NotificationPanel />

        <UserMenu />
      </div>
    </header>
  );
}

function getCurrentPageTitle(pathname: string | null): {
  title: string;
  group: string;
  trail: Array<{ label: string; href?: string }>;
} {
  // Use the canonical NAV list from sidebar.tsx
  // Importing would create circular deps, so we duplicate the minimal shape.
  // Fallback to "Admin" if pathname is empty.
  type NavItem = { href: string; label: string; group: string };
  const NAV: NavItem[] = [
    { href: "/admin", label: "Dashboard", group: "Overview" },
    { href: "/admin/analytics", label: "Analytics", group: "Overview" },
    { href: "/admin/audit-log", label: "Audit log", group: "Overview" },
    { href: "/admin/orders", label: "Orders", group: "Sales" },
    { href: "/admin/refunds", label: "Refunds", group: "Sales" },
    { href: "/admin/products", label: "Products", group: "Catalog" },
    { href: "/admin/inventory", label: "Inventory", group: "Catalog" },
    { href: "/admin/collections", label: "Collections", group: "Catalog" },
    { href: "/admin/reviews", label: "Reviews", group: "Catalog" },
    { href: "/admin/customers", label: "Customers", group: "Audience" },
    { href: "/admin/marketing", label: "Marketing", group: "Marketing" },
    { href: "/admin/content", label: "Content", group: "Storefront" },
    { href: "/admin/integrations", label: "Integrations", group: "Account" },
    { href: "/admin/settings", label: "Settings", group: "Account" },
  ];

  if (!pathname) return { title: "Admin", group: "", trail: [{ label: "Admin" }] };

  // Match exact NAV entry
  const exact = NAV.find((n) => n.href === pathname);
  if (exact) {
    return {
      title: exact.label,
      group: exact.group,
      trail: [{ label: "Admin", href: "/admin" }, { label: exact.label }],
    };
  }

  // Match nested (e.g. /admin/products/new → "New product" under Products).
  // Filter out the dashboard root ("/admin") so it doesn't swallow every path.
  const parent = NAV
    .filter((n) => n.href !== "/admin")
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));
  if (parent) {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";
    const singular = parent.label.endsWith("s")
      ? parent.label.slice(0, -1).toLowerCase()
      : parent.label.toLowerCase();
    const niceTitle =
      lastSegment === "new"
        ? `New ${singular}`
        : lastSegment === "edit"
          ? `Edit ${singular}`
          : lastSegment.length >= 12 && /^[a-z0-9-]+$/i.test(lastSegment) && /[a-z]/.test(lastSegment) && /\d/.test(lastSegment)
            ? `${parent.label} · ${lastSegment.slice(0, 8)}`
            : lastSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: niceTitle,
      group: parent.group,
      trail: [
        { label: "Admin", href: "/admin" },
        { label: parent.label, href: parent.href },
        { label: niceTitle },
      ],
    };
  }

  // Fallback: prettify the path
  const last = pathname.split("/").filter(Boolean).pop() || "Admin";
  const title = last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title,
    group: "",
    trail: [
      { label: "Admin", href: "/admin" },
      { label: title },
    ],
  };
}
