"use client";
import { Link } from "@/lib/nav";
import { useState, type FormEvent } from "react";
import {
  Sparkles,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Github,
  Globe,
  Send,
  Check,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const shopLinks = [
  { label: "New arrivals", href: "/shop?sort=newest" },
  { label: "Best sellers", href: "/shop" },
  { label: "T-Shirts", href: "/shop?category=T-Shirts" },
  { label: "Hoodies", href: "/shop?category=Hoodies" },
  { label: "Crewnecks", href: "/shop?category=Crewnecks" },
  { label: "Accessories", href: "/shop?category=Caps" },
  { label: "Sale", href: "/shop?sort=deals" },
];

const supportLinks = [
  { label: "Help center", href: "#" },
  { label: "Order tracking", href: "#" },
  { label: "Shipping info", href: "#" },
  { label: "Returns & refunds", href: "#" },
  { label: "Size guide", href: "#" },
  { label: "Contact us", href: "#" },
];

const companyLinks = [
  { label: "About PrintWearX", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Press", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Affiliate program", href: "#" },
  { label: "Gift cards", href: "#" },
];

const legalLinks = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Sitemap", href: "#" },
];

const paymentMethods = [
  { label: "Visa", bg: "bg-[#1A1F71]" },
  { label: "MC", bg: "bg-[#EB001B]" },
  { label: "Amex", bg: "bg-[#2E77BC]" },
  { label: "PayPal", bg: "bg-[#003087]" },
  { label: "Apple Pay", bg: "bg-black" },
  { label: "GP", bg: "bg-[#4285F4]" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-neutral-950 dark:bg-black text-white relative overflow-hidden">
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />

      {/* Newsletter hero */}
      <section className="relative border-b border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
                <Sparkles className="w-3 h-3" />
                Members get 15% off their first order
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-3">
                Don't miss a drop.
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-400 bg-clip-text text-transparent gradient-text">
                  Stay in the loop.
                </span>
              </h2>
              <p className="text-neutral-400 max-w-xl leading-relaxed">
                Early access to new arrivals, member-only deals, and the stories
                behind the products. One email a week, max.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="w-full max-w-md lg:ml-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full h-12 sm:h-14 pl-11 pr-4 rounded-xl bg-transparent text-white placeholder:text-neutral-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/30 min-h-[44px] whitespace-nowrap"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4" strokeWidth={3} />
                      You're in
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                By subscribing you agree to our{" "}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(
                        new CustomEvent("pwx:toast", {
                          detail: {
                            message: "Privacy policy coming soon",
                            type: "info",
                          },
                        })
                      );
                    }
                  }}
                  className="underline hover:text-neutral-300 cursor-pointer"
                >
                  Privacy Policy
                </button>
                . Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Main link columns */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  PrintWearX
                </span>
              </Link>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-xs">
                Curated picks, honest pricing, fast shipping. Built for the
                way you actually shop.
              </p>

              {/* Social */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { Icon: Twitter, label: "Twitter", href: "#" },
                  { Icon: Facebook, label: "Facebook", href: "#" },
                  { Icon: Instagram, label: "Instagram", href: "#" },
                  { Icon: Youtube, label: "YouTube", href: "#" },
                  { Icon: Github, label: "GitHub", href: "#" },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* App download badges (visual) */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Get the app
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-white text-neutral-900 text-xs font-medium hover:bg-neutral-100 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    App Store
                  </button>
                  <button className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-white text-neutral-900 text-xs font-medium hover:bg-neutral-100 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199 2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.119 12l2.579-2.492zM5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.635z" />
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
            </div>

            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Company" links={companyLinks} />

            {/* Contact column */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Get in touch
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  <a
                    href="mailto:hello@printwearx.com"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    hello@printwearx.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  <a
                    href="tel:+15551234567"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  <span className="text-neutral-300">
                    100 Market Street
                    <br />
                    San Francisco, CA 94105
                  </span>
                </li>
              </ul>

              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-6 mb-3">
                Hours
              </h3>
              <p className="text-sm text-neutral-300">
                24/7 support
                <br />
                <span className="text-neutral-500 text-xs">
                  Real humans, real help
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment + country / language */}
      <section className="relative border-t border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Payment methods */}
            <div>
              <p className="text-xs text-neutral-500 mb-2 font-medium">
                Secure payments
              </p>
              <div className="flex flex-wrap gap-1.5">
                {paymentMethods.map((m) => (
                  <div
                    key={m.label}
                    className={cn(
                      "h-7 px-2.5 rounded text-white text-[10px] font-bold flex items-center tracking-wider",
                      m.bg
                    )}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Country + language */}
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
                United States (USD)
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
                English
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by Nurovia + legal */}
      <section className="relative border-t border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-neutral-500 text-center md:text-left">
              © {new Date().getFullYear()} PrintWearX. All rights reserved.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 sm:gap-5">
              <Link
                href="/"
                aria-label="Powered by Nurovia"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors group"
              >
                <span>Powered by</span>
                <span className="font-semibold gradient-text">Nurovia</span>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>

              <span className="hidden sm:inline w-px h-3 bg-neutral-800" />

              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              {link.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
