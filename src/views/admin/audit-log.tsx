"use client";

import { motion } from "framer-motion";
import {
  Activity,
  User,
  Package,
  ShoppingBag,
  Tag as TagIcon,
  Mail,
  Settings,
  Zap,
  KeyRound,
} from "lucide-react";
import { activity } from "@/lib/admin-models";
import { PageHeader, Section } from "@/components/admin/form";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  product: Package,
  order: ShoppingBag,
  customer: User,
  discount: TagIcon,
  campaign: Mail,
  content: Activity,
  settings: Settings,
  auth: KeyRound,
  integration: Zap,
};

const TYPE_COLORS: Record<string, string> = {
  product: "from-primary-500 to-primary-700 text-white",
  order: "from-success to-emerald-700 text-white",
  customer: "from-amber-500 to-orange-600 text-white",
  discount: "from-pink-500 to-rose-600 text-white",
  campaign: "from-info to-blue-600 text-white",
  content: "from-purple-500 to-indigo-600 text-white",
  settings: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
  auth: "from-warning to-orange-500 text-white",
  integration: "from-cyan-500 to-blue-600 text-white",
};

export function AuditLogView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        description="Every meaningful event in your store, in order"
      />

      <Section title="Recent events">
        <ol className="relative space-y-3 pl-9 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-neutral-200 dark:before:bg-neutral-800">
          {activity.map((e, i) => {
            const Icon = TYPE_ICONS[e.targetType ?? "settings"] ?? Activity;
            const cls = TYPE_COLORS[e.targetType ?? "settings"] ?? TYPE_COLORS.settings;
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative"
              >
                <div className={cn(
                  "absolute -left-9 top-0.5 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-sm",
                  cls
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {e.actor}
                  </span>{" "}
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {e.action}
                  </span>{" "}
                  {e.target && (
                    <span className="font-mono text-primary-600 dark:text-primary-400">
                      {e.target}
                    </span>
                  )}
                  {e.meta && (
                    <span className="text-neutral-500 text-xs ml-2">
                      {Object.entries(e.meta).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {e.at}
                  {e.ip && <span className="ml-2">IP {e.ip}</span>}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </Section>
    </div>
  );
}