"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/lib/nav";
import {
  Plus,
  Copy,
  Calendar,
  Tag,
  TrendingUp,
  Users,
  Mail,
  Sparkles,
  Megaphone,
  Gift,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { discountCodes } from "@/lib/admin-data";
import { cn, formatCurrency } from "@/lib/utils";

const CAMPAIGNS = [
  {
    id: "c1",
    name: "Summer sale 25% off",
    channel: "Email + Banner",
    status: "scheduled",
    startsAt: "2026-07-10",
    audience: "All subscribers",
    sent: 0,
    openRate: 0,
    revenue: 0,
  },
  {
    id: "c2",
    name: "Loyalty VIP — early access",
    channel: "Email",
    status: "active",
    startsAt: "2026-06-15",
    audience: "VIP customers (8)",
    sent: 8,
    openRate: 87.5,
    revenue: 1240,
  },
  {
    id: "c3",
    name: "Win-back at-risk customers",
    channel: "Email",
    status: "active",
    startsAt: "2026-06-01",
    audience: "At-risk (3)",
    sent: 3,
    openRate: 66.7,
    revenue: 89,
  },
  {
    id: "c4",
    name: "Abandoned cart recovery",
    channel: "Email",
    status: "active",
    startsAt: "2026-05-15",
    audience: "Cart abandoners",
    sent: 142,
    openRate: 42.3,
    revenue: 4820,
  },
];

export function MarketingView() {
  const [tab, setTab] = useState<"codes" | "campaigns">("codes");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Marketing
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Discount codes, campaigns, email automation
          </p>
        </div>
        <Link
          href="/admin/campaigns/new"
          prefetch
          className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New campaign
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Active codes" value="2" icon={Tag} color="#007AFF" />
        <Stat label="Campaigns" value="4" icon={Megaphone} color="#34C759" />
        <Stat label="List size" value="2,840" icon={Users} color="#AF52DE" />
        <Stat label="Email revenue (30d)" value="$5,149" icon={TrendingUp} color="#FF9500" />
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 w-fit">
        {(["codes", "campaigns"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-semibold transition-all",
              tab === t
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            {t === "codes" ? "Discount codes" : "Campaigns"}
          </button>
        ))}
      </div>

      {tab === "codes" ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold">Code</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold hidden sm:table-cell">Discount</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold hidden md:table-cell">Validity</th>
                  <th className="px-4 sm:px-6 py-3 text-right font-semibold">Uses</th>
                  <th className="px-4 sm:px-6 py-3 text-right font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {discountCodes.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-2">
                        <code className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 font-mono font-bold text-xs">
                          {d.code}
                        </code>
                        <button className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300" aria-label="Copy">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 hidden sm:table-cell">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {d.type === "percent" ? `${d.value}% off` : `$${d.value} off`}
                      </span>
                      {d.minOrder > 0 && (
                        <div className="text-[10px] text-neutral-500">
                          Min. ${d.minOrder}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500 font-mono">
                      {d.startsAt} → {d.endsAt}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right tabular-nums">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {d.uses}
                      </span>
                      <span className="text-xs text-neutral-500"> / {d.limit}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <DiscountStatus status={d.status} />
                    </td>
                    <td className="px-4 sm:px-6 py-3"></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {CAMPAIGNS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => (window.location.href = `/admin/campaigns/${c.id}`)}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  c.channel.includes("Banner")
                    ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white"
                    : "bg-gradient-to-br from-primary-500 to-primary-700 text-white"
                )}>
                  {c.channel.includes("Banner") ? (
                    <Megaphone className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-neutral-900 dark:text-white">
                      {c.name}
                    </h3>
                    <CampaignStatus status={c.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> {c.audience}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {c.startsAt}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <Metric label="Sent" value={c.sent.toLocaleString()} />
                    <Metric
                      label="Open rate"
                      value={`${c.openRate}%`}
                      accent={c.openRate > 50 ? "good" : c.openRate > 30 ? "ok" : "bad"}
                    />
                    <Metric label="Revenue" value={formatCurrency(c.revenue)} accent="good" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
          {label}
        </div>
        <div className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
          {value}
        </div>
      </div>
    </div>
  );
}

function DiscountStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    active: {
      label: "Active",
      cls: "bg-success/10 text-success border-success/20",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    scheduled: {
      label: "Scheduled",
      cls: "bg-info/10 text-info border-info/20",
      icon: <Clock className="w-3 h-3" />,
    },
    expired: {
      label: "Expired",
      cls: "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700",
      icon: <XCircle className="w-3 h-3" />,
    },
  };
  const v = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", v.cls)}>
      {v.icon} {v.label}
    </span>
  );
}

function CampaignStatus({ status }: { status: string }) {
  return <DiscountStatus status={status} />;
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "good" | "ok" | "bad";
}) {
  return (
    <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
        {label}
      </div>
      <div
        className={cn(
          "text-sm font-bold tabular-nums",
          accent === "good" && "text-success",
          accent === "ok" && "text-warning",
          accent === "bad" && "text-error",
          !accent && "text-neutral-900 dark:text-white"
        )}
      >
        {value}
      </div>
    </div>
  );
}