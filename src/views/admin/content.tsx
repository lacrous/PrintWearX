"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/lib/nav";
import {
  Plus,
  FileText,
  Image as ImageIcon,
  BookOpen,
  LayoutTemplate,
  Edit3,
  Eye,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
} from "lucide-react";
import { content } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  banner: ImageIcon,
  collection: LayoutTemplate,
  blog: BookOpen,
  page: FileText,
};

const TYPE_COLORS: Record<string, string> = {
  banner: "from-pink-500 to-rose-600",
  collection: "from-primary-500 to-primary-700",
  blog: "from-amber-500 to-orange-600",
  page: "from-info to-blue-600",
};

const STATUS_FILTERS = ["all", "published", "draft", "scheduled"] as const;

export function ContentView() {
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");

  const filtered = content.filter((c) => status === "all" || c.status === status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Content
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Banners, collections, blog posts, pages
          </p>
        </div>
        <Link
          href="/admin/content/new"
          prefetch
          className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New content
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <FilterPill
            key={s}
            label={s === "all" ? "All" : s}
            active={status === s}
            onClick={() => setStatus(s)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => {
          const Icon = TYPE_ICONS[c.type];
          return (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className={cn(
                "h-32 bg-gradient-to-br flex items-center justify-center text-white relative",
                TYPE_COLORS[c.type]
              )}>
                <Icon className="w-10 h-10 opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                  {c.type}
                </span>
                <span className="absolute top-3 right-3">
                  <ContentStatus status={c.status} />
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base line-clamp-2">
                  {c.title}
                </h3>
                <code className="text-[11px] text-neutral-500 font-mono">
                  {c.slug}
                </code>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.updatedAt}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {c.views.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-neutral-500">
                  By <span className="font-semibold text-neutral-700 dark:text-neutral-300">{c.author}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="flex-1 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button className="h-9 px-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-error/10 hover:text-error text-xs" aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function ContentStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    published: { label: "Live", cls: "bg-success/20 text-white border border-white/30" },
    draft: { label: "Draft", cls: "bg-white/20 text-white border border-white/30" },
    scheduled: { label: "Scheduled", cls: "bg-info/30 text-white border border-white/30" },
  };
  const v = map[status];
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", v.cls)}>
      {v.label}
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