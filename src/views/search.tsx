"use client";
import { useSearchParams, useRouter, usePathname, Link } from "@/lib/nav";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

const RECENT_KEY = "printwearx-recent-searches";
const MAX_RECENT = 5;

export function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [recent, setRecent] = useState<string[]>([]);

  // Load recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  // Keep input in sync with URL
  useEffect(() => setQuery(queryParam), [queryParam]);

  // Update recent searches
  const pushRecent = (q: string) => {
    const cleaned = q.trim();
    if (!cleaned) return;
    const next = [cleaned, ...recent.filter((r) => r !== cleaned)].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const submit = (q: string) => {
    const next = q.trim();
    router.push(next ? `${pathname}?q=${encodeURIComponent(next)}` : pathname);
    if (next) pushRecent(next);
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  // Score products against query
  const results = useMemo(() => {
    const q = queryParam.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = products
      .map((p) => {
        const haystack =
          `${p.name} ${p.description} ${p.category}`.toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (!t) continue;
          if (p.name.toLowerCase().includes(t)) score += 5;
          if (p.category.toLowerCase().includes(t)) score += 3;
          if (haystack.includes(t)) score += 1;
        }
        return { product: p, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored;
  }, [queryParam]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => p.name);
  }, [query]);

  const trending = [
    "Wireless headphones",
    "Leather watch",
    "Travel backpack",
    "Yoga mat",
    "Coffee maker",
  ];

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Search hero */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight mb-5">
            What are you looking for?
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
            className="relative"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="search"
              autoFocus
              placeholder="Search products, prints, drops…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-12 sm:pr-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-transparent dark:border-neutral-700 text-base sm:text-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  router.push(pathname);
                }}
                aria-label="Clear search"
                className="absolute right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Typeahead suggestions */}
          {query.trim() && suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Try:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="inline-flex items-center px-3 h-7 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results / states */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {queryParam.trim() ? (
            <>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                    {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                    <span className="text-primary-600 dark:text-primary-400">
                      "{queryParam}"
                    </span>
                  </h2>
                </div>
              </div>

              {results.length === 0 ? (
                <EmptyState query={queryParam} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                >
                  {results.map(({ product }, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                    />
                  ))}
                </motion.div>
              )}
            </>
          ) : (
            <DefaultState
              recent={recent}
              onRecentClick={submit}
              onClearRecent={clearRecent}
              trending={trending}
              onTrendingClick={submit}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mb-4">
        <Search className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
        No matches for "{query}"
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
        Try fewer or broader keywords, check the spelling, or browse our
        categories instead.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
      >
        Browse shop
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function DefaultState({
  recent,
  onRecentClick,
  onClearRecent,
  trending,
  onTrendingClick,
}: {
  recent: string[];
  onRecentClick: (q: string) => void;
  onClearRecent: () => void;
  trending: string[];
  onTrendingClick: (q: string) => void;
}) {
  return (
    <div className="space-y-10">
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Recent searches
            </h2>
            <button
              onClick={onClearRecent}
              className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => onRecentClick(r)}
                className="inline-flex items-center px-3 h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
          Trending right now
        </h2>
        <div className="flex flex-wrap gap-2">
          {trending.map((t) => (
            <button
              key={t}
              onClick={() => onTrendingClick(t)}
              className="inline-flex items-center px-4 h-10 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-700/10 border border-primary-200/60 dark:border-primary-500/30 text-sm font-medium text-primary-700 dark:text-primary-300 hover:shadow-md transition-shadow"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
          Popular categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "T-Shirts", color: "from-blue-500 to-cyan-500" },
            { label: "Hoodies", color: "from-pink-500 to-rose-500" },
            { label: "Crewnecks", color: "from-amber-500 to-orange-500" },
            { label: "Long-Sleeves", color: "from-emerald-500 to-teal-500" },
            { label: "Accessories", color: "from-purple-500 to-violet-500" },
            { label: "Beauty", color: "from-pink-400 to-fuchsia-500" },
          ].map((c) => (
            <Link
              key={c.label}
              href={`/shop?category=${encodeURIComponent(c.label)}`}
              className={`group relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br ${c.color} opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {c.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
