"use client";
import { Link } from "@/lib/nav";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  HeadphonesIcon as Headphones,
  Sparkles,
  Zap,
  Heart,
  Quote,
  Mail,
  Check,
  Shirt,
  Tv,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { useState } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

const categories = [
  {
    label: "T-Shirts",
    href: "/shop?category=T-Shirts",
    icon: Shirt,
    color: "from-blue-500 to-cyan-500",
    items: "Premium cotton tees",
  },
  {
    label: "Hoodies",
    href: "/shop?category=Hoodies",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    items: "Heavyweight fleece",
  },
  {
    label: "Crewnecks",
    href: "/shop?category=Crewnecks",
    icon: Heart,
    color: "from-amber-500 to-orange-500",
    items: "Midweight pullovers",
  },
  {
    label: "Long-Sleeves",
    href: "/shop?category=Long-Sleeves",
    icon: Tv,
    color: "from-emerald-500 to-teal-500",
    items: "Layer-ready staples",
  },
];

const benefits = [
  {
    Icon: Truck,
    title: "Free shipping",
    description: "On every order over $50 — delivered within 2–5 days.",
  },
  {
    Icon: ShieldCheck,
    title: "Prints that last",
    description: "Water-based inks, cured at 320°F. Won't crack or fade.",
  },
  {
    Icon: RotateCcw,
    title: "30-day returns",
    description: "Not the right fit? Send it back. No questions asked.",
  },
  {
    Icon: Headphones,
    title: "24/7 support",
    description: "Real humans ready to help, day or night.",
  },
];

const stats = [
  { value: "12,400+", label: "Happy customers" },
  { value: "180+", label: "Original prints" },
  { value: "99.6%", label: "Would reorder" },
  { value: "48h", label: "Avg. delivery" },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Designer, Brooklyn",
    initials: "SK",
    color: "from-pink-500 to-rose-500",
    stars: 5,
    quote:
      "The Sunset Wave Tee is hands down the softest tee I own. The print is gorgeous in person and the cotton feels premium. Already ordered two more colors.",
  },
  {
    name: "Marcus L.",
    role: "Engineer, Berlin",
    initials: "ML",
    color: "from-indigo-500 to-blue-500",
    stars: 5,
    quote:
      "Heavyweight hoodie, clean minimalist design, and a checkout that just works. The Mountain Peak Hoodie is now my daily driver through winter.",
  },
  {
    name: "Anya P.",
    role: "Photographer, Tokyo",
    initials: "AP",
    color: "from-emerald-500 to-teal-500",
    stars: 5,
    quote:
      "I have PrintWearX on rotation in my studio wardrobe. The prints are original, the fabric holds up, and the 30-day returns let me buy with confidence.",
  },
];

export function LandingPage() {
  const featured = products.slice(0, 8);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_50%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
        <div
          className="absolute top-1/2 -right-32 w-72 h-72 rounded-full bg-primary-300/20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full bg-yellow-300/15 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-medium mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                Summer drop — 12 new prints
              </span>

              <h1
                className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
              >
                Premium prints
                <br />
                on{" "}
                <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent">
                  apparel you'll
                </span>{" "}
                actually wear.
              </h1>

              <p
                className="text-base sm:text-lg lg:text-xl text-white/85 mb-10 max-w-xl leading-relaxed"
              >
                Original artwork on heavyweight cotton, fleece, and canvas.
                Free shipping on orders over $50, 30-day returns, and prints
                that don't crack or fade.
              </p>

              <div
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-7 rounded-2xl bg-white text-primary-600 font-semibold text-sm sm:text-base hover:shadow-2xl hover:shadow-white/20 transition-shadow flex-1 sm:flex-initial min-h-[48px]"
                >
                  Shop now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm sm:text-base hover:bg-white/15 transition-colors flex-1 sm:flex-initial min-h-[48px]"
                >
                  Create account
                </Link>
              </div>

              {/* Trust strip */}
              <div
                className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-white/80"
              >
                {[
                  "Free shipping over $50",
                  "30-day returns",
                  "Pre-shrunk cotton",
                  "Eco-friendly inks",
                ].map((label) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-yellow-300" strokeWidth={3} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* concentric circles */}
                <div className="absolute inset-0 rounded-full border-2 border-white/15" />
                <div className="absolute inset-8 rounded-full border-2 border-white/10" />
                <div className="absolute inset-16 rounded-full bg-white/10 backdrop-blur-sm" />
                <div className="absolute inset-24 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="w-16 h-16" />
                </div>

                {/* Floating product badges */}
                <div
                  className="absolute top-4 right-4 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold"
                >
                  ✨ Original art
                </div>
                <div
                  className="absolute bottom-12 left-0 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold"
                >
                  🔥 12 new drops
                </div>
                <div
                  className="absolute bottom-0 right-8 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold"
                >
                  ⚡ Ships in 48h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
            >
              Shop by category
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Premium blanks, original prints, ethical production. Built to be worn on repeat.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <div
                key={cat.label}
                >
                <Link
                  href={cat.href}
                  className="group block relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-transparent hover:shadow-2xl transition-all"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white">
                    <cat.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1">
                        {cat.label}
                      </h3>
                      <p className="text-xs sm:text-sm opacity-90">{cat.items}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2"
              >
                Bestsellers
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                The pieces our community keeps reordering.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
            >
              See all products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map(({ Icon, title, description }, i) => (
              <div
                key={title}
                className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-500/50 hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="py-14 sm:py-20 bg-neutral-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-700/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-br from-white to-primary-200 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
              Loved by 12,400+ humans
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Real reviews from real customers. No bots, no paid placements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-shadow"
              >
                <Quote className="w-8 h-8 text-primary-500/30 mb-4" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, n) => (
                    <Star
                      key={n}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                  "{t.quote}"
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            Be the first to know
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
            Subscribe for early access to new drops, member-only deals, and the
            occasional behind-the-scenes story from our artists.
          </p>

          <form
            onSubmit={onSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 h-14 px-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-md shadow-primary-500/30"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={3} />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 p-10 sm:p-16 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_60%)]" />
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <Zap className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                Find your next favorite print.
              </h2>
              <p className="text-white/85 mb-8 max-w-xl mx-auto text-base sm:text-lg">
                Original artwork, premium blanks, ethically made. Browse the
                latest collection and find a print that's actually you.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-white text-primary-600 font-semibold text-sm sm:text-base hover:shadow-2xl hover:shadow-white/30 transition-shadow min-h-[48px]"
                >
                  Browse all products
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm sm:text-base hover:bg-white/15 transition-colors min-h-[48px]"
                >
                  <Heart className="w-4 h-4" />
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
