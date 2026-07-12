"use client";
import { Link, useLocation } from "@/lib/nav";
import {
  Home,
  Store,
  ShoppingCart,
  User,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store";

const items = [
  { label: "Home", href: "/", icon: Home, match: (p: string) => p === "/" },
  {
    label: "Shop",
    href: "/shop",
    icon: Store,
    match: (p: string) => p.startsWith("/shop"),
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
    match: (p: string) => p.startsWith("/search"),
  },
  {
    label: "Account",
    href: "/login",
    icon: User,
    match: (p: string) =>
      p.startsWith("/login") ||
      p.startsWith("/signup") ||
      p.startsWith("/account"),
  },
];

export function MobileBottomNav() {
  const location = useLocation();
  const cartCount = useCart(
    (s) => s.items.reduce((acc, i) => acc + i.quantity, 0)
  );

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 glass dark:border-t dark:border-neutral-800 pb-safe"
    >
      <div className="mx-auto max-w-md px-2">
        <div className="relative grid grid-cols-5 items-stretch py-1.5 sm:py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 min-h-[52px] py-1.5 rounded-xl transition-colors",
                  active
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-neutral-500 dark:text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-900"
                )}
              >
                <Icon
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-medium leading-none",
                    active && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Centered cart "FAB" — replaces slot 3 visually */}
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${cartCount} ${
              cartCount === 1 ? "item" : "items"
            }`}
            className="relative -mt-5 sm:-mt-6 flex flex-col items-center justify-center"
          >
            <div
              className={cn(
                "relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all active:scale-95",
                isActive("/cart")
                  ? "bg-primary-600 shadow-primary-500/40"
                  : "bg-primary-500 shadow-primary-500/30"
              )}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold border-2 border-white dark:border-neutral-950">
                  {cartCount}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-[10px] sm:text-[11px] font-medium leading-none mt-0.5",
                isActive("/cart")
                  ? "text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              Cart
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
