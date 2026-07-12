"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@/lib/nav";
import {
  Trash2,
  ChevronLeft,
  ShoppingBag,
  Lock,
  Tag,
} from "lucide-react";
import { useCart } from "@/lib/store";
import { getProductsByIds } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { ImageOrFallback } from "@/components/ui/image-fallback";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/products";

const TAX_RATE = 0.08;

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, isHydrated } = useCart();
  const cartProducts = getProductsByIds(items.map((i) => i.id));

  const subtotal = cartProducts.reduce(
    (acc, product) => {
      const item = items.find((i) => i.id === product.id);
      return acc + product.price * (item?.quantity ?? 0);
    },
    0
  );

  const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500 mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            Your cart is empty
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
            Looks like you haven't added anything yet. Let's change that.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/30"
          >
            Start shopping
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pb-24 md:pb-0">
      {/* Header */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </section>

      {/* Cart */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence mode="popLayout">
                {cartProducts.map((product) => {
                  const item = items.find((i) => i.id === product.id);
                  if (!item) return null;
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800"
                    >
                      <div className="flex gap-4 sm:gap-5">
                        <Link
                          href={`/products/${product.slug}`}
                          className="shrink-0"
                        >
                          <ImageOrFallback
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${product.slug}`}
                                className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                {product.category}
                              </p>
                              {product.inStock && (
                                <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                  In stock
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(product.id)}
                              aria-label={`Remove ${product.name}`}
                              className="shrink-0 inline-flex items-center justify-center w-11 h-11 min-w-[44px] rounded-lg text-neutral-400 hover:text-error hover:bg-error/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
                            <QuantityStepper
                              size="sm"
                              value={item.quantity}
                              onChange={(v) =>
                                updateQuantity(product.id, v)
                              }
                            />
                            <div className="text-right">
                              <p className="font-bold text-lg text-neutral-900 dark:text-white">
                                {formatCurrency(product.price * item.quantity)}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {formatCurrency(product.price)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-4 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Continue shopping
              </Link>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-5">
                  Order Summary
                </h2>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </dt>
                    <dd className="font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">
                      Shipping
                    </dt>
                    <dd
                      className={
                        shipping === 0
                          ? "font-semibold text-success"
                          : "font-semibold text-neutral-900 dark:text-white"
                      }
                    >
                      {shipping === 0 ? "Free" : formatCurrency(shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Tax</dt>
                    <dd className="font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(tax)}
                    </dd>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 flex justify-between items-baseline">
                    <dt className="text-base font-bold text-neutral-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-xl font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="ENTER CODE"
                        className="w-full h-11 pl-9 pr-3 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                      />
                    </div>
                    <button className="h-11 px-4 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-md shadow-primary-500/30"
                  >
                    <Lock className="w-4 h-4" />
                    Proceed to Checkout
                  </button>
                  <button className="w-full inline-flex items-center justify-center h-12 rounded-xl border-2 border-primary-500 text-primary-500 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                    Save for Later
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Secure SSL Encrypted Checkout</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      We accept
                    </p>
                    <div className="flex justify-center gap-1.5">
                      <div className="h-6 px-2 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center">
                        VISA
                      </div>
                      <div className="h-6 px-2 rounded bg-red-600 text-white text-[10px] font-bold flex items-center">
                        MC
                      </div>
                      <div className="h-6 px-2 rounded bg-blue-500 text-white text-[10px] font-bold flex items-center">
                        PP
                      </div>
                      <div className="h-6 px-2 rounded bg-yellow-500 text-white text-[10px] font-bold flex items-center">
                        GP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="py-12 sm:py-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile sticky checkout bar */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-20 glass border-t border-neutral-200 dark:border-neutral-800 pb-safe">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Total ({itemCount})
            </p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatCurrency(total)}
            </p>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-[2] inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary-500 text-white font-semibold text-sm active:scale-95 transition-all shadow-md shadow-primary-500/30 min-h-[48px]"
          >
            <Lock className="w-4 h-4" />
            Checkout
          </button>
        </div>
      </div>
    </main>
  );
}
