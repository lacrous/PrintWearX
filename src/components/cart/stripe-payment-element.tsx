"use client";
import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Lock, ShieldCheck, RotateCcw, Loader2, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  createPaymentIntentClient,
  type PaymentIntentResult,
} from "@/lib/payment-client";

/**
 * Stripe Elements Integration
 *
 * - If `VITE_STRIPE_PUBLISHABLE_KEY` env var is set: real Stripe SDK,
 *   PaymentElement renders the live input, calls our server action
 *   `createPaymentIntent` to mint a PaymentIntent, and finalizes
 *   with the returned clientSecret.
 * - If env var missing: demo-mode "Stripe-styled" form (no real charge).
 *
 * To enable REAL charges end-to-end:
 *   1. Set VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
 *   2. Set STRIPE_SECRET_KEY on the server
 *   3. `npm install stripe` (server-side)
 *   4. Uncomment the real call in `app/actions/payment.ts`
 */

const PUBLISHABLE_KEY =
  (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || "";

const stripePromise: Promise<Stripe | null> | null = PUBLISHABLE_KEY
  ? loadStripe(PUBLISHABLE_KEY)
  : null;

interface Props {
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function StripePaymentForm({
  amount,
  currency = "usd",
  onSuccess,
  onCancel,
}: Props) {
  const [intent, setIntent] = useState<PaymentIntentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const initialize = async () => {
    setLoading(true);
    const i = await createPaymentIntentClient(
      [
        {
          productId: "cart",
          quantity: 1,
          unitAmount: Math.round(amount * 100),
        },
      ],
      currency
    );
    setIntent(i);
    setLoading(false);
  };

  if (!stripePromise) {
    // No publishable key → demo mode form (visual)
    return (
      <DemoStripeForm
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }

  // Real Stripe — fetch intent client-side, then render Elements.
  return (
    <>
      {intent === null ? (
        <IntentPicker
          onInitialize={initialize}
          amount={amount}
          currency={currency}
          loading={loading}
        />
      ) : intent.status === "demo" ? (
        <DemoStripeForm
          amount={amount}
          currency={currency}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: intent.clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#007aff",
                borderRadius: "12px",
              },
            },
          }}
        >
          <RealStripeCheckout
            intent={intent}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Elements>
      )}
    </>
  );
}

function IntentPicker({
  onInitialize,
  amount,
  currency,
  loading,
}: {
  onInitialize: () => Promise<void>;
  amount: number;
  currency: string;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-500/30 p-4">
        <div className="flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-500 text-white shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p className="font-semibold text-neutral-900 dark:text-white mb-0.5">
              Ready to pay {formatCurrency(amount)} {currency.toUpperCase()}?
            </p>
            <p>
              Click below to initialize your secure payment session with Stripe.
              No real charge in demo mode (test card 4242 4242 4242 4242).
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onInitialize}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98] transition-all min-h-[56px] disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Initializing…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Initialize payment
          </>
        )}
      </button>
    </div>
  );
}

function RealStripeCheckout({
  intent,
  onSuccess,
  onCancel,
}: {
  intent: PaymentIntentResult;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    // If we're in demo mode (status === 'demo'), simulate success
    if (intent.status === "demo") {
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1200);
      return;
    }

    // Real Stripe: confirm with clientSecret
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed");
      setProcessing(false);
    }
  };

  // Demo mode — no real PaymentElement
  if (intent.status === "demo") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-success/5 border border-success/20 p-4 text-sm text-success">
          <strong>Demo:</strong> Initialize step succeeded. Click "Complete demo payment"
          below to simulate a successful charge.
        </div>
        <button
          onClick={onSubmit}
          disabled={processing}
          className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98] transition-all min-h-[56px] disabled:opacity-50 disabled:pointer-events-none"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Complete demo payment
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full h-12 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Back to cart
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98] transition-all min-h-[56px] disabled:opacity-50 disabled:pointer-events-none"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay {formatCurrency(intent.amount / 100)}
          </>
        )}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full h-12 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Back
        </button>
      )}
    </form>
  );
}

