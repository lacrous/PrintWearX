"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MoreHorizontal,
  Crown,
  AlertCircle,
  Shield,
  User as UserIcon,
  Download,
} from "lucide-react";
import { customers } from "@/lib/admin-data";
import { cn, formatCurrency } from "@/lib/utils";

const STATUS_FILTERS = ["all", "vip", "active", "at_risk", "blocked"] as const;

export function CustomersView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, status]);

  const totalLtv = customers.reduce((s, c) => s + c.lifetimeValue, 0);
  const avgLtv = totalLtv / customers.length;
  const vipCount = customers.filter((c) => c.status === "vip").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Customers
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {filtered.length} customers · {formatCurrency(totalLtv)} LTV ·{" "}
            {vipCount} VIPs
          </p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5 self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total customers" value={customers.length.toString()} delta={12.4} />
        <KpiCard label="VIP" value={vipCount.toString()} delta={8.0} highlight />
        <KpiCard label="At-risk" value={customers.filter((c) => c.status === "at_risk").length.toString()} delta={-15.2} />
        <KpiCard label="Avg LTV" value={formatCurrency(avgLtv)} delta={4.7} />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_FILTERS.map((s) => (
            <FilterPill
              key={s}
              label={s === "all" ? "All" : s.replace("_", " ")}
              active={status === s}
              onClick={() => setStatus(s)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold hidden md:table-cell">Joined</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Orders</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden md:table-cell">AOV</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">LTV</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => (window.location.href = `/admin/customers/${c.id}`)}
                  className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0",
                        c.status === "vip"
                          ? "bg-gradient-to-br from-amber-500 to-orange-600"
                          : c.status === "at_risk"
                          ? "bg-gradient-to-br from-warning to-orange-500"
                          : c.status === "blocked"
                          ? "bg-gradient-to-br from-error to-red-700"
                          : "bg-gradient-to-br from-primary-500 to-primary-700"
                      )}>
                        {c.status === "vip" && <Crown className="w-4 h-4" />}
                        {c.status === "at_risk" && <AlertCircle className="w-4 h-4" />}
                        {c.status === "blocked" && <Shield className="w-4 h-4" />}
                        {c.status === "active" && c.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900 dark:text-white text-sm truncate">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {c.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500">
                    {c.joinedAt}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right font-semibold tabular-nums text-neutral-900 dark:text-white">
                    {c.ordersCount}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right hidden md:table-cell tabular-nums text-neutral-700 dark:text-neutral-300">
                    {c.avgOrderValue > 0 ? formatCurrency(c.avgOrderValue) : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right">
                    <div className="font-bold tabular-nums text-neutral-900 dark:text-white">
                      {formatCurrency(c.lifetimeValue)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right">
                    <CustomerStatusBadge status={c.status} />
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  highlight,
}: {
  label: string;
  value: string;
  delta: number;
  highlight?: boolean;
}) {
  const up = delta >= 0;
  return (
    <div className={cn(
      "rounded-2xl border p-4",
      highlight
        ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200 dark:border-amber-500/30"
        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
    )}>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
        {label}
      </div>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
          {value}
        </div>
        <div className={cn(
          "text-xs font-semibold tabular-nums",
          up ? "text-success" : "text-error"
        )}>
          {up ? "+" : ""}{delta.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

function CustomerStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    vip: {
      label: "VIP",
      cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
      icon: <Crown className="w-3 h-3" />,
    },
    active: {
      label: "Active",
      cls: "bg-success/10 text-success border-success/20",
      icon: <UserIcon className="w-3 h-3" />,
    },
    at_risk: {
      label: "At-risk",
      cls: "bg-warning/10 text-warning border-warning/20",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    blocked: {
      label: "Blocked",
      cls: "bg-error/10 text-error border-error/20",
      icon: <Shield className="w-3 h-3" />,
    },
  };
  const v = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", v.cls)}>
      {v.icon} {v.label}
    </span>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors capitalize shrink-0",
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      )}
    >
      {label}
    </button>
  );
}