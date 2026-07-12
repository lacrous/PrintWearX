"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/nav";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit3,
  Copy,
  Archive,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  X,
  Image as ImageIcon,
  Star,
  Package,
} from "lucide-react";
import { products as allProducts } from "@/lib/admin-data";
import { cn, formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/views/admin/dashboard";

type FilterStatus = "all" | "active" | "draft" | "archived";
type FilterCat = "all" | "T-Shirts" | "Hoodies" | "Crewnecks" | "Long-Sleeves" | "Caps" | "Totes";

export function ProductsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [cat, setCat] = useState<FilterCat>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerProduct, setDrawerProduct] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.id.includes(search)
      )
        return false;
      return true;
    });
  }, [search, status, cat]);

  const totalRevenue = filtered.reduce((s, p) => s + p.revenue30d, 0);
  const totalStock = filtered.reduce((s, p) => s + p.stock, 0);
  const totalUnits = filtered.reduce((s, p) => s + p.sales30d, 0);

  const toggleAll = () => {
    setSelected((s) =>
      s.length === filtered.length ? [] : filtered.map((p) => p.id)
    );
  };
  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const drawerData = drawerProduct
    ? allProducts.find((p) => p.id === drawerProduct)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Products
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {filtered.length} products · {formatCurrency(totalRevenue)} revenue (30d) ·{" "}
            {totalUnits} units sold
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/admin/products/new"
            prefetch
            className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-4 h-4" />
            Add product
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Active" value={allProducts.filter((p) => p.status === "active").length.toString()} icon={Package} color="#34C759" />
        <Stat label="Drafts" value={allProducts.filter((p) => p.status === "draft").length.toString()} icon={Edit3} color="#FF9500" />
        <Stat label="Total stock" value={totalStock.toLocaleString()} icon={TrendingUp} color="#007AFF" />
        <Stat label="Low stock" value={allProducts.filter((p) => p.stock < 15).length.toString()} icon={TrendingDown} color="#FF3B30" />
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <FilterPill label="All" active={status === "all"} onClick={() => setStatus("all")} />
          <FilterPill label="Active" active={status === "active"} onClick={() => setStatus("active")} />
          <FilterPill label="Draft" active={status === "draft"} onClick={() => setStatus("draft")} />
          <FilterPill label="Archived" active={status === "archived"} onClick={() => setStatus("archived")} />
          <span className="w-px bg-neutral-200 dark:bg-neutral-800 mx-1 self-stretch" />
          <FilterPill label="All categories" active={cat === "all"} onClick={() => setCat("all")} />
          <FilterPill label="T-Shirts" active={cat === "T-Shirts"} onClick={() => setCat("T-Shirts")} />
          <FilterPill label="Hoodies" active={cat === "Hoodies"} onClick={() => setCat("Hoodies")} />
          <FilterPill label="Crewnecks" active={cat === "Crewnecks"} onClick={() => setCat("Crewnecks")} />
          <FilterPill label="Long-Sleeves" active={cat === "Long-Sleeves"} onClick={() => setCat("Long-Sleeves")} />
          <FilterPill label="Accessories" active={cat === "Caps"} onClick={() => setCat("Caps")} />
        </div>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-primary-500 text-white rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-lg shadow-primary-500/30"
          >
            <span className="text-sm font-semibold">
              {selected.length} selected
            </span>
            <div className="flex-1 flex gap-2 overflow-x-auto">
              <button className="h-8 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold inline-flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button className="h-8 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold inline-flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="h-8 px-3 rounded-lg bg-error/80 hover:bg-error text-xs font-semibold inline-flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
            <button onClick={() => setSelected([])} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/15" aria-label="Clear">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Product</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold hidden lg:table-cell">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Price</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden md:table-cell">Stock</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden md:table-cell">Sold (30d)</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold hidden lg:table-cell">Rating</th>
                <th className="px-4 sm:px-6 py-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={cn(
                    "border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors",
                    selected.includes(p.id) && "bg-primary-50/50 dark:bg-primary-500/5"
                  )}
                >
                  <td className="px-4 sm:px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <a
                      href={`/admin/products/${p.id}/edit`}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900 dark:text-white text-sm truncate max-w-[200px]">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          {p.category} · #{p.id}
                        </div>
                      </div>
                    </a>
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden lg:table-cell">
                    <OrderStatusBadge status={p.status} />
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right font-semibold tabular-nums text-neutral-900 dark:text-white">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right hidden md:table-cell">
                    <span className={cn(
                      "inline-flex items-center justify-center min-w-[36px] h-6 px-2 rounded-md text-xs font-semibold tabular-nums",
                      p.stock < 10
                        ? "bg-error/10 text-error"
                        : p.stock < 25
                        ? "bg-warning/10 text-warning"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    )}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right hidden md:table-cell tabular-nums font-semibold text-neutral-900 dark:text-white">
                    {p.sales30d}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-right hidden lg:table-cell">
                    <div className="inline-flex items-center gap-1 text-xs text-neutral-700 dark:text-neutral-300">
                      <Star className="w-3 h-3 fill-warning text-warning" />
                      <span className="font-semibold">{p.rating}</span>
                      <span className="text-neutral-400">({p.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-neutral-500">
            No products match these filters.
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {drawerData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerProduct(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white dark:bg-neutral-900 z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="font-bold text-lg">Product details</h2>
                <button onClick={() => setDrawerProduct(null)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-neutral-400">
                  <ImageIcon className="w-16 h-16" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
                    {drawerData.category}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {drawerData.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-semibold">{drawerData.rating}</span>
                    <span className="text-xs text-neutral-500">({drawerData.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-3">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Price</div>
                    <div className="text-lg font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
                      {formatCurrency(drawerData.price)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-3">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Cost</div>
                    <div className="text-lg font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
                      {formatCurrency(drawerData.cost)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-3">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Margin</div>
                    <div className="text-lg font-bold tabular-nums text-success mt-0.5">
                      {(((drawerData.price - drawerData.cost) / drawerData.price) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-3">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Revenue (30d)</div>
                    <div className="text-lg font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
                      {formatCurrency(drawerData.revenue30d)}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-4 space-y-2">
                  <Row label="Stock on hand" value={drawerData.stock.toString()} />
                  <Row label="Reserved" value={drawerData.reserved.toString()} />
                  <Row label="Available" value={(drawerData.stock - drawerData.reserved).toString()} />
                  <Row label="Sales (30d)" value={drawerData.sales30d.toString()} />
                  <Row label="Status" value={drawerData.status} />
                  <Row label="Created" value={drawerData.createdAt} />
                  <Row label="Updated" value={drawerData.updatedAt} />
                </div>
              </div>
              <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                <a
                  href={`/admin/products/${drawerData.id}/edit`}
                  className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 inline-flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </a>
                <button className="h-11 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 inline-flex items-center gap-1.5 text-sm font-medium">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="h-11 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-error/5 hover:border-error/30 hover:text-error inline-flex items-center justify-center" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
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
      <div className="min-w-0">
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

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-900 dark:text-white capitalize">
        {value}
      </span>
    </div>
  );
}