/* ─────────────────────── Demo-mode fallback ─────────────────────── */

function DemoStripeForm({
  amount,
  currency,
  onSuccess,
  onCancel,
}: {
  amount: number;
  currency: string;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = card.replace(/\s/g, "");
    if (digits.length < 13) return setError("Card number too short");
    if (!/^\d{2}\s?\/\s?\d{2}$/.test(exp))
      return setError("Expiration must be MM/YY");
    if (cvc.length < 3) return setError("CVC must be 3-4 digits");
    if (!name.trim()) return setError("Cardholder name required");
    if (!zip.trim()) return setError("ZIP / postal code required");

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1600);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-2xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-500/30 p-4">
        <div className="flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-500 text-white shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p className="font-semibold text-neutral-900 dark:text-white mb-0.5">
              Demo mode
            </p>
            <p>
              No <code className="font-mono text-[10px] bg-white/40 dark:bg-black/30 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code>{" "}
              set. The form below uses Stripe-styling but doesn't actually
              charge. Set the env var to enable real Stripe Elements.
            </p>
            <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              Test card: <code className="font-mono">4242 4242 4242 4242</code>
            </p>
          </div>
        </div>
      </div>

      <Field label="Card number">
        <CreditCardInput value={card} onChange={setCard} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Expiration">
          <input
            value={exp}
            onChange={(e) => setExp(formatExp(e.target.value))}
            placeholder="MM / YY"
            inputMode="numeric"
            className="input"
          />
        </Field>
        <Field label="CVC">
          <input
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
            }
            placeholder="123"
            inputMode="numeric"
            className="input"
          />
        </Field>
        <Field label="ZIP">
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="10001"
            className="input"
          />
        </Field>
      </div>
      <Field label="Cardholder name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="input"
        />
      </Field>

      {error && (
        <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={processing}
        className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98] transition-all min-h-[56px] disabled:opacity-50 disabled:pointer-events-none"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing secure payment…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay {formatCurrency(amount)} {currency.toUpperCase()}
          </>
        )}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full h-12 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Back to cart
        </button>
      )}
      <style>{`
        .input {
          width: 100%;
          height: 48px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgb(212 212 212);
          background: white;
          color: #111;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #007aff;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.25);
        }
        html.dark .input {
          background: rgb(23 23 23);
          border-color: rgb(64 64 64);
          color: #f5f5f5;
        }
      `}</style>
      <TrustRow />
    </form>
  );
}

function CreditCardInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 19);
    const groups = digits.match(/.{1,4}/g);
    onChange(groups ? groups.join(" ") : digits);
  };
  const d = value.replace(/\s/g, "");
  const brand =
    /^4/.test(d)
      ? "VISA"
      : /^5[1-5]/.test(d) || /^2[2-7]/.test(d)
        ? "MC"
        : /^3[47]/.test(d)
          ? "AMEX"
          : /^6/.test(d)
            ? "DISC"
            : null;

  return (
    <div className="relative">
      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <input
        value={value}
        onChange={handle}
        placeholder="1234 1234 1234 1234"
        inputMode="numeric"
        autoComplete="cc-number"
        className="input pl-11 pr-16"
      />
      {brand && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
          {brand}
        </span>
      )}
    </div>
  );
}

function formatExp(v: string): string {
  const digits = v.replace(/[^0-9]/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + " / " + digits.slice(2);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function TrustRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400 pt-2">
      <div className="flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        <span>256-bit SSL</span>
      </div>
      <span className="opacity-30">·</span>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span>Powered by Stripe</span>
      </div>
      <span className="opacity-30">·</span>
      <div className="flex items-center gap-1.5">
        <RotateCcw className="w-3.5 h-3.5 text-success" />
        <span>30-day refunds</span>
      </div>
    </div>
  );
}
