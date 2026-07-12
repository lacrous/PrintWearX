"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  X,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  Package,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
import { orders, type Order } from "@/lib/admin-data";
import { cn, formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/views/admin/dashboard";

const STATUSES = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "refunded",
  "cancelled",
] as const;

export function OrdersView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.number.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, status]);

  const total = filtered.reduce((s, o) => s + o.total, 0);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, []);

  const selectedOrder = orders.find((o) => o.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {filtered.length} orders · {formatCurrency(total)} total
          </p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5 self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {STATUSES.slice(1).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-xl p-3 border text-left transition-colors",
              status === s
                ? "bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}
          >
            <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
              {s}
            </div>
            <div className="text-xl font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
              {counts[s] ?? 0}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, email..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <FilterPill label="All" active={status === "all"} onClick={() => setStatus("all")} />
          <FilterPill label="Pending" active={status === "pending"} onClick={() => setStatus("pending")} />
          <FilterPill label="Shipped" active={status === "shipped"} onClick={() => setStatus("shipped")} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Order</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden sm:table-cell">Items</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Total</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                  className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3">
                    <a
                      href={`/admin/orders/${o.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono font-semibold text-neutral-900 dark:text-white text-xs hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      #{o.number}
                    </a>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <div className="font-medium text-neutral-900 dark:text-white text-xs">
                      {o.customerName}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {o.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500">
                    {o.placedAt}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right hidden sm:table-cell">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {o.items.length}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right font-bold tabular-nums text-neutral-900 dark:text-white">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-neutral-500">
            No orders match these filters.
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 240 }}
        className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white dark:bg-neutral-900 z-50 shadow-2xl flex flex-col"
      >
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                Order
              </div>
              <div className="font-mono font-bold text-lg">#{order.number}</div>
            </div>
            <button onClick={onClose} className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <Section title="Customer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-xs">
                {order.customerName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-semibold text-sm text-neutral-900 dark:text-white">
                  {order.customerName}
                </div>
                <div className="text-xs text-neutral-500">{order.customerEmail}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
              <button className="flex-1 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
            </div>
          </Section>

          <Section title="Items">
            <ul className="space-y-2">
              {order.items.map((it, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800"
                >
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-400 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {it.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {formatCurrency(it.unitPrice)} × {it.qty}
                    </div>
                  </div>
                  <div className="font-bold tabular-nums text-sm">
                    {formatCurrency(it.unitPrice * it.qty)}
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Totals">
            <div className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
              <Row label="Tax" value={formatCurrency(order.tax)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatCurrency(order.shipping)} />
              <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />
              <Row label="Total" value={formatCurrency(order.total)} bold />
            </div>
          </Section>

          <Section title="Shipping">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">
                  {order.shippingAddress.city}
                </div>
                <div className="text-xs text-neutral-500">
                  {order.shippingAddress.country} · {order.shippingAddress.zip}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Timeline">
            <ol className="space-y-3 text-xs">
              <Timeline active label="Order placed" date={order.placedAt} />
              <Timeline active={!!order.shippedAt} label="Shipped" date={order.shippedAt} />
              <Timeline active={!!order.deliveredAt} label="Delivered" date={order.deliveredAt} />
            </ol>
          </Section>
        </div>

        <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
          <a
            href={`/admin/orders/${order.id}`}
            className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 inline-flex items-center justify-center gap-1.5"
          >
            <Truck className="w-4 h-4" /> Mark shipped
          </a>
          <a
            href={`/admin/orders/${order.id}`}
            className="h-11 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-medium inline-flex items-center"
          >
            Refund
          </a>
        </div>
      </motion.aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-neutral-500", bold && "text-neutral-900 dark:text-white font-semibold")}>
        {label}
      </span>
      <span className={cn("tabular-nums", bold ? "font-bold text-neutral-900 dark:text-white" : "text-neutral-900 dark:text-white")}>
        {value}
      </span>
    </div>
  );
}

function Timeline({ active, label, date }: { active: boolean; label: string; date?: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className={cn(
        "w-2 h-2 rounded-full",
        active ? "bg-success" : "bg-neutral-300 dark:bg-neutral-700"
      )} />
      <div className="flex-1">
        <div className={cn("font-semibold", active ? "text-neutral-900 dark:text-white" : "text-neutral-400")}>
          {label}
        </div>
        {date && <div className="text-[10px] text-neutral-500 font-mono">{date}</div>}
      </div>
    </li>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0",
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      )}
    >
      {label}
    </button>
  );
}