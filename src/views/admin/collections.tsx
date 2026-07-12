"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles, Filter, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { Link } from "@/lib/nav";
import { collections } from "@/lib/admin-models";
import { PageHeader } from "@/components/admin/form";
import { cn } from "@/lib/utils";

export function CollectionsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections"
        description="Curated groups of products, surfaced across the storefront"
        actions={
          <Link
            href="/admin/collections/new"
            prefetch
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-3.5 h-3.5" /> New collection
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {collections.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={cn("h-32 bg-gradient-to-br flex items-center justify-center text-white relative", c.hero)}>
              <Sparkles className="w-10 h-10 opacity-80" />
              <span className={cn(
                "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                c.type === "automatic" ? "bg-white/20 backdrop-blur-md" : "bg-black/20 backdrop-blur-md"
              )}>
                {c.type}
              </span>
              <span className={cn(
                "absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                c.status === "published"
                  ? "bg-success/30 backdrop-blur-md"
                  : "bg-black/30 backdrop-blur-md"
              )}>
                {c.status}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                {c.title}
              </h3>
              <code className="text-[11px] text-neutral-500 font-mono">{c.slug}</code>
              <p className="text-sm text-neutral-500 mt-1.5 line-clamp-2">
                {c.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {c.productIds.length} products
                </span>
                <span className="text-neutral-500">Updated {c.updatedAt}</span>
              </div>
              {c.rule && (
                <div className="mt-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-2 text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                  {c.rule}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
                <button className="flex-1 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button className="flex-1 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1">
                  <Filter className="w-3 h-3" /> View products
                </button>
                <button className="h-8 px-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-error/10 hover:text-error text-xs" aria-label="Delete">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}