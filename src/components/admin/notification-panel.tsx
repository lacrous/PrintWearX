"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/nav";
import {
  Bell,
  Package,
  Star,
  AlertTriangle,
  DollarSign,
  User,
  Check,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  kind: "order" | "stock" | "review" | "alert" | "customer" | "system";
  title: string;
  description: string;
  time: string;
  read?: boolean;
  href?: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    kind: "order",
    title: "New order #PWX-100248",
    description: "Olivia Chen · $77.76 · 2 items",
    time: "2 min ago",
    href: "/admin/orders/PWX-100248",
  },
  {
    id: "2",
    kind: "stock",
    title: "Cat Tote low on stock",
    description: "Only 4 units left — restock recommended",
    time: "18 min ago",
    href: "/admin/inventory",
  },
  {
    id: "3",
    kind: "review",
    title: "New 5-star review",
    description: "On Sunset Wave Tee — “Best shirt I own.”",
    time: "1 hour ago",
    href: "/admin/reviews",
  },
  {
    id: "4",
    kind: "alert",
    title: "Refund request",
    description: "Liam O'Connor requested a refund for #PWX-100245",
    time: "3 hours ago",
    href: "/admin/refunds",
  },
  {
    id: "5",
    kind: "customer",
    title: "New VIP customer",
    description: "Marcus Patel reached $1,200 in LTV",
    time: "Yesterday",
    href: "/admin/customers",
  },
  {
    id: "6",
    kind: "system",
    title: "Weekly report ready",
    description: "Revenue $73,030 · +19.0% vs last period",
    time: "Yesterday",
    href: "/admin/analytics",
  },
];

const ICON_MAP: Record<Notification["kind"], React.ElementType> = {
  order: Package,
  stock: AlertTriangle,
  review: Star,
  alert: AlertTriangle,
  customer: User,
  system: DollarSign,
};

const COLOR_MAP: Record<Notification["kind"], string> = {
  order: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  stock: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  review: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  alert: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  customer: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  system: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => !n.read).length;

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

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold ring-2 ring-white dark:ring-neutral-900">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-[min(380px,92vw)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden notif-pop-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <Link
                href="/admin/settings"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Notification settings"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-10 text-center text-sm text-neutral-500">
                No notifications
              </div>
            ) : (
              <ul>
                {items.map((n) => {
                  const Icon = ICON_MAP[n.kind];
                  const inner = (
                    <>
                      <div
                        className={cn(
                          "shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl",
                          COLOR_MAP[n.kind]
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {n.description}
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-wider font-semibold">
                          {n.time}
                        </p>
                      </div>
                    </>
                  );
                  const className = cn(
                    "flex items-start gap-3 p-3 border-b border-neutral-100 dark:border-neutral-800/50 last:border-b-0 transition-colors",
                    n.href && "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer",
                    !n.read && "bg-primary-50/40 dark:bg-primary-500/5"
                  );
                  return (
                    <li key={n.id}>
                      {n.href ? (
                        <Link
                          href={n.href}
                          onClick={() => setOpen(false)}
                          className={className}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className={className}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <Link
              href="/admin/audit-log"
              onClick={() => setOpen(false)}
              className="block text-center h-9 leading-9 rounded-lg text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            >
              View all activity →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
