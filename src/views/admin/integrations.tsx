"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Check,
  X,
  Star,
  Search,
  Webhook,
  Activity,
  AlertCircle,
} from "lucide-react";
import { integrations, webhooks } from "@/lib/admin-models";
import { PageHeader, Section, Field, Input, Select } from "@/components/admin/form";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "analytics", label: "Analytics" },
  { id: "email", label: "Email" },
  { id: "shipping", label: "Shipping" },
  { id: "accounting", label: "Accounting" },
  { id: "automation", label: "Automation" },
  { id: "support", label: "Support" },
];

export function IntegrationsView() {
  const connected = integrations.filter((i) => i.status === "connected");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations & webhooks"
        description="Connect PrintWearX to your favorite tools"
        actions={
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("pwx:toast", {
                detail: { kind: "info", message: "Marketplace coming soon", description: "Browse available integrations below." }
              }));
            }}
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add integration
          </a>
        }
      />

      {/* Connected integrations */}
      <Section title={`Connected (${connected.length})`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {connected.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                  style={{ background: it.color }}
                >
                  {it.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {it.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                      <Check className="w-2.5 h-2.5" /> Live
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                    {it.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-neutral-500">
                    <span className="capitalize">{it.category}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-warning text-warning" />
                      {it.rating}
                    </span>
                    <span>{it.installs.toLocaleString()} installs</span>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold">
                Configure
              </button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Available integrations */}
      <Section title="Available" description="Browse the marketplace">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              placeholder="Search marketplace…"
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className="h-10 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold whitespace-nowrap shrink-0"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {integrations.filter((i) => i.status === "available").map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                  style={{ background: it.color }}
                >
                  {it.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                    {it.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                    {it.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-neutral-500">
                    <span className="capitalize">{it.category}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-warning text-warning" />
                      {it.rating}
                    </span>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full h-9 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-xs font-semibold inline-flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Install
              </button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Webhooks */}
      <Section
        title="Webhooks"
        description="Outbound event subscriptions"
        headerAction={
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("pwx:toast", {
                detail: { kind: "info", message: "Webhook builder coming soon" }
              }));
            }}
            className="h-9 px-3 rounded-lg bg-primary-500 text-white text-xs font-semibold inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> New webhook
          </a>
        }
      >
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-5 sm:px-6 py-2 text-left font-bold">Name</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold hidden md:table-cell">URL</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold hidden lg:table-cell">Events</th>
                <th className="px-5 sm:px-6 py-2 text-right font-bold">Deliveries</th>
                <th className="px-5 sm:px-6 py-2 text-right font-bold">Success</th>
                <th className="px-5 sm:px-6 py-2 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((w) => (
                <tr key={w.id} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                  <td className="px-5 sm:px-6 py-3">
                    <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                      {w.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      Last delivery: {w.lastDeliveryAt}
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-3 hidden md:table-cell">
                    <code className="text-[10px] text-neutral-500 font-mono truncate max-w-[200px] inline-block">
                      {w.url}
                    </code>
                  </td>
                  <td className="px-5 sm:px-6 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {w.events.map((e) => (
                        <span key={e} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-700 dark:text-neutral-300">
                          {e}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right tabular-nums font-semibold">
                    {w.deliveries.toLocaleString()}
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right">
                    <span className={cn(
                      "font-semibold tabular-nums",
                      w.successRate >= 95 ? "text-success" :
                      w.successRate >= 85 ? "text-warning" : "text-error"
                    )}>
                      {w.successRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right">
                    <WebhookStatus status={w.status} />
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

function WebhookStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    active: { label: "Active", cls: "bg-success/10 text-success border-success/20", icon: <Check className="w-2.5 h-2.5" /> },
    paused: { label: "Paused", cls: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700", icon: <Activity className="w-2.5 h-2.5" /> },
    failing: { label: "Failing", cls: "bg-error/10 text-error border-error/20", icon: <AlertCircle className="w-2.5 h-2.5" /> },
  };
  const v = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", v.cls)}>
      {v.icon} {v.label}
    </span>
  );
}