"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Globe,
  CreditCard,
  Truck,
  Percent,
  Users,
  Building2,
  Bell,
  Lock,
  CheckCircle2,
  Smartphone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "general", label: "General", icon: Building2 },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "tax", label: "Tax", icon: Percent },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
] as const;

const TEAM = [
  { name: "Hassan El-Deghidy", email: "hassan@nurovia.dev", role: "Owner", avatar: "HE", status: "active" },
  { name: "Maya Singh", email: "maya@printwearx.com", role: "Content manager", avatar: "MS", status: "active" },
  { name: "Lucas Park", email: "lucas@printwearx.com", role: "Fulfillment", avatar: "LP", status: "active" },
  { name: "Amara Okonkwo", email: "amara@printwearx.com", role: "Customer support", avatar: "AO", status: "pending" },
];

export function SettingsView() {
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Configure your store, payments, shipping, and team
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 shrink-0">
          <nav className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-2 space-y-0.5 lg:sticky lg:top-20">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-colors text-left",
                    section === s.id
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 space-y-6 min-w-0">
          {section === "general" && <GeneralSection />}
          {section === "payments" && <PaymentsSection />}
          {section === "shipping" && <ShippingSection />}
          {section === "tax" && <TaxSection />}
          {section === "team" && <TeamSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "security" && <SecuritySection />}

          <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-t border-neutral-200 dark:border-neutral-800">
            <button className="h-10 px-4 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Cancel
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("pwx:toast", {
                detail: { kind: "success", message: "Settings saved", description: "Changes applied across your store." }
              }))}
              className="h-10 px-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Save className="w-4 h-4" />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  headerAction,
  children,
}: {
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h2>
          {description && (
            <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
        {headerAction}
      </div>
      {children}
    </motion.section>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-3 sm:py-4 border-t border-neutral-100 dark:border-neutral-800 first:border-0 first:pt-0 grid sm:grid-cols-3 gap-2 sm:gap-6">
      <div>
        <label className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</label>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function Input({ defaultValue, placeholder, suffix }: { defaultValue?: string; placeholder?: string; suffix?: string }) {
  return (
    <div className="relative">
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">
          {suffix}
        </span>
      )}
    </div>
  );
}

function GeneralSection() {
  return (
    <>
      <Section title="Store information" description="Public-facing details about your store">
        <Field label="Store name">
          <Input defaultValue="PrintWearX" />
        </Field>
        <Field label="Tagline" description="Shown in headers and search results">
          <Input defaultValue="Premium Print & Apparel" />
        </Field>
        <Field label="Contact email">
          <Input defaultValue="hello@printwearx.com" />
        </Field>
        <Field label="Support phone">
          <Input defaultValue="+1 (555) 010-2026" />
        </Field>
        <Field label="Currency">
          <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent text-sm">
            <option>USD — US Dollar</option>
            <option>EUR — Euro</option>
            <option>GBP — British Pound</option>
            <option>EGP — Egyptian Pound</option>
          </select>
        </Field>
      </Section>

      <Section title="Localization" description="Default language, timezone, units">
        <Field label="Default language">
          <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent text-sm">
            <option>English (US)</option>
            <option>Arabic</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent text-sm">
            <option>America/New_York (UTC-5)</option>
            <option>Europe/London (UTC+0)</option>
            <option>Asia/Cairo (UTC+2)</option>
          </select>
        </Field>
      </Section>
    </>
  );
}

function PaymentsSection() {
  return (
    <>
      <Section title="Payment providers" description="Stripe is connected and processing test payments">
        <Provider name="Stripe" status="active" detail="acct_1Nx•••2026 · USD · Visa, Mastercard, AMEX, Apple Pay, Google Pay" />
        <Provider name="PayPal" status="inactive" detail="Connect PayPal to accept PayPal, Pay in 4, and Venmo" />
        <Provider name="Apple Pay" status="active" detail="Enabled via Stripe — works on Safari and iOS" />
        <Provider name="Crypto (USDC)" status="inactive" detail="Accept USDC on Base, Polygon, Solana" />
      </Section>

      <Section title="Payment settings">
        <Field label="Capture method" description="When to capture payment on orders">
          <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent text-sm">
            <option>Automatic — capture immediately</option>
            <option>Manual — capture on fulfillment</option>
          </select>
        </Field>
        <Field label="Statement descriptor" description="What customers see on their card statement">
          <Input defaultValue="PRINTWEARX" suffix="22 chars max" />
        </Field>
      </Section>
    </>
  );
}

function ShippingSection() {
  return (
    <Section title="Shipping zones" description="Set rates per region">
      <ZoneRow zone="Domestic (US)" rate="Free over $50 · $5.99 standard · $14.99 express" days="2-5 days" />
      <ZoneRow zone="Europe" rate="$9.99 flat · Free over $100" days="5-8 days" />
      <ZoneRow zone="UK" rate="$12.99 flat · Free over $120" days="4-7 days" />
      <ZoneRow zone="MENA" rate="$14.99 flat · Free over $120" days="6-10 days" />
      <ZoneRow zone="Rest of world" rate="$24.99 flat" days="10-15 days" />
    </Section>
  );
}

function TaxSection() {
  return (
    <Section title="Tax configuration" description="Auto-calculated via Stripe Tax">
      <Provider name="Stripe Tax" status="active" detail="Calculating tax for US, EU, UK, MENA · Rates updated daily" />
      <Field label="Tax display" description="Show prices with or without tax">
        <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent text-sm">
          <option>Show prices excluding tax</option>
          <option>Show prices including tax</option>
          <option>Show both</option>
        </select>
      </Field>
    </Section>
  );
}

function TeamSection() {
  return (
    <Section
      title="Team members"
      description="Invite teammates and assign roles"
      headerAction={
        <button className="h-9 px-3 rounded-lg bg-primary-500 text-white text-xs font-semibold">
          Invite member
        </button>
      }
    >
      <ul className="space-y-2">
        {TEAM.map((m) => (
          <li
            key={m.email}
            className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-xs">
              {m.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                {m.name}
              </div>
              <div className="text-xs text-neutral-500 truncate">{m.email}</div>
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hidden sm:inline">
              {m.role}
            </span>
            {m.status === "pending" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-warning/10 text-warning border border-warning/20">
                Pending
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function NotificationsSection() {
  const channels = [
    { id: "email", label: "Email", desc: "Get notifications at hello@printwearx.com", icon: Mail },
    { id: "sms", label: "SMS", desc: "Get SMS at +1 (555) 010-2026", icon: Smartphone },
    { id: "push", label: "Push", desc: "Browser push notifications", icon: Bell },
  ];
  const events = [
    { id: "new_order", label: "New order placed", def: true },
    { id: "low_stock", label: "Low stock alert", def: true },
    { id: "refund", label: "Refund requested", def: true },
    { id: "review", label: "New review submitted", def: false },
    { id: "customer_signup", label: "New customer signup", def: false },
  ];

  return (
    <>
      <Section title="Notification channels">
        <div className="space-y-2">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className="text-xs text-neutral-500">{c.desc}</div>
                </div>
                <Toggle defaultChecked />
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Events">
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {events.map((e) => (
            <li key={e.id} className="py-3 flex items-center justify-between">
              <span className="text-sm font-medium">{e.label}</span>
              <Toggle defaultChecked={e.def} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function SecuritySection() {
  return (
    <>
      <Section title="Security">
        <Field label="Two-factor authentication" description="Require 2FA for all admin sign-ins">
          <Toggle defaultChecked />
        </Field>
        <Field label="Session timeout" description="Auto-sign-out after inactivity">
          <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-transparent text-sm">
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>4 hours</option>
            <option>Never</option>
          </select>
        </Field>
        <Field label="IP allowlist" description="Restrict admin access to specific IPs">
          <Input placeholder="e.g. 192.168.1.0/24" />
        </Field>
      </Section>

      <Section title="Activity log" description="Recent security events">
        <ul className="space-y-2">
          <Log time="Just now" event="Admin sign-in from New York, NY" actor="Hassan E." />
          <Log time="2 hours ago" event="Password changed" actor="Hassan E." />
          <Log time="Yesterday" event="2FA enabled" actor="Hassan E." />
          <Log time="3 days ago" event="API key rotated" actor="system" />
        </ul>
      </Section>
    </>
  );
}

function Provider({ name, status, detail }: { name: string; status: "active" | "inactive"; detail: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 mb-2">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        status === "active"
          ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white"
          : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"
      )}>
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-neutral-500">{detail}</div>
      </div>
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
        status === "active"
          ? "bg-success/10 text-success border-success/20"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700"
      )}>
        {status === "active" ? "Connected" : "Not connected"}
      </span>
    </div>
  );
}

function ZoneRow({ zone, rate, days }: { zone: string; rate: string; days: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 mb-2">
      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
        <Globe className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{zone}</div>
        <div className="text-xs text-neutral-500">{rate}</div>
      </div>
      <div className="text-xs text-neutral-500 font-mono shrink-0">{days}</div>
    </div>
  );
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        "relative inline-flex items-center w-10 h-6 rounded-full transition-colors",
        on ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700"
      )}
      role="switch"
      aria-checked={on}
    >
      <span
        className={cn(
          "inline-block w-5 h-5 bg-white rounded-full shadow transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Log({ time, event, actor }: { time: string; event: string; actor: string }) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
      <div className="flex-1">
        <div className="text-neutral-900 dark:text-white font-medium">{event}</div>
        <div className="text-xs text-neutral-500 mt-0.5">
          {actor} · {time}
        </div>
      </div>
    </li>
  );
}