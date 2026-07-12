"use client";
import { motion } from "framer-motion";
import { Link, useNavigate } from "@/lib/nav";
import {
  Lock,
  ShieldCheck,
  RotateCcw,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ImageOrFallback } from "@/components/ui/image-fallback";
import { useCart } from "@/lib/store";
import { getProductsByIds } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { StripePaymentForm } from "@/components/cart/stripe-payment-element";

const TAX_RATE = 0.08;

type PaymentMethod = "card" | "paypal" | "apple";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardName: string;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cardName: "",
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, isHydrated } = useCart();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [shippingSubmitted, setShippingSubmitted] = useState(false);

  const cartProducts = getProductsByIds(items.map((i) => i.id));
  const subtotal = cartProducts.reduce(
    (acc, p) =>
      acc + p.price * (items.find((i) => i.id === p.id)?.quantity ?? 0),
    0
  );
  const shippingCost =
    shipping === "standard" ? 0 : shipping === "express" ? 19.99 : 39.99;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-neutral-900 dark:text-white">
          Nothing to checkout
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          Your cart is empty. Add some products before checking out.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
        >
          Start shopping
        </button>
      </main>
    );
  }

  const validateShipping = (): boolean => {
    const required: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zip",
    ];
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    required.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onContinueToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!validateShipping()) return;
    setShippingSubmitted(true);
    // Smooth scroll to payment
    setTimeout(() => {
      document
        .getElementById("payment-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const onPaymentSuccess = () => {
    clearCart();
    navigate("/order-success");
  };

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-500 dark:text-primary-400">
            PrintWearX
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {["Shipping", "Payment", "Review"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                    i === (shippingSubmitted ? 1 : 0)
                      ? "bg-primary-500 text-white"
                      : i < (shippingSubmitted ? 1 : 0)
                        ? "bg-success text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                  )}
                  aria-current={
                    i === (shippingSubmitted ? 1 : 0) ? "step" : undefined
                  }
                >
                  {i < (shippingSubmitted ? 1 : 0) ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    i === (shippingSubmitted ? 1 : 0)
                      ? "text-primary-600 dark:text-primary-400"
                      : i < (shippingSubmitted ? 1 : 0)
                        ? "text-success"
                        : "text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                  Shipping Information
                </h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="First Name" required error={errors.firstName}>
                      <Input
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        error={errors.firstName}
                        placeholder="John"
                      />
                    </Field>
                    <Field label="Last Name" required error={errors.lastName}>
                      <Input
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        error={errors.lastName}
                        placeholder="Doe"
                      />
                    </Field>
                  </div>
                  <Field label="Email Address" required error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      error={errors.email}
                      placeholder="john.doe@example.com"
                    />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone}>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      error={errors.phone}
                      placeholder="+1 (555) 123-4567"
                    />
                  </Field>
                  <Field label="Address" required error={errors.address}>
                    <Input
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      error={errors.address}
                      placeholder="123 Main Street"
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="City" required error={errors.city}>
                      <Input
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        error={errors.city}
                        placeholder="New York"
                      />
                    </Field>
                    <Field label="State" required error={errors.state}>
                      <SelectInput
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                        error={errors.state}
                        placeholder="Select state"
                        options={["NY", "CA", "TX", "FL", "WA", "IL"]}
                      />
                    </Field>
                    <Field label="ZIP Code" required error={errors.zip}>
                      <Input
                        value={form.zip}
                        onChange={(e) =>
                          setForm({ ...form, zip: e.target.value })
                        }
                        error={errors.zip}
                        placeholder="10001"
                      />
                    </Field>
                  </div>
                </div>
              </motion.section>

              {/* Shipping method */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-5">
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: 0 },
                    { id: "express", label: "Express Shipping", sub: "2–3 business days", price: 19.99 },
                    { id: "overnight", label: "Next Day Delivery", sub: "1 business day", price: 39.99 },
                  ].map((option) => {
                    const isActive = shipping === option.id;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[56px]",
                          isActive
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-500/50"
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={isActive}
                          onChange={() => setShipping(option.id)}
                          className="w-4 h-4 accent-primary-500"
                        />
                        <div className="flex-1 flex justify-between items-center gap-3">
                          <div>
                            <p className="font-semibold text-neutral-900 dark:text-white">
                              {option.label}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {option.sub}
                            </p>
                          </div>
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {option.price === 0 ? "Free" : formatCurrency(option.price)}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </motion.section>

              {!shippingSubmitted && (
                <div className="flex justify-end">
                  <button
                    onClick={onContinueToPayment}
                    className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98] transition-all min-h-[56px]"
                  >
                    Continue to payment
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Payment */}
              {shippingSubmitted && (
                <motion.section
                  id="payment-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800"
                >
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-5">
                    Payment Information
                  </h2>

                  <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6">
                    <div role="tablist" className="flex gap-6 overflow-x-auto">
                      {[
                        { id: "card", label: "Credit Card" },
                        { id: "paypal", label: "PayPal" },
                        { id: "apple", label: "Apple Pay" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          role="tab"
                          aria-selected={payment === tab.id}
                          onClick={() => setPayment(tab.id as PaymentMethod)}
                          type="button"
                          className={cn(
                            "py-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                            payment === tab.id
                              ? "border-primary-500 text-primary-600 dark:text-primary-400"
                              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {payment === "card" && (
                    <StripePaymentForm
                      amount={total}
                      onSuccess={onPaymentSuccess}
                      onCancel={() => setShippingSubmitted(false)}
                    />
                  )}
                  {payment === "paypal" && (
                    <div className="text-center py-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        You'll be redirected to PayPal to complete your purchase securely.
                      </p>
                      <button
                        onClick={onPaymentSuccess}
                        className="mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#0070ba] text-white font-medium hover:bg-[#005ea6] transition-colors"
                      >
                        Continue with PayPal
                      </button>
                    </div>
                  )}
                  {payment === "apple" && (
                    <div className="text-center py-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Confirm with Touch ID or Face ID to complete your purchase.
                      </p>
                      <button
                        onClick={onPaymentSuccess}
                        className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
                      >
                         Pay with Apple Pay
                      </button>
                    </div>
                  )}
                </motion.section>
              )}
            </div>

            {/* Order summary */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-5">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    {cartProducts.map((product) => {
                      const item = items.find((i) => i.id === product.id);
                      return (
                        <div key={product.id} className="flex items-center gap-3">
                          <ImageOrFallback
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Qty: {item?.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(product.price * (item?.quantity ?? 0))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-2.5 text-sm">
                  <Row label="Subtotal" value={formatCurrency(subtotal)} />
                  <Row
                    label="Shipping"
                    value={
                      <span className={shippingCost === 0 ? "text-success font-semibold" : "font-semibold text-neutral-900 dark:text-white"}>
                        {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
                      </span>
                    }
                  />
                  <Row label="Tax" value={formatCurrency(tax)} />
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 mt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-neutral-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-success" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-success" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div data-error={error ? "true" : undefined}>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  error,
  placeholder,
  options,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: boolean;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "w-full h-12 px-4 rounded-xl border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-base transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
        error ? "border-error" : "border-neutral-300 dark:border-neutral-700"
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-semibold text-neutral-900 dark:text-white">{value}</span>
    </div>
  );
}
