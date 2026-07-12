"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "@/lib/nav";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Check,
  Grid3x3,
  LayoutGrid,
} from "lucide-react";
import { useMemo, useState } from "react";
import { products, categories, type Category } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { FilterPills } from "@/components/product/filter-pills";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-low" | "price-high" | "rating" | "newest";
type ViewMode = "grid" | "compact";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 — $100", min: 50, max: 100 },
  { label: "$100 — $300", min: 100, max: 300 },
  { label: "Over $300", min: 300, max: Infinity },
];

export function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = (searchParams.get("category") as Category) ?? "All Products";
  const sort = (searchParams.get("sort") as SortKey) ?? "featured";
  const [priceMin, setPriceMin] = useState<number>(
    searchParams.get("min") ? Number(searchParams.get("min")) : 0
  );
  const [priceMax, setPriceMax] = useState<number | null>(
    searchParams.get("max") ? Number(searchParams.get("max")) : null
  );
  const [minRating, setMinRating] = useState<number>(
    searchParams.get("rating") ? Number(searchParams.get("rating")) : 0
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");

  // Helper to update URL params without losing existing ones.
  const writeParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const setCategory = (c: string) =>
    writeParams((p) => (c === "All Products" ? p.delete("category") : p.set("category", c)));

  const filtered = useMemo(() => {
    let result = products.slice();
    if (category && category !== "All Products") {
      result = result.filter((p) => p.category === category);
    }
    if (priceMin > 0) result = result.filter((p) => p.price >= priceMin);
    if (priceMax !== null) result = result.filter((p) => p.price <= priceMax);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }
    return result;
  }, [category, sort, priceMin, priceMax, minRating]);

  const updateSort = (next: SortKey) =>
    writeParams((p) => (next === "featured" ? p.delete("sort") : p.set("sort", next)));

  const clearFilters = () => {
    router.push(pathname);
    setPriceMin(0);
    setPriceMax(null);
    setMinRating(0);
  };

  const hasActiveFilters = priceMin > 0 || priceMax !== null || minRating > 0;

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
            Shop
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {category !== "All Products" && ` in ${category}`}
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto scrollbar-thin md:overflow-visible">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <FilterPills />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSection
                title="Category"
                onClear={() => writeParams((p) => p.delete("category"))}
              >
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors min-h-[36px]",
                        category === c
                          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price" onClear={() => { setPriceMin(0); setPriceMax(null); }}>
                <div className="space-y-1">
                  {priceRanges.map((range) => {
                    const isActive =
                      priceMin === range.min &&
                      priceMax === (Number.isFinite(range.max) ? range.max : null);
                    return (
                      <button
                        key={range.label}
                        onClick={() => {
                          setPriceMin(range.min);
                          setPriceMax(Number.isFinite(range.max) ? range.max : null);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between min-h-[36px]",
                          isActive
                            ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        )}
                      >
                        <span>{range.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="Rating" onClear={() => setMinRating(0)}>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 min-h-[36px]",
                        minRating === rating
                          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3.5 h-3.5",
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-neutral-200 dark:fill-neutral-700 text-neutral-200 dark:text-neutral-700"
                          )}
                        />
                      ))}
                      <span className="ml-1 text-xs">& up</span>
                    </button>
                  ))}
                </div>
              </FilterSection>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors min-h-[44px]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                <span className="hidden sm:inline">Showing </span>
                <strong className="text-neutral-900 dark:text-white">
                  {filtered.length}
                </strong>{" "}
                results
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold">
                      !
                    </span>
                  )}
                </button>

                <div className="hidden sm:inline-flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={cn(
                      "inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                      view === "grid"
                        ? "bg-primary-500 text-white"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("compact")}
                    aria-label="Compact view"
                    className={cn(
                      "inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                      view === "compact"
                        ? "bg-primary-500 text-white"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    )}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>

                <SortMenu value={sort} onChange={updateSort} />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mb-4">
                  <SlidersHorizontal className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No products match
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                  Try widening your filters or browse all products.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-4 sm:gap-6",
                  view === "grid"
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                )}
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        category={category}
        onCategoryChange={(c) => setCategory(c)}
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceChange={(min, max) => { setPriceMin(min); setPriceMax(max); }}
        minRating={minRating}
        onRatingChange={setMinRating}
        onClear={clearFilters}
        onApply={() => setMobileOpen(false)}
      />
    </main>
  );
}

function FilterSection({
  title,
  children,
  onClear,
}: {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {title}
        </h3>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function SortMenu({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = sortOptions.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-w-[160px] justify-between"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              className="fixed inset-0 z-30 cursor-default"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-40 min-w-[200px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden"
            >
              {sortOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm transition-colors min-h-[44px] flex items-center justify-between",
                    value === o.value
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  {o.label}
                  {value === o.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileFilterSheet({
  open,
  onClose,
  category,
  onCategoryChange,
  priceMin,
  priceMax,
  onPriceChange,
  minRating,
  onRatingChange,
  onClear,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  category: string;
  onCategoryChange: (c: string) => void;
  priceMin: number;
  priceMax: number | null;
  onPriceChange: (min: number, max: number | null) => void;
  minRating: number;
  onRatingChange: (r: number) => void;
  onClear: () => void;
  onApply: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white dark:bg-neutral-950 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <FilterSection title="Category">
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => onCategoryChange(c)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between min-h-[44px]",
                        category === c
                          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {c}
                      {category === c && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price">
                <div className="space-y-1">
                  {priceRanges.map((range) => {
                    const isActive =
                      priceMin === range.min &&
                      priceMax === (Number.isFinite(range.max) ? range.max : null);
                    return (
                      <button
                        key={range.label}
                        onClick={() =>
                          onPriceChange(range.min, Number.isFinite(range.max) ? range.max : null)
                        }
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between min-h-[44px]",
                          isActive
                            ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        )}
                      >
                        <span>{range.label}</span>
                        {isActive && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="Rating">
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onRatingChange(minRating === rating ? 0 : rating)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center gap-1 min-h-[44px]",
                        minRating === rating
                          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-neutral-200 dark:fill-neutral-700 text-neutral-200 dark:text-neutral-700"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-xs">& up</span>
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>

            <div className="flex items-center gap-3 p-4 border-t border-neutral-200 dark:border-neutral-800 pb-safe">
              <button
                onClick={onClear}
                className="flex-1 h-12 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={onApply}
                className="flex-[2] h-12 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/30"
              >
                Show results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
