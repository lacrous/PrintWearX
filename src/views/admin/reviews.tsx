"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Check,
  X,
  MessageSquare,
  CheckCircle2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { reviews as initial } from "@/lib/admin-models";
import { getProduct } from "@/lib/admin-models";
import { PageHeader, Section } from "@/components/admin/form";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "pending", "approved", "rejected", "spam"] as const;

export function ReviewsView() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const counts = initial.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = initial.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Approve, reject, or reply to customer reviews"
        actions={
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", {
              detail: { kind: "success", message: "2 reviews approved", description: "Notifications sent to authors." }
            }))}
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve all pending
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {(["pending", "approved", "rejected", "spam", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-xl p-3 border text-left transition-colors",
              filter === s
                ? "bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}
          >
            <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
              {s}
            </div>
            <div className="text-xl font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
              {s === "all" ? initial.length : counts[s] ?? 0}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r, i) => {
          const product = getProduct(r.productId);
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                  {r.customerName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {r.customerName}
                    </span>
                    <span className="text-xs text-neutral-500">reviewed</span>
                    <a href={`/admin/products/${r.productId}/edit`} className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-sm">
                      {product?.name ?? "Unknown product"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "w-3.5 h-3.5",
                            s <= r.rating ? "fill-warning text-warning" : "text-neutral-300 dark:text-neutral-700"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">{r.createdAt}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                    <StatusPill status={r.status} />
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{r.title}</h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                {r.body}
              </p>

              {r.photos > 0 && (
                <div className="mt-3 flex gap-1.5">
                  {Array.from({ length: r.photos }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-14 h-14 rounded-lg bg-gradient-to-br",
                        [
                          "from-primary-500 to-primary-700",
                          "from-amber-500 to-orange-600",
                          "from-emerald-500 to-teal-600",
                          "from-pink-500 to-rose-600",
                        ][i % 4]
                      )}
                    >
                      <ImageIcon className="w-full h-full p-3 text-white/70" />
                    </div>
                  ))}
                </div>
              )}

              {r.response && (
                <div className="mt-3 rounded-xl bg-primary-50/50 dark:bg-primary-500/5 border-l-2 border-primary-500 p-3">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-primary-700 dark:text-primary-400 mb-1">
                    Your response · {r.response.respondedAt}
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{r.response.body}</p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs text-neutral-500">
                  {r.helpful} found helpful
                </div>
                <div className="flex items-center gap-2">
                  {r.status === "pending" && (
                    <>
                      <button className="h-8 px-3 rounded-lg bg-error/10 hover:bg-error/15 text-error text-xs font-semibold inline-flex items-center gap-1">
                        <X className="w-3 h-3" /> Reject
                      </button>
                      <button className="h-8 px-3 rounded-lg bg-success text-white hover:bg-success/90 text-xs font-semibold inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                    </>
                  )}
                  {r.status === "approved" && !r.response && (
                    <button className="h-8 px-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-xs font-semibold inline-flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Reply
                    </button>
                  )}
                  {r.status === "spam" && (
                    <button className="h-8 px-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-xs font-semibold inline-flex items-center gap-1">
                      Mark not spam
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-warning/10 text-warning border-warning/20" },
    approved: { label: "Approved", cls: "bg-success/10 text-success border-success/20" },
    rejected: { label: "Rejected", cls: "bg-error/10 text-error border-error/20" },
    spam: { label: "Spam", cls: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700" },
  };
  const v = map[status];
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", v.cls)}>
      {v.label}
    </span>
  );
}