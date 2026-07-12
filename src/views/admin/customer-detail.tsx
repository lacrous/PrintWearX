"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  AlertCircle,
  Crown,
  Tag as TagIcon,
  Send,
  MoreHorizontal,
  Plus,
  Edit3,
} from "lucide-react";
import {
  getCustomer,
  getCustomerOrders,
  getCustomerAddresses,
} from "@/lib/admin-models";
import { PageHeader, Section, Field, Textarea, Input, Select } from "@/components/admin/form";
import { cn, formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/views/admin/dashboard";

export function CustomerDetailView({ customerId }: { customerId: string }) {
  const customer = getCustomer(customerId);
  if (!customer) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Customer not found
        </h1>
      </div>
    );
  }

  const customerOrders = getCustomerOrders(customer.id);
  const customerAddresses = getCustomerAddresses(customer.id);
  const initials = customer.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumb={[
          { href: "/admin/customers", label: "Customers" },
          { label: customer.name },
        ]}
        title={customer.name}
        description={`Joined ${customer.joinedAt} · ${customer.email}`}
        back={{ href: "/admin/customers", label: "Customers" }}
        actions={
          <>
            <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Email
            </button>
            <button className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30">
              <Edit3 className="w-3.5 h-3.5" />
              Edit customer
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat icon={ShoppingBag} label="Orders" value={customer.ordersCount.toString()} />
            <Stat icon={DollarSign} label="Lifetime value" value={formatCurrency(customer.lifetimeValue)} accent="success" />
            <Stat icon={DollarSign} label="Avg order" value={formatCurrency(customer.avgOrderValue)} />
            <Stat icon={Calendar} label="Last order" value={customer.lastOrderAt} />
          </div>

          {/* Order history */}
          <Section title="Order history" description={`${customerOrders.length} orders`}>
            {customerOrders.length === 0 ? (
              <div className="py-8 text-center text-sm text-neutral-500">
                No orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto -mx-5 sm:-mx-6">
                <table className="w-full text-sm">
                  <thead className="text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      <th className="px-5 sm:px-6 py-2 text-left font-bold">Order</th>
                      <th className="px-5 sm:px-6 py-2 text-left font-bold hidden md:table-cell">Date</th>
                      <th className="px-5 sm:px-6 py-2 text-right font-bold">Total</th>
                      <th className="px-5 sm:px-6 py-2 text-right font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((o) => (
                      <tr key={o.id} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                        <td className="px-5 sm:px-6 py-3">
                          <a href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-primary-600 dark:text-primary-400 hover:underline text-xs">
                            #{o.number}
                          </a>
                        </td>
                        <td className="px-5 sm:px-6 py-3 hidden md:table-cell text-xs text-neutral-500">
                          {o.placedAt}
                        </td>
                        <td className="px-5 sm:px-6 py-3 text-right font-bold tabular-nums">
                          {formatCurrency(o.total)}
                        </td>
                        <td className="px-5 sm:px-6 py-3 text-right">
                          <OrderStatusBadge status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Timeline / Activity */}
          <Section title="Recent activity">
            <ol className="space-y-3 text-sm">
              <Event
                date="2026-07-03 18:42"
                icon={Mail}
                label="Received abandoned cart email"
              />
              <Event
                date="2026-07-02 16:23"
                icon={ShoppingBag}
                label="Placed order #PWX-100248"
                amount={485.99}
              />
              <Event
                date="2026-07-01 09:11"
                icon={Send}
                label="Opened welcome series email"
              />
              <Event
                date="2026-06-29 14:00"
                icon={TagIcon}
                label="Subscribed to VIP list"
              />
              <Event
                date={customer.joinedAt}
                icon={Calendar}
                label="Signed up"
              />
            </ol>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Profile card */}
          <Section title="Profile">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm",
                customer.status === "vip" ? "bg-gradient-to-br from-amber-500 to-orange-600"
                : customer.status === "at_risk" ? "bg-gradient-to-br from-warning to-orange-500"
                : customer.status === "blocked" ? "bg-gradient-to-br from-error to-red-700"
                : "bg-gradient-to-br from-primary-500 to-primary-700"
              )}>
                {customer.status === "vip" ? <Crown className="w-6 h-6" /> : initials}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-base text-neutral-900 dark:text-white truncate">
                  {customer.name}
                </div>
                <div className="text-xs text-neutral-500 truncate">{customer.email}</div>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <Row icon={Mail} label="Email" value={customer.email} />
              <Row icon={Calendar} label="Joined" value={customer.joinedAt} />
              <Row icon={ShoppingBag} label="Last order" value={customer.lastOrderAt} />
            </div>
            <Field label="Status">
              <Select defaultValue={customer.status}>
                <option value="vip">VIP</option>
                <option value="active">Active</option>
                <option value="at_risk">At-risk</option>
                <option value="blocked">Blocked</option>
              </Select>
            </Field>
            <Field label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((t) => (
                  <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium">
                    {t}
                  </span>
                ))}
                <button className="inline-flex items-center px-2.5 py-1 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 text-xs font-medium hover:border-primary-500 hover:text-primary-500">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </button>
              </div>
            </Field>
          </Section>

          {/* Addresses */}
          <Section title="Addresses" headerAction={
            <button className="text-[10px] uppercase tracking-wider font-bold text-primary-600 dark:text-primary-400 hover:underline">
              + Add
            </button>
          }>
            {customerAddresses.length === 0 ? (
              <div className="py-4 text-center text-sm text-neutral-500">
                No addresses on file.
              </div>
            ) : (
              <ul className="space-y-3">
                {customerAddresses.map((a) => (
                  <li key={a.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
                        {a.type}
                      </span>
                      {a.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      {a.fullName}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {a.line1}{a.line2 ? `, ${a.line2}` : ""}
                      <br />
                      {a.city}, {a.region} {a.zip}, {a.country}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Internal note */}
          <Section title="Internal note">
            <Textarea
              rows={3}
              placeholder="Add a note only visible to staff…"
              defaultValue="VIP customer — prioritise shipping. Prefers brown paper packaging."
            />
          </Section>
        </div>
      </div>
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
  accent?: "success";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
          {label}
        </span>
      </div>
      <div className={cn(
        "text-lg sm:text-xl font-bold tabular-nums",
        accent === "success" ? "text-success" : "text-neutral-900 dark:text-white"
      )}>
        {value}
      </div>
    </motion.div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-900 dark:text-white font-medium ml-auto truncate">{value}</span>
    </div>
  );
}

function Event({ date, icon: Icon, label, amount }: { date: string; icon: React.ComponentType<{ className?: string }>; label: string; amount?: number }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-neutral-900 dark:text-white font-medium">
          {label}
          {amount !== undefined && <span className="ml-2 font-bold tabular-nums">{formatCurrency(amount)}</span>}
        </div>
        <div className="text-[11px] text-neutral-500 font-mono">{date}</div>
      </div>
    </li>
  );
}