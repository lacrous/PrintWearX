"use client";
import { Link, usePathname, useSearchParams } from "@/lib/nav";
import {
  Shirt,
  ShoppingBag,
  Layers,
  Crown,
  Sparkles,
  Percent,
  Pen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "T-Shirts", href: "/shop?category=T-Shirts", icon: Shirt },
  { label: "Hoodies", href: "/shop?category=Hoodies", icon: ShoppingBag },
  { label: "Crewnecks", href: "/shop?category=Crewnecks", icon: Layers },
  { label: "Long-Sleeves", href: "/shop?category=Long-Sleeves", icon: Pen },
  { label: "Caps", href: "/shop?category=Caps", icon: Crown },
  { label: "Totes", href: "/shop?category=Totes", icon: ShoppingBag },
  { label: "New", href: "/shop?filter=new", icon: Sparkles, accent: true },
  { label: "Sale", href: "/shop?filter=sale", icon: Percent, accent: true },
];

export function CategoryStrip() {
  const pathname = usePathname();
  const search = useSearchParams();

  return (
    <nav
      aria-label="Categories"
      className="hidden lg:block border-t border-neutral-200/70 dark:border-neutral-800/70 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive =
              pathname === cat.href.split("?")[0] &&
              search.toString() === (cat.href.split("?")[1] ?? "");
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0",
                  isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
                    : cat.accent
                      ? "text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 transition-transform group-hover:scale-110",
                    isActive && "text-white"
                  )}
                />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
