"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Users,
  Eye,
  MousePointerClick,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Copy,
} from "lucide-react";
import { PageHeader, Section } from "@/components/admin/form";
import { Sparkline } from "@/components/admin/charts";
import { formatCurrency } from "@/lib/utils";

const CAMPAIGNS_DATA: Record<string, any> = {
  c1: {
    name: "Summer sale 25% off",
    status: "scheduled",
    channel: "Email + Banner",
    audience: "All subscribers",
    audienceCount: 2840,
    startsAt: "2026-07-10",
    sent: 0,
    opens: 0,
    clicks: 0,
    revenue: 0,
    openRate: 0,
    clickRate: 0,
    openRateSeries: [],
    clickRateSeries: [],
  },
  c2: {
    name: "Loyalty VIP — early access",
    status: "active",
    channel: "Email",
    audience: "VIP customers (8)",
    audienceCount: 8,
    startsAt: "2026-06-15",
    sent: 8,
    opens: 7,
    clicks: 4,
    revenue: 1240,
    openRate: 87.5,
    clickRate: 50.0,
    openRateSeries: [88, 90, 87, 85, 88, 87, 87.5],
    clickRateSeries: [55, 52, 50, 48, 50, 51, 50],
  },
  c3: {
    name: "Win-back at-risk customers",
    status: "active",
    channel: "Email",
    audience: "At-risk (3)",
    audienceCount: 3,
    startsAt: "2026-06-01",
    sent: 3,
    opens: 2,
    clicks: 1,
    revenue: 89,
    openRate: 66.7,
    clickRate: 33.3,
    openRateSeries: [50, 55, 60, 62, 65, 66, 66.7],
    clickRateSeries: [20, 25, 28, 30, 32, 33, 33.3],
  },
  c4: {
    name: "Abandoned cart recovery",
    status: "active",
    channel: "Email",
    audience: "Cart abandoners",
    audienceCount: 24,
    startsAt: "2026-05-15",
    sent: 142,
    opens: 60,
    clicks: 18,
    revenue: 4820,
    openRate: 42.3,
    clickRate: 12.7,
    openRateSeries: [38, 39, 40, 41, 41.5, 42, 42.3],
    clickRateSeries: [10, 11, 11.5, 12, 12.3, 12.5, 12.7],
  },
};

export function CampaignDetailView({ campaignId }: { campaignId: string }) {
  const c = CAMPAIGNS_DATA[campaignId] ?? CAMPAIGNS_DATA.c2;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumb={[
          { href: "/admin/marketing", label: "Marketing" },
          { label: c.name },
        ]}
        title={c.name}
        description={`${c.channel} · ${c.audience} · started ${c.startsAt}`}
        back={{ href: "/admin/marketing", label: "Marketing" }}
        actions={
          <>
            <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
            {c.status === "active" ? (
              <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            ) : (
              <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> Resume
              </button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Metric icon={Users} label="Sent" value={c.sent.toLocaleString()} accent="neutral" />
        <Metric icon={Eye} label="Opens" value={c.opens.toLocaleString()} delta={c.openRate} deltaLabel="open rate" />
        <Metric icon={MousePointerClick} label="Clicks" value={c.clicks.toLocaleString()} delta={c.clickRate} deltaLabel="CTR" />
        <Metric icon={DollarSign} label="Revenue" value={formatCurrency(c.revenue)} accent="success" />
        <Metric icon={Calendar} label="Started" value={c.startsAt} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Section title="Open rate over time">
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold tabular-nums">{c.openRate.toFixed(1)}%</div>
            <Sparkline values={c.openRateSeries} width={140} height={32} />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Industry benchmark: 25%. {c.openRate > 25 ? "Above" : "Below"} benchmark.
          </p>
        </Section>
        <Section title="Click rate over time">
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold tabular-nums">{c.clickRate.toFixed(1)}%</div>
            <Sparkline values={c.clickRateSeries} width={140} height={32} color="#34C759" />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Industry benchmark: 4%. {c.clickRate > 4 ? "Above" : "Below"} benchmark.
          </p>
        </Section>
      </div>

      <Section title="Send history" description="Per-recipient delivery log">
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-5 sm:px-6 py-2 text-left font-bold">Recipient</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold">Sent</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold hidden md:table-cell">Opened</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold hidden md:table-cell">Clicked</th>
                <th className="px-5 sm:px-6 py-2 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Olivia Chen", email: "olivia.c@example.com", sent: "2026-06-15 09:00", opened: "2026-06-15 09:14", clicked: "2026-06-15 09:22", status: "engaged" },
                { name: "Liam O'Connor", email: "liam.oc@example.com", sent: "2026-06-15 09:00", opened: "2026-06-15 09:01", clicked: "—", status: "opened" },
                { name: "Diego Santos", email: "diego.s@example.com", sent: "2026-06-15 09:00", opened: "2026-06-15 09:08", clicked: "2026-06-15 09:30", status: "engaged" },
                { name: "Emma Johansson", email: "emma.j@example.com", sent: "2026-06-15 09:00", opened: "—", clicked: "—", status: "bounced" },
                { name: "Marcus Patel", email: "marcus.p@example.com", sent: "2026-06-15 09:00", opened: "2026-06-15 09:11", clicked: "2026-06-15 09:45", status: "engaged" },
                { name: "Noah Williams", email: "noah.w@example.com", sent: "2026-06-15 09:00", opened: "2026-06-15 09:19", clicked: "—", status: "opened" },
                { name: "Yuki Tanaka", email: "yuki.t@example.com", sent: "2026-06-15 09:00", opened: "2026-06-15 09:23", clicked: "2026-06-15 09:31", status: "engaged" },
                { name: "Sofia Rodriguez", email: "sofia.r@example.com", sent: "2026-06-15 09:00", opened: "—", clicked: "—", status: "pending" },
              ].map((r, i) => (
                <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-5 sm:px-6 py-3">
                    <div className="font-medium text-neutral-900 dark:text-white text-xs">{r.name}</div>
                    <div className="text-[10px] text-neutral-500">{r.email}</div>
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-xs text-neutral-500 font-mono">{r.sent}</td>
                  <td className="px-5 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500 font-mono">{r.opened}</td>
                  <td className="px-5 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500 font-mono">{r.clicked}</td>
                  <td className="px-5 sm:px-6 py-3 text-right">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  delta,
  deltaLabel,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  accent?: "neutral" | "success";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
          {label}
        </span>
      </div>
      <div className={`text-xl font-bold tabular-nums ${accent === "success" ? "text-success" : "text-neutral-900 dark:text-white"}`}>
        {value}
      </div>
      {delta !== undefined && (
        <div className="text-[10px] text-neutral-500 mt-0.5">{delta.toFixed(1)}% {deltaLabel}</div>
      )}
    </motion.div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    engaged: { label: "Engaged", cls: "bg-success/10 text-success border-success/20" },
    opened: { label: "Opened", cls: "bg-info/10 text-info border-info/20" },
    bounced: { label: "Bounced", cls: "bg-error/10 text-error border-error/20" },
    pending: { label: "Pending", cls: "bg-warning/10 text-warning border-warning/20" },
  };
  const v = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${v.cls}`}>
      {v.label}
    </span>
  );
}