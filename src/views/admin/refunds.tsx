"use client";

import { motion } from "framer-motion";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Search,
  CreditCard,
  Gift,
  RefreshCw,
} from "lucide-react";
import { refunds } from "@/lib/admin-models";
import { PageHeader, Section } from "@/components/admin/form";
import { cn, formatCurrency } from "@/lib/utils";

const REASONS: Record<string, string> = {
  customer_request: "Customer request",
  damaged: "Damaged in transit",
  wrong_item: "Wrong item shipped",
  not_received: "Not received",
  other: "Other",
};

export function RefundsView() {
  const total = refunds.reduce((s, r) => s + r.amount, 0);
  const pending = refunds.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refunds"
        description="Process and track refund requests"
        actions={
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", {
              detail: { kind: "info", message: "Refunds refreshed" }
            }))}
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Clock} label="Pending" value={pending.toString()} accent="warning" />
        <Stat icon={CheckCircle2} label="Refunded (30d)" value={refunds.filter(r => r.status === "refunded").length.toString()} accent="success" />
        <Stat icon={DollarSign} label="Total refunded" value={formatCurrency(total)} />
        <Stat icon={RotateCcw} label="Avg processing" value="1.2 days" />
      </div>

      <Section title="All refunds">
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-5 sm:px-6 py-2 text-left font-bold">Refund</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold">Order</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold hidden md:table-cell">Customer</th>
                <th className="px-5 sm:px-6 py-2 text-left font-bold hidden lg:table-cell">Reason</th>
                <th className="px-5 sm:px-6 py-2 text-right font-bold">Amount</th>
                <th className="px-5 sm:px-6 py-2 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                >
                  <td className="px-5 sm:px-6 py-3">
                    <div className="font-mono font-semibold text-neutral-900 dark:text-white text-xs">
                      #{r.number}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">{r.requestedAt}</div>
                  </td>
                  <td className="px-5 sm:px-6 py-3">
                    <a href={`/admin/orders/${r.orderId}`} className="font-mono font-semibold text-primary-600 dark:text-primary-400 hover:underline text-xs">
                      #{r.orderNumber}
                    </a>
                  </td>
                  <td className="px-5 sm:px-6 py-3 hidden md:table-cell">
                    <a href={`/admin/customers/${r.customerId}`} className="text-xs hover:underline">
                      {r.customerName}
                    </a>
                  </td>
                  <td className="px-5 sm:px-6 py-3 hidden lg:table-cell text-xs text-neutral-700 dark:text-neutral-300">
                    {REASONS[r.reason]}
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right font-bold tabular-nums">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right">
                    <RefundStatus status={r.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: "warning" | "success";
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        accent === "warning" && "bg-warning/10 text-warning",
        accent === "success" && "bg-success/10 text-success",
        !accent && "bg-primary-50 dark:bg-primary-500/10 text-primary-500"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">{label}</div>
        <div className="text-xl font-bold tabular-nums text-neutral-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

function RefundStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-warning/10 text-warning border-warning/20" },
    processing: { label: "Processing", cls: "bg-info/10 text-info border-info/20" },
    refunded: { label: "Refunded", cls: "bg-success/10 text-success border-success/20" },
    rejected: { label: "Rejected", cls: "bg-error/10 text-error border-error/20" },
  };
  const v = map[status] ?? map.pending;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border", v.cls)}>
      {v.label}
    </span>
  );
}