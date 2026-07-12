"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/nav";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  BarChart3,
  Settings,
  FileText,
  Megaphone,
  Package,
  Star,
  RotateCcw,
  Layers,
  Activity,
  Plug,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  LogOut,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "Overview" },
  { href: "/admin/audit-log", label: "Audit log", icon: Activity, group: "Overview" },
  { href: "/admin/orders", label: "Orders", icon: Receipt, group: "Sales", badge: 4 },
  { href: "/admin/refunds", label: "Refunds", icon: RotateCcw, group: "Sales", badge: 1 },
  { href: "/admin/products", label: "Products", icon: ShoppingBag, group: "Catalog" },
  { href: "/admin/inventory", label: "Inventory", icon: Package, group: "Catalog", badge: 4 },
  { href: "/admin/collections", label: "Collections", icon: Layers, group: "Catalog" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, group: "Catalog", badge: 2 },
  { href: "/admin/customers", label: "Customers", icon: Users, group: "Audience" },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone, group: "Marketing" },
  { href: "/admin/content", label: "Content", icon: FileText, group: "Storefront" },
  { href: "/admin/integrations", label: "Integrations", icon: Plug, group: "Account" },
  { href: "/admin/settings", label: "Settings", icon: Settings, group: "Account" },
];

const STORAGE_KEY = "pwx_admin_sidebar_collapsed_v1";

/**
 * Hook: shared collapsed state across the shell + the sidebar.
 * The state is hydrated from localStorage and persisted on change.
 */
export function useSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setCollapsedState(true);
    } catch {}
  }, []);

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {}
  };

  const toggle = () => setCollapsed(!collapsed);

  return { collapsed, setCollapsed, toggle };
}

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
  onOpenCmd?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  pathname,
  collapsed,
  onToggle,
  onOpenCmd,
  onClose,
  isMobile = false,
}: SidebarProps) {
  // On mobile, always render expanded (we control width via the wrapper)
  const showCollapsed = !isMobile && collapsed;
  const grouped = groupNav();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Brand + collapse */}
      <div
        className={cn(
          "border-b border-neutral-200 dark:border-neutral-800 flex items-center shrink-0",
          showCollapsed ? "px-2 py-5 flex-col gap-3" : "px-5 py-5 justify-between gap-2"
        )}
      >
        <Link
          href="/admin"
          className="flex items-center gap-2.5 group min-w-0"
          title={showCollapsed ? "PrintWearX" : undefined}
        >
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          {!showCollapsed && (
            <div className="leading-tight min-w-0">
              <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                PrintWearX
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-success" />
                Admin console
              </div>
            </div>
          )}
        </Link>
        {onClose && !showCollapsed && (
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 min-w-[44px] rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {/* Desktop-only collapse toggle */}
        {!isMobile && !onClose && (
          <button
            onClick={onToggle}
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors",
              showCollapsed && "self-center"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand (Ctrl+B)" : "Collapse (Ctrl+B)"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* User card (mobile only, only when expanded) */}
      {isMobile && !showCollapsed && (
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/10 to-purple-500/5 border border-primary-200/30 dark:border-primary-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                HE
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                  Hassan El-Deghidy
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-primary-600 dark:text-primary-400">
                  Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search trigger */}
      {!showCollapsed && (
        <div className="px-3 pt-3">
          <button
            onClick={onOpenCmd}
            className="w-full inline-flex items-center gap-2 h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors group"
            title="Search anything (⌘K)"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Search anything</span>
            <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-white dark:bg-neutral-900 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Collapsed-mode: show a small search icon button instead */}
      {showCollapsed && (
        <div className="px-2 pt-3">
          <button
            onClick={onOpenCmd}
            className="w-full inline-flex items-center justify-center h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto space-y-6",
          showCollapsed ? "px-2 py-4" : "px-3 py-4"
        )}
        aria-label="Admin navigation"
      >
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            {!showCollapsed && (
              <div className="px-2 mb-2 text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center justify-between">
                <span>{group}</span>
                <span className="text-neutral-300 dark:text-neutral-600">
                  {items.length}
                </span>
              </div>
            )}
            <ul className="space-y-0.5">
              {items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  collapsed={showCollapsed}
                  onClick={onClose}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-neutral-200 dark:border-neutral-800 space-y-1",
          showCollapsed ? "px-2 py-3" : "px-3 py-3"
        )}
      >
        <FooterLink
          href="/"
          icon={Store}
          label="View storefront"
          collapsed={showCollapsed}
        />
        <button
          onClick={() => {
            import("@/lib/auth-client").then(({ clearAdminSession }) => {
              clearAdminSession();
              window.location.href = "/admin/login";
            });
          }}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg text-sm font-semibold text-error hover:bg-error/10 transition-colors",
            showCollapsed
              ? "h-10 px-0 justify-center"
              : "h-9 px-3"
          )}
          title={showCollapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!showCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}

function groupNav() {
  return NAV.reduce<Record<string, typeof NAV>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? [];
    acc[item.group].push(item);
    return acc;
  }, {});
}

function NavItem({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: typeof NAV[number];
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        aria-label={collapsed ? item.label : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex items-center rounded-lg text-sm font-medium transition-colors min-h-[36px]",
          collapsed ? "h-10 justify-center" : "h-9 px-3 gap-3",
          active
            ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        )}
      >
        {active && !collapsed && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary-500" />
        )}
        <Icon
          className={cn(
            "shrink-0 transition-transform",
            collapsed ? "w-5 h-5" : "w-4 h-4",
            active && "text-primary-500"
          )}
        />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full",
                  active
                    ? "bg-primary-500 text-white"
                    : "bg-error text-white"
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
        {collapsed && item.badge && (
          <span
            className={cn(
              "absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[9px] font-bold",
              active ? "bg-primary-500 text-white" : "bg-error text-white"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}

function FooterLink({
  href,
  icon: Icon,
  label,
  collapsed,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
        collapsed ? "h-10 justify-center" : "h-9 px-3"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="opacity-50"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </Link>
  );
}
