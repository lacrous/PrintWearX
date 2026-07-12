"use client";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "@/lib/nav";
import {
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Check,
} from "lucide-react";
import { useState } from "react";
import {
  getProductBySlug,
  products as allProducts,
} from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/store";
import { ImageOrFallback } from "@/components/ui/image-fallback";
import { ProductCard } from "@/components/product/product-card";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { cn } from "@/lib/utils";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCart((s) => s.addItem);
  const product = getProductBySlug(id ?? "");

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-neutral-900 dark:text-white">
          Product not found
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          We couldn't find what you were looking for.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
        >
          Back to home
        </button>
      </main>
    );
  }

  const fallbackImages = [
    product.image,
    product.image.replace("main", "closeup"),
    product.image.replace("main", "side"),
    product.image.replace("main", "strap"),
  ];

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product.id, quantity);
  };

  const handleBuyNow = () => {
    addItem(product.id, quantity);
    navigate("/checkout");
  };

  const colorMap: Record<string, string> = {
    Black: "bg-neutral-900",
    Gray: "bg-neutral-500",
    Brown: "bg-amber-700",
    Silver: "bg-neutral-300",
    Blue: "bg-blue-500",
  };

  return (
    <main className="pb-24 md:pb-0">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
            <li>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
            <li className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Product hero */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                <ImageOrFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {fallbackImages.map((src, i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 hover:scale-105 transition-all"
                  >
                    <ImageOrFallback
                      src={src}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-7"
            >
              <div>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">
                  {product.category}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-5 h-5",
                          star <= Math.round(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-neutral-200 dark:fill-neutral-700 text-neutral-200 dark:text-neutral-700"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                    {product.rating} · {product.reviews} reviews
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tabular-nums">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.longDescription ?? product.description}
              </p>

              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-base font-semibold text-neutral-900 dark:text-white">
                      Color
                    </span>
                    {selectedColor && (
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-11 h-11 min-w-[44px] rounded-full border-2 transition-all relative",
                          colorMap[color] ?? "bg-neutral-300",
                          selectedColor === color
                            ? "border-primary-500 scale-110 ring-4 ring-primary-500/20"
                            : "border-transparent hover:scale-105"
                        )}
                        aria-label={color}
                      >
                        {selectedColor === color && (
                          <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <span className="block text-base font-semibold text-neutral-900 dark:text-white mb-3">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[64px] min-h-[48px] px-4 rounded-xl border-2 font-semibold transition-all",
                          selectedSize === size
                            ? "border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                            : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-300"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="block text-base font-semibold text-neutral-900 dark:text-white mb-3">
                  Quantity
                </span>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>

              {/* CTAs - desktop only (mobile uses sticky bar) */}
              <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-md shadow-primary-500/30"
                >
                  <Check className="w-5 h-5" />
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl border-2 border-primary-500 text-primary-500 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-500/10 active:scale-[0.98] transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Buy now
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                {[
                  { Icon: Truck, label: "Free shipping" },
                  { Icon: ShieldCheck, label: "2-year warranty" },
                  { Icon: RotateCcw, label: "30-day returns" },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-success/5 text-success"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features / Specs */}
      {product.features && product.features.length > 0 && (
        <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                Key features
              </h2>
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-base text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-20 glass border-t border-neutral-200 dark:border-neutral-800 pb-safe">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Total
            </p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatCurrency(product.price * quantity)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-12 rounded-xl border-2 border-primary-500 text-primary-500 dark:text-primary-400 font-semibold text-sm active:scale-95 transition-all min-h-[48px]"
          >
            <Check className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 h-12 rounded-xl bg-primary-500 text-white font-semibold text-sm active:scale-95 transition-all shadow-md shadow-primary-500/30 min-h-[48px]"
          >
            <Zap className="w-4 h-4" />
            Buy now
          </button>
        </div>
      </div>
    </main>
  );
}
