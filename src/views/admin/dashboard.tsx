"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/nav";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Package,
  Eye,
  Calendar,
  Clock,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  getKpis,
  revenue30d,
  orders,
  products,
  inventoryAlerts,
  customers,
  topProducts30d,
} from "@/lib/admin-data";
import {
  RevenueAreaChart,
  Sparkline,
  DonutChart,
} from "@/components/admin/charts";
import { cn, formatCurrency } from "@/lib/utils";

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 5) return { text: "Up late", emoji: "🌙" };
  if (h < 12) return { text: "Good morning", emoji: "☀️" };
  if (h < 18) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌆" };
}

export function DashboardView() {
  const kpis = getKpis();
  const [greeting, setGreeting] = useState(getGreeting());
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // Update every minute so the date stays current
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const dateLabel = now
    ? now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const cards = [
    {
      label: "Revenue (30d)",
      value: formatCurrency(kpis.revenue),
      delta: kpis.revenueDelta,
      icon: DollarSign,
      sparkline: revenue30d.map((d) => d.revenue),
      color: "#007AFF",
    },
    {
      label: "Orders (30d)",
      value: kpis.orders.toLocaleString(),
      delta: kpis.ordersDelta,
      icon: ShoppingCart,
      sparkline: revenue30d.map((d) => d.orders),
      color: "#34C759",
    },
    {
      label: "Avg order value",
      value: formatCurrency(kpis.aov),
      delta: kpis.aovDelta,
      icon: TrendingUp,
      sparkline: revenue30d.map(
        (d) => d.revenue / Math.max(d.orders, 1)
      ),
      color: "#AF52DE",
    },
    {
      label: "Active customers",
      value: kpis.customers.toLocaleString(),
      delta: 12.4,
      icon: Users,
      sparkline: customers.map((c, i) => c.lifetimeValue + i * 100),
      color: "#FF9500",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            {greeting.text}, Hassan {greeting.emoji}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {dateLabel || "Loading…"} · Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>Last month</option>
          </select>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", {
              detail: { kind: "success", message: "Report exported", description: "Downloaded dashboard-2026-07.pdf" }
            }))}
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5"
          >
            Export
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          const up = c.delta >= 0;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ background: `${c.color}15`, color: c.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-semibold",
                    up ? "text-success" : "text-error"
                  )}
                >
                  {up ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(c.delta).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                {c.label}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tabular-nums mt-0.5">
                {c.value}
              </div>
              <div className="mt-3 -mb-1">
                <Sparkline values={c.sparkline} color={c.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Revenue
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Last 30 days · {formatCurrency(kpis.revenue)} total
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Revenue
              </span>
            </div>
          </div>
          <RevenueAreaChart data={revenue30d} height={240} />
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Low stock
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {inventoryAlerts.length} products need restock
              </p>
            </div>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <ul className="space-y-3">
            {inventoryAlerts.slice(0, 4).map((alert) => (
              <li key={alert.productId}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                      {alert.productName}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {alert.sku} · {alert.daysOfStock}d of stock
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-warning tabular-nums">
                      {alert.current}
                    </div>
                    <div className="text-[10px] text-neutral-500 uppercase">
                      units
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/inventory"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            View inventory
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Recent orders
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {orders.length} latest · live status
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-2.5 font-semibold">Order</th>
                  <th className="text-left px-4 sm:px-6 py-2.5 font-semibold">Customer</th>
                  <th className="text-left px-4 sm:px-6 py-2.5 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-right px-4 sm:px-6 py-2.5 font-semibold">Total</th>
                  <th className="text-right px-4 sm:px-6 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="font-mono font-semibold text-neutral-900 dark:text-white text-xs">
                        #{o.number}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="font-medium text-neutral-900 dark:text-white text-xs">
                        {o.customerName}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500">
                      {o.placedAt}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right font-semibold tabular-nums text-neutral-900 dark:text-white">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Top products
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Last 30 days</p>
            </div>
            <Sparkles className="w-4 h-4 text-primary-500" />
          </div>
          <ul className="space-y-3">
            {topProducts30d.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-500 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {p.units} sold
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-nums text-neutral-900 dark:text-white">
                    {formatCurrency(p.revenue)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: {
      label: "Pending",
      cls: "bg-warning/10 text-warning border-warning/20",
    },
    processing: {
      label: "Processing",
      cls: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20",
    },
    shipped: {
      label: "Shipped",
      cls: "bg-info/10 text-info border-info/20",
    },
    delivered: {
      label: "Delivered",
      cls: "bg-success/10 text-success border-success/20",
    },
    refunded: {
      label: "Refunded",
      cls: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
    },
    cancelled: {
      label: "Cancelled",
      cls: "bg-error/10 text-error border-error/20",
    },
  };
  const v = map[status] ?? map.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
        v.cls
      )}
    >
      {v.label}
    </span>
  );
}