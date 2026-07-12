"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Clock,
  Package,
  Printer,
  MoreHorizontal,
  X,
  Download,
} from "lucide-react";
import { getOrder, getCustomer } from "@/lib/admin-models";
import { PageHeader, Section, Field, Input, Textarea, Select } from "@/components/admin/form";
import { cn, formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/views/admin/dashboard";

const TIMELINE = [
  { key: "placed", label: "Order placed", always: true },
  { key: "processing", label: "Payment received" },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function OrderDetailView({ orderId }: { orderId: string }) {
  const order = getOrder(orderId);
  const [showRefund, setShowRefund] = useState(false);
  const [showFulfill, setShowFulfill] = useState(false);

  if (!order) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Order not found
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          The order #{orderId} doesn't exist.
        </p>
      </div>
    );
  }

  const customer = getCustomer(order.customerId);
  const currentStepIdx = (() => {
    if (order.status === "delivered") return 5;
    if (order.status === "shipped") return 4;
    if (order.status === "processing") return 2;
    if (order.status === "pending") return 0;
    if (order.status === "refunded") return 5;
    if (order.status === "cancelled") return 0;
    return 1;
  })();

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumb={[
          { href: "/admin/orders", label: "Orders" },
          { label: `#${order.number}` },
        ]}
        title={`Order #${order.number}`}
        description={`Placed ${order.placedAt} · ${order.items.length} item${order.items.length !== 1 ? "s" : ""}`}
        back={{ href: "/admin/orders", label: "Orders" }}
        actions={
          <>
            <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Invoice
            </button>
            <button
              onClick={() => setShowFulfill(true)}
              className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Truck className="w-3.5 h-3.5" />
              Fulfill order
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left: items + timeline */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Status bar */}
          <Section title="Status">
            <div className="flex items-center gap-3 mb-3">
              <OrderStatusBadge status={order.status} />
              <span className="text-sm text-neutral-500">
                {order.paymentStatus === "paid" ? "Payment received" : order.paymentStatus}
              </span>
            </div>
            <ol className="space-y-3">
              {TIMELINE.map((step, i) => {
                const done = i < currentStepIdx;
                const active = i === currentStepIdx;
                return (
                  <li key={step.key} className="flex items-start gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      done ? "bg-success text-white"
                      : active ? "bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                    )}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : active ? <Clock className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className={cn(
                        "text-sm font-semibold",
                        done || active ? "text-neutral-900 dark:text-white" : "text-neutral-500"
                      )}>
                        {step.label}
                      </div>
                      {active && order.status === "processing" && (
                        <div className="text-[11px] text-neutral-500 mt-0.5">Awaiting fulfillment</div>
                      )}
                      {step.key === "placed" && (
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{order.placedAt} 14:23 UTC</div>
                      )}
                      {step.key === "shipped" && order.shippedAt && (
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{order.shippedAt} via DHL Express · tracking #1Z999AA10123456784</div>
                      )}
                      {step.key === "delivered" && order.deliveredAt && (
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{order.deliveredAt}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>

          {/* Items */}
          <Section title={`Items (${order.items.length})`}>
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {order.items.map((it, i) => (
                <li key={i} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {it.name}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      SKU: PWX-{it.productId.padStart(3, "0")} · Qty: {it.qty}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <button className="text-[10px] uppercase tracking-wider font-bold text-primary-600 dark:text-primary-400 hover:underline">
                        View product →
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-neutral-500 tabular-nums">
                      {formatCurrency(it.unitPrice)} × {it.qty}
                    </div>
                    <div className="font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
                      {formatCurrency(it.unitPrice * it.qty)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
              <Row label="Tax" value={formatCurrency(order.tax)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatCurrency(order.shipping)} />
              <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />
              <Row label="Total" value={formatCurrency(order.total)} bold />
            </div>
          </Section>

          {/* Notes */}
          <Section title="Notes" description="Internal notes only — not visible to customer">
            <Textarea
              rows={3}
              placeholder="Add a note about this order…"
              defaultValue="Customer requested gift wrap."
            />
          </Section>
        </div>

        {/* Right: customer, payment, shipping */}
        <div className="space-y-4 lg:space-y-6">
          <Section title="Customer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-xs">
                {order.customerName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <a href={`/admin/customers/${order.customerId}`} className="font-semibold text-sm text-neutral-900 dark:text-white hover:underline truncate block">
                  {order.customerName}
                </a>
                <div className="text-xs text-neutral-500 truncate">{order.customerEmail}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={`mailto:${order.customerEmail}`} className="h-9 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
              <button className="h-9 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
            </div>
            {customer && (
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs">
                <Row label="Orders" value={customer.ordersCount.toString()} />
                <Row label="Lifetime" value={formatCurrency(customer.lifetimeValue)} />
                <Row label="VIP" value={customer.status === "vip" ? "Yes" : "No"} />
              </div>
            )}
          </Section>

          <Section title="Payment">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Visa •••• 4242</div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Charged {order.placedAt}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
              <Row label="Tax" value={formatCurrency(order.tax)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatCurrency(order.shipping)} />
              <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />
              <Row label="Total" value={formatCurrency(order.total)} bold />
              <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />
              <Row label="Captured" value={formatCurrency(order.total)} accent="success" />
            </div>
            <button
              onClick={() => setShowRefund(true)}
              className="mt-4 w-full h-9 rounded-lg bg-error/10 hover:bg-error/15 text-error text-xs font-semibold inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Issue refund
            </button>
          </Section>

          <Section title="Shipping">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-neutral-900 dark:text-white">
                  {order.shippingAddress.city}
                </div>
                <div className="text-xs text-neutral-500">
                  {order.shippingAddress.country} · {order.shippingAddress.zip}
                </div>
                <button className="mt-2 text-[10px] uppercase tracking-wider font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  Edit address
                </button>
              </div>
            </div>
          </Section>

          <Section title="Risk">
            <div className="space-y-1.5 text-xs">
              <Row label="Fraud score" value="Low (8/100)" accent="success" />
              <Row label="IP country" value={order.shippingAddress.country} />
              <Row label="AVS match" value="Yes" accent="success" />
              <Row label="CVV match" value="Yes" accent="success" />
            </div>
          </Section>
        </div>
      </div>

      {/* Fulfill modal */}
      {showFulfill && (
        <Modal title="Fulfill order" onClose={() => setShowFulfill(false)}>
          <div className="space-y-4">
            <Field label="Tracking number">
              <Input placeholder="DHL123456789" />
            </Field>
            <Field label="Carrier">
              <Select>
                <option>DHL Express</option>
                <option>FedEx</option>
                <option>UPS</option>
                <option>USPS</option>
              </Select>
            </Field>
            <Field label="Notify customer">
              <Select defaultValue="yes">
                <option value="yes">Send shipping confirmation email</option>
                <option value="no">Don't notify</option>
              </Select>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowFulfill(false)} className="h-10 px-4 rounded-xl text-sm font-medium">Cancel</button>
              <button
                onClick={() => {
                  setShowFulfill(false);
                  window.dispatchEvent(new CustomEvent("pwx:toast", {
                    detail: { kind: "success", message: "Order marked shipped", description: `Tracking number sent to ${order.customerName}.` }
                  }));
                }}
                className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                Mark as shipped
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Refund modal */}
      {showRefund && (
        <Modal title="Issue refund" onClose={() => setShowRefund(false)}>
          <div className="space-y-4">
            <div className="rounded-xl bg-warning/10 border border-warning/20 p-3 text-sm">
              <strong className="text-warning">Heads up:</strong> This will refund {formatCurrency(order.total)} to the customer's original payment method.
            </div>
            <Field label="Refund amount">
              <Input type="number" step="0.01" defaultValue={order.total} prefix="$" />
            </Field>
            <Field label="Reason" required>
              <Select required>
                <option>Damaged</option>
                <option>Wrong item</option>
                <option>Customer request</option>
                <option>Not received</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Restock">
              <Select defaultValue="yes">
                <option value="yes">Yes — return to inventory</option>
                <option value="no">No — keep as loss</option>
              </Select>
            </Field>
            <Field label="Internal note">
              <Textarea rows={2} placeholder="Why is this being refunded?" />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowRefund(false)} className="h-10 px-4 rounded-xl text-sm font-medium">Cancel</button>
              <button
                onClick={() => {
                  setShowRefund(false);
                  window.dispatchEvent(new CustomEvent("pwx:toast", {
                    detail: { kind: "success", message: "Refund issued", description: `${formatCurrency(order.total)} refunded to ${order.customerName}.` }
                  }));
                }}
                className="h-10 px-5 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error/90 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refund {formatCurrency(order.total)}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: "success" | "neutral" }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-neutral-500", bold && "text-neutral-900 dark:text-white font-semibold")}>
        {label}
      </span>
      <span
        className={cn(
          "tabular-nums",
          bold ? "font-bold text-neutral-900 dark:text-white" : "",
          accent === "success" && "text-success font-semibold"
        )}
      >
        {value}
      </span>
    </div>
  );
}