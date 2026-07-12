"use client";
import { Link } from "@/lib/nav";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

export function NotFoundPage() {
  const suggested = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_50%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
        <div
          className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-primary-300/20 blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative mx-auto max-w-3xl px-6 py-20 sm:py-28 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm mb-6"
          >
            <Compass className="w-12 h-12" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl sm:text-9xl font-extrabold tracking-tighter leading-none mb-2"
          >
            404
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-3"
          >
            Lost in the catalog
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/85 max-w-md mx-auto leading-relaxed mb-8"
          >
            The page you're looking for doesn't exist or was moved. Try a
            search, or go grab one of these instead.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-white text-primary-600 font-semibold hover:shadow-2xl hover:shadow-white/30 transition-shadow"
            >
              <Home className="w-4 h-4" />
              Back home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse shop
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-white dark:bg-neutral-900 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              While you're here
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
            >
              See all
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {suggested.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
