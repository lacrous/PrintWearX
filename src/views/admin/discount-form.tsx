"use client";

import { useState } from "react";
import {
  Save,
  Eye,
  Copy,
  Tag as TagIcon,
  Sparkles,
  Calendar,
  ShoppingBag,
  Users,
  Percent,
  DollarSign,
} from "lucide-react";
import {
  Field,
  FormRow,
  Section,
  Input,
  Select,
  Toggle,
  Textarea,
  PageHeader,
} from "@/components/admin/form";
import { discountCodes } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

interface Props {
  discountId?: string;
}

export function DiscountFormView({ discountId }: Props) {
  const existing = discountId ? discountCodes.find((d) => d.id === discountId) : null;
  const isEdit = !!existing;
  const [type, setType] = useState<"percent" | "fixed">(existing?.type ?? "percent");
  const [code, setCode] = useState(existing?.code ?? "");
  const [value, setValue] = useState(existing?.value ?? 10);
  const [appliesTo, setAppliesTo] = useState<"all" | "categories" | "products">("all");
  const [eligibleCustomers, setEligibleCustomers] = useState<"all" | "vip" | "specific">("all");
  const [usageLimit, setUsageLimit] = useState<"unlimited" | "once_per_customer" | "limited">("unlimited");

  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
    setCode(s);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("pwx:toast", {
          detail: {
            kind: "success",
            message: isEdit ? `Discount ${existing?.code} updated` : "Discount code activated",
            description: isEdit ? "Changes are live." : `Code ${code || "YOUR-CODE"} is now redeemable.`,
          }
        }));
      }}
      className="space-y-6 pb-24"
    >
      <PageHeader
        breadcrumb={[
          { href: "/admin/marketing", label: "Marketing" },
          { label: isEdit ? `Edit ${existing?.code}` : "New discount" },
        ]}
        title={isEdit ? `Edit ${existing?.code}` : "New discount code"}
        description={isEdit ? `Created ${existing?.startsAt} · ${existing?.uses} of ${existing?.limit} used` : "Create a promo code to drive sales"}
        back={{ href: "/admin/marketing", label: "Marketing" }}
        actions={
          <>
            {isEdit && (
              <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            )}
            <button
              type="button"
              className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5"
            >
              Save draft
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Save className="w-3.5 h-3.5" />
              {isEdit ? "Save changes" : "Activate code"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Section title="Code" description="The promo code customers enter at checkout">
            <Field label="Discount type" required>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("percent")}
                  className={cn(
                    "flex items-center gap-3 h-12 px-4 rounded-xl border-2 text-left transition-all",
                    type === "percent"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  <Percent className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-sm font-semibold">Percentage</div>
                    <div className="text-[11px] text-neutral-500">% off subtotal</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setType("fixed")}
                  className={cn(
                    "flex items-center gap-3 h-12 px-4 rounded-xl border-2 text-left transition-all",
                    type === "fixed"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  <DollarSign className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-sm font-semibold">Fixed amount</div>
                    <div className="text-[11px] text-neutral-500">$ off subtotal</div>
                  </div>
                </button>
              </div>
            </Field>
            <FormRow>
              <Field label="Code" required description="Customers enter this at checkout">
                <div className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25"
                    className="font-mono uppercase font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={generate}
                    className="h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold inline-flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate
                  </button>
                </div>
              </Field>
              <Field label="Value" required>
                <Input
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  prefix={type === "percent" ? "" : "$"}
                  suffix={type === "percent" ? "% off" : "off"}
                  required
                />
              </Field>
            </FormRow>
          </Section>

          <Section title="Applies to" description="Limit which products can use this code">
            <Field label="Products">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(["all", "categories", "products"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAppliesTo(opt)}
                    className={cn(
                      "h-10 px-3 rounded-xl border-2 text-xs font-semibold capitalize transition-all",
                      appliesTo === opt
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    )}
                  >
                    {opt === "all" ? "All products" : opt}
                  </button>
                ))}
              </div>
            </Field>
            {appliesTo === "categories" && (
              <Field label="Categories" description="Pick the categories this code applies to">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["T-Shirts", "Hoodies", "Crewnecks", "Long-Sleeves", "Caps", "Totes"].map((c) => (
                    <label key={c} className="flex items-center gap-2 h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer text-sm">
                      <input type="checkbox" defaultChecked={c === "T-Shirts"} className="w-4 h-4 rounded text-primary-500" />
                      <span className="font-medium">{c}</span>
                    </label>
                  ))}
                </div>
              </Field>
            )}
            {appliesTo === "products" && (
              <Field label="Specific products">
                <div className="relative">
                  <Input placeholder="Search products…" prefix="" />
                </div>
                <p className="text-xs text-neutral-500 mt-1.5">Pick individual products to include.</p>
              </Field>
            )}
            <Field label="Minimum order" description="Cart must reach this amount before the code applies">
              <Input type="number" step="0.01" placeholder="0.00" prefix="$" defaultValue={existing?.minOrder} />
            </Field>
          </Section>

          <Section title="Eligibility" description="Limit which customers can use this code">
            <Field label="Customer groups">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(["all", "vip", "specific"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEligibleCustomers(opt)}
                    className={cn(
                      "h-10 px-3 rounded-xl border-2 text-xs font-semibold transition-all",
                      eligibleCustomers === opt
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    )}
                  >
                    {opt === "all" ? "All customers" : opt === "vip" ? "VIP only" : "Specific customers"}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Usage limits">
            <Field label="Usage limit">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(["unlimited", "once_per_customer", "limited"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setUsageLimit(opt)}
                    className={cn(
                      "h-10 px-3 rounded-xl border-2 text-xs font-semibold transition-all",
                      usageLimit === opt
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    )}
                  >
                    {opt === "unlimited" ? "Unlimited" : opt === "once_per_customer" ? "Once / customer" : "Limited total"}
                  </button>
                ))}
              </div>
            </Field>
            {usageLimit === "limited" && (
              <Field label="Total uses allowed">
                <Input type="number" placeholder="1000" defaultValue={existing?.limit} />
              </Field>
            )}
          </Section>

          <Section title="Active dates">
            <FormRow>
              <Field label="Starts at">
                <Input type="date" defaultValue={existing?.startsAt} />
              </Field>
              <Field label="Ends at">
                <Input type="date" defaultValue={existing?.endsAt} />
              </Field>
            </FormRow>
          </Section>
        </div>

        {/* Preview card */}
        <div className="space-y-4 lg:space-y-6">
          <Section title="Customer preview">
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 p-5 text-white">
              <div className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">
                Your promo code
              </div>
              <div className="font-mono text-2xl font-bold tracking-wider mb-3">
                {code || "YOUR-CODE"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TagIcon className="w-4 h-4" />
                {type === "percent" ? `${value}% off` : `$${value} off`} your order
              </div>
              {value > 0 && (
                <div className="mt-3 text-xs opacity-90">
                  Example: ${(99).toFixed(2)} order → <strong>${(99 * (1 - (type === "percent" ? value / 100 : 0))).toFixed(2)}</strong>
                </div>
              )}
            </div>
          </Section>

          {isEdit && (
            <Section title="Performance">
              <div className="space-y-3">
                <Metric label="Times used" value={existing!.uses.toString()} />
                <Metric label="Revenue generated" value={`$${(existing!.uses * 38.5).toFixed(0)}`} />
                <Metric label="Avg discount" value="$14.20" />
                <Metric label="Conversion" value="11.4%" />
              </div>
            </Section>
          )}
        </div>
      </div>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-bold tabular-nums text-neutral-900 dark:text-white">{value}</span>
    </div>
  );
}