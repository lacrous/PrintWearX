"use client";
import { useRouter, useSearchParams, usePathname } from "@/lib/nav";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";

export function FilterPills() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "All Products";

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All Products") params.delete("category");
    else params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {categories.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            onClick={() => setCategory(category)}
            className={cn(
              "relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium border transition-all duration-200",
              isActive
                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/30"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400"
            )}
          >
            <span className="relative">{category}</span>
          </button>
        );
      })}
    </div>
  );
}