"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Globe,
  MousePointerClick,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import {
  revenue30d,
  trafficSources,
  conversionFunnel,
  topProducts30d,
  getKpis,
} from "@/lib/admin-data";
import {
  RevenueAreaChart,
  BarChart,
  DonutChart,
  Sparkline,
} from "@/components/admin/charts";
import { cn, formatCurrency } from "@/lib/utils";

export function AnalyticsView() {
  const kpis = getKpis();
  const totals = conversionFunnel[conversionFunnel.length - 1];

  const countryData = [
    { label: "United States", value: 18420, color: "#007AFF" },
    { label: "United Kingdom", value: 8430, color: "#34C759" },
    { label: "Germany", value: 6110, color: "#FF9500" },
    { label: "Brazil", value: 4280, color: "#AF52DE" },
    { label: "Sweden", value: 3120, color: "#FF3B30" },
    { label: "Japan", value: 2540, color: "#5856D6" },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Store performance · last 30 days
          </p>
        </div>
        <div className="flex gap-2">
          <select className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", {
              detail: { kind: "success", message: "Report exported", description: "Downloaded analytics-2026-07.pdf" }
            }))}
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5"
          >
            Export report
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <BigStat
          label="Revenue"
          value={formatCurrency(kpis.revenue)}
          delta={kpis.revenueDelta}
          icon={DollarSign}
          sparkline={revenue30d.map((d) => d.revenue)}
        />
        <BigStat
          label="Orders"
          value={kpis.orders.toLocaleString()}
          delta={kpis.ordersDelta}
          icon={ShoppingCart}
          sparkline={revenue30d.map((d) => d.orders)}
        />
        <BigStat
          label="Conversion rate"
          value="3.81%"
          delta={0.42}
          icon={MousePointerClick}
          sparkline={[2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.81]}
        />
        <BigStat
          label="Avg session"
          value="2:48"
          delta={-0.08}
          icon={TrendingUp}
          sparkline={[180, 165, 170, 175, 168, 172, 165, 158, 160, 168]}
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Revenue trend
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Daily revenue · {formatCurrency(kpis.revenue)} over {revenue30d.length} data points
            </p>
          </div>
        </div>
        <RevenueAreaChart data={revenue30d} height={260} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Traffic sources
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Where your visitors come from
            </p>
          </div>
          <DonutChart
            data={trafficSources.map((t) => ({
              label: t.source,
              value: t.visits,
              color: t.color,
            }))}
          />
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Top countries
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">By sessions</p>
          </div>
          <BarChart
            data={countryData}
            height={180}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
            Conversion funnel
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {totals.value.toLocaleString()} purchases from{" "}
            {conversionFunnel[0].value.toLocaleString()} visits
          </p>
        </div>
        <div className="space-y-3">
          {conversionFunnel.map((stage, i) => {
            const widthPct = (stage.rate / 100) * 100;
            const prevRate = i > 0 ? conversionFunnel[i - 1].rate : 100;
            const dropOff = i > 0 ? prevRate - stage.rate : 0;
            return (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {stage.stage}
                    </span>
                    {i > 0 && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-error">
                        −{dropOff.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-neutral-500 tabular-nums">
                      {stage.value.toLocaleString()}
                    </span>
                    <span className="font-bold tabular-nums text-neutral-900 dark:text-white">
                      {stage.rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 rounded-xl flex items-center px-3 text-white text-xs font-semibold"
                    style={{
                      background: `linear-gradient(90deg, hsl(${210 - i * 8} 95% 60%), hsl(${210 - i * 8} 95% 50%))`,
                    }}
                  >
                    {stage.rate > 10 ? stage.stage : ""}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Top products
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Revenue leaderboard (30d)</p>
            </div>
            <ShoppingBag className="w-5 h-5 text-primary-500" />
          </div>
          <ul className="space-y-3">
            {topProducts30d.map((p, i) => {
              const max = topProducts30d[0].revenue;
              return (
                <li key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-500 shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white truncate">
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-neutral-500 tabular-nums">
                        {p.units} units
                      </span>
                      <span className="font-bold tabular-nums text-neutral-900 dark:text-white">
                        {formatCurrency(p.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.revenue / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Device breakdown
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">How people browse</p>
            </div>
            <Globe className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-4">
            <DeviceRow label="Mobile" percent={62} count={29830} />
            <DeviceRow label="Desktop" percent={28} count={13540} />
            <DeviceRow label="Tablet" percent={10} count={4940} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  delta,
  icon: Icon,
  sparkline,
}: {
  label: string;
  value: string;
  delta: number;
  icon: React.ComponentType<{ className?: string }>;
  sparkline: number[];
}) {
  const up = delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-500">
          <Icon className="w-4 h-4" />
        </div>
        <span className={cn(
          "inline-flex items-center gap-0.5 text-xs font-semibold",
          up ? "text-success" : "text-error"
        )}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(delta).toFixed(2)}
        </span>
      </div>
      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tabular-nums mt-0.5">
        {value}
      </div>
      <div className="mt-3">
        <Sparkline values={sparkline} width={140} height={28} />
      </div>
    </motion.div>
  );
}

function DeviceRow({ label, percent, count }: { label: string; percent: number; count: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-neutral-900 dark:text-white">{label}</span>
        <span className="font-bold tabular-nums text-neutral-900 dark:text-white">
          {percent}% <span className="text-xs text-neutral-500 font-normal">({count.toLocaleString()})</span>
        </span>
      </div>
      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
        />
      </div>
    </div>
  );
}