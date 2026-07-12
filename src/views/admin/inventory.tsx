"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Package,
  Truck,
  TrendingDown,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import { products, inventoryAlerts } from "@/lib/admin-data";
import { cn, formatCurrency } from "@/lib/utils";

export function InventoryView() {
  const lowStock = products.filter((p) => p.stock < 25).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const inventoryValue = products.reduce(
    (s, p) => s + p.cost * p.stock,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {products.length} SKUs · {formatCurrency(inventoryValue)} value ·{" "}
            {lowStock} low stock
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", { detail: { kind: "info", message: "Syncing inventory…" } }))}
            className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Sync
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("pwx:toast", {
                detail: { kind: "info", message: "Pick a product to restock", description: "Use the Restock buttons in the queue below." }
              }));
            }}
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-4 h-4" />
            Receive stock
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          label="Total SKUs"
          value={products.length.toString()}
          icon={Package}
          color="#007AFF"
        />
        <Card
          label="Inventory value"
          value={formatCurrency(inventoryValue)}
          icon={Truck}
          color="#34C759"
        />
        <Card
          label="Low stock"
          value={lowStock.toString()}
          icon={TrendingDown}
          color="#FF9500"
        />
        <Card
          label="Out of stock"
          value={outOfStock.toString()}
          icon={AlertTriangle}
          color="#FF3B30"
        />
      </div>

      <div className="bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border border-warning/20 rounded-2xl p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center text-warning shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-neutral-900 dark:text-white">
              Restock queue
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {inventoryAlerts.length} products need attention based on sales
              velocity and current stock.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {inventoryAlerts.map((alert, i) => (
            <motion.div
              key={alert.productId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                  {alert.productName}
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  {alert.sku} · Supplier: {alert.supplier}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <div className="text-right">
                  <div className="text-neutral-500">On hand</div>
                  <div
                    className={cn(
                      "font-bold text-base tabular-nums",
                      alert.current < 10
                        ? "text-error"
                        : "text-warning"
                    )}
                  >
                    {alert.current}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500">Days of stock</div>
                  <div className="font-bold text-base tabular-nums text-neutral-900 dark:text-white">
                    {alert.daysOfStock}d
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500">Lead time</div>
                  <div className="font-bold text-base tabular-nums text-neutral-900 dark:text-white">
                    {alert.leadTimeDays}d
                  </div>
                </div>
              </div>
              <a
              href={`/admin/inventory/restock/${alert.productId}`}
              className="h-9 px-3 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 shrink-0 inline-flex items-center"
            >
              Restock
            </a>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
          <h2 className="font-bold text-base sm:text-lg">All inventory</h2>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              placeholder="Search SKUs..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Product</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">On hand</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden md:table-cell">Reserved</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden md:table-cell">Available</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden lg:table-cell">Unit cost</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden lg:table-cell">Total value</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const available = p.stock - p.reserved;
                const status =
                  p.stock === 0
                    ? "Out of stock"
                    : p.stock < 10
                      ? "Critical"
                      : p.stock < 25
                        ? "Low"
                        : "Healthy";
                const statusColor =
                  status === "Out of stock"
                    ? "bg-error/10 text-error border-error/20"
                    : status === "Critical"
                      ? "bg-error/10 text-error border-error/20"
                      : status === "Low"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-success/10 text-success border-success/20";
                return (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="font-medium text-neutral-900 dark:text-white text-sm">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        #{p.id}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right tabular-nums font-semibold text-neutral-900 dark:text-white">
                      {p.stock}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right hidden md:table-cell tabular-nums text-neutral-500">
                      {p.reserved}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right hidden md:table-cell tabular-nums font-semibold text-success">
                      {available}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right hidden lg:table-cell tabular-nums text-neutral-700 dark:text-neutral-300">
                      {formatCurrency(p.cost)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right hidden lg:table-cell tabular-nums font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(p.cost * p.stock)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        statusColor
                      )}>
                        {status === "Healthy" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({
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