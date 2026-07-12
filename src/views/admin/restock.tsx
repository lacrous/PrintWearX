"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  Save,
  Plus,
  Minus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Field,
  FormRow,
  Section,
  Input,
  Select,
  Textarea,
  PageHeader,
} from "@/components/admin/form";
import { getProduct, variantsForProduct } from "@/lib/admin-models";
import { formatCurrency } from "@/lib/utils";

export function RestockView({ productId }: { productId: string }) {
  const product = getProduct(productId);
  const variants = variantsForProduct(productId);
  const [addQty, setAddQty] = useState<Record<string, number>>(
    Object.fromEntries(variants.map((v) => [v.id, 50]))
  );

  if (!product) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Product not found
        </h1>
      </div>
    );
  }

  const totalUnits = Object.values(addQty).reduce((s, n) => s + n, 0);
  const totalCost = variants.reduce((s, v) => s + (addQty[v.id] ?? 0) * v.cost, 0);

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        breadcrumb={[
          { href: "/admin/inventory", label: "Inventory" },
          { label: `Restock ${product.name}` },
        ]}
        title={`Restock: ${product.name}`}
        description={`Currently ${product.stock} on hand · ${product.reserved} reserved`}
        back={{ href: "/admin/inventory", label: "Inventory" }}
        actions={
          <>
            <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800">
              Cancel
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", {
                detail: { kind: "success", message: "Purchase order created", description: "PO sent to supplier. Inventory updates when received." }
              }))}
              className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Truck className="w-3.5 h-3.5" />
              Create purchase order
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Section title="Add stock by variant" description="Enter quantity for each variant or for the product as a whole">
            {variants.length === 0 ? (
              <div className="space-y-3">
                <Field label="Quantity">
                  <Input type="number" defaultValue={50} min={1} />
                </Field>
                <Field label="Unit cost">
                  <Input type="number" step="0.01" defaultValue={product.cost} prefix="$" />
                </Field>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 text-[10px] uppercase tracking-wider font-bold text-neutral-500">
                  <div className="col-span-4">Variant</div>
                  <div className="col-span-2 text-right">Current</div>
                  <div className="col-span-3 text-center">Add</div>
                  <div className="col-span-2 text-right">New</div>
                  <div className="col-span-1 text-right">Cost</div>
                </div>
                {variants.map((v) => {
                  const add = addQty[v.id] ?? 0;
                  return (
                    <div key={v.id} className="grid grid-cols-12 gap-2 p-3 border-t border-neutral-200 dark:border-neutral-800 items-center text-sm">
                      <div className="col-span-4">
                        <div className="font-medium text-neutral-900 dark:text-white">{v.option}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{v.sku}</div>
                      </div>
                      <div className="col-span-2 text-right tabular-nums">{v.stock}</div>
                      <div className="col-span-3 flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setAddQty((p) => ({ ...p, [v.id]: Math.max(0, (p[v.id] ?? 0) - 10) }))}
                          className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 inline-flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={add}
                          onChange={(e) => setAddQty((p) => ({ ...p, [v.id]: parseInt(e.target.value) || 0 }))}
                          className="w-14 h-7 px-1 text-center rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => setAddQty((p) => ({ ...p, [v.id]: (p[v.id] ?? 0) + 10 }))}
                          className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 inline-flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="col-span-2 text-right tabular-nums font-bold text-success">
                        {v.stock + add}
                      </div>
                      <div className="col-span-1 text-right tabular-nums text-neutral-500 text-xs">
                        {formatCurrency(v.cost)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <Section title="Purchase order" description="Optional — generate a PO to send to the supplier">
            <FormRow>
              <Field label="Supplier">
                <Select defaultValue="Italian Leather Co.">
                  <option>Italian Leather Co.</option>
                  <option>VietRun Manufacturing</option>
                  <option>TechForge OEM</option>
                  <option>Mongolia Wool Co.</option>
                </Select>
              </Field>
              <Field label="PO number" description="Auto-generated if blank">
                <Input placeholder="PO-2026-XXXX" />
              </Field>
            </FormRow>
            <FormRow>
              <Field label="Expected delivery">
                <Input type="date" defaultValue="2026-07-25" />
              </Field>
              <Field label="Lead time">
                <Input value="14 days" disabled />
              </Field>
            </FormRow>
            <Field label="Internal notes">
              <Textarea rows={2} placeholder="Add a note about this restock…" defaultValue="Urgent — back-in-stock emails queued for these customers." />
            </Field>
          </Section>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Section title="Summary">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Current stock</span>
                <span className="font-semibold tabular-nums">{product.stock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Adding</span>
                <span className="font-semibold tabular-nums text-success">+{totalUnits}</span>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900 dark:text-white">New stock</span>
                <span className="text-xl font-bold tabular-nums">{product.stock + totalUnits}</span>
              </div>
            </div>
          </Section>

          <Section title="Cost">
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Total units</span>
                <span className="font-semibold tabular-nums">{totalUnits}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Avg cost</span>
                <span className="font-semibold tabular-nums">
                  {totalUnits > 0 ? formatCurrency(totalCost / totalUnits) : "—"}
                </span>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-2" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white">Total</span>
                <span className="text-xl font-bold tabular-nums">{formatCurrency(totalCost)}</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 mt-2">
              This amount will be recorded as inventory cost and added to your COGS.
            </p>
          </Section>

          <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-500/10 dark:to-primary-500/5 border border-primary-200 dark:border-primary-500/30 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-primary-700 dark:text-primary-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Auto-actions</span>
            </div>
            <ul className="text-xs text-primary-900 dark:text-primary-300 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
                3 back-in-stock notifications will be sent
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
                Inventory updated on storefront
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
                Search ranking recalculated
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}