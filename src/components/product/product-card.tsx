"use client";
import { Link } from "@/lib/nav";
import { Plus, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { ImageOrFallback } from "@/components/ui/image-fallback";
import { useCart } from "@/lib/store";
import { useState } from "react";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className="group product-card-anim"
      style={{ animationDelay: `${(index ?? 0) * 40}ms` }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <ImageOrFallback
            src={product.image}
            alt={product.name}
            priority={index < 2}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/5 group-hover:to-black/20 transition-all dark:group-hover:from-black/30 dark:group-hover:to-black/50" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-xs font-semibold text-primary-600 dark:text-primary-400">
            {product.category}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-3">
            <span className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(product.price)}
            </span>
            <button
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="inline-flex items-center justify-center gap-1.5 h-11 px-4 min-w-[44px] rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 active:scale-95 transition-all shadow-md shadow-primary-500/20"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
