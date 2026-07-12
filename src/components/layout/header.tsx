"use client";

import { Link, usePathname, useSearchParams } from "@/lib/nav";
import { useEffect, useState } from "react";
import { ShoppingCart, User, Menu, Sparkles, Search, X } from "lucide-react";
import { useCart, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { SearchBar } from "./search-bar";
import { AnnouncementBar } from "./announcement-bar";
import { CategoryStrip } from "./category-strip";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "T-Shirts", href: "/shop?category=T-Shirts" },
  { label: "Hoodies", href: "/shop?category=Hoodies" },
  { label: "New", href: "/shop?filter=new" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const search = useSearchParams();
  const items = useCart((s) => s.items);
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [pathname, search.toString()]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "glass shadow-sm dark:shadow-black/30"
            : "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md"
        )}
      >
        <AnnouncementBar />

        {/* Main header row */}
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
              aria-label="PrintWearX home"
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
                <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent whitespace-nowrap">
                PrintWearX
              </span>
            </Link>

            {/* Desktop nav (xl) */}
            <nav
              className="hidden xl:flex items-center gap-1"
              aria-label="Main"
            >
              {navLinks.map((link) => {
                const [path, query] = link.href.split("?");
                const linkActive =
                  pathname === path &&
                  (query
                    ? search.toString().includes(query)
                    : !search.toString() ||
                      pathname !== "/shop" ||
                      !search.get("category"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 lg:px-4 py-2 rounded-lg font-medium text-sm transition-colors min-h-[36px] flex items-center",
                      linkActive
                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10"
                        : "text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Search (desktop) */}
            <div className="hidden lg:block flex-1 max-w-md mx-2 xl:mx-4">
              <SearchBar />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-label={mobileSearchOpen ? "Close search" : "Open search"}
                aria-expanded={mobileSearchOpen}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full text-neutral-600 dark:text-neutral-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              >
                {mobileSearchOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>

              <ThemeToggle />

              <Link
                href="/cart"
                aria-label={`Shopping cart, ${cartCount} ${
                  cartCount === 1 ? "item" : "items"
                }`}
                className="relative inline-flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full text-neutral-600 dark:text-neutral-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold border-2 border-white dark:border-neutral-950">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/login"
                aria-label="Account"
                className="hidden md:inline-flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full text-neutral-600 dark:text-neutral-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
                className="xl:hidden inline-flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full text-neutral-600 dark:text-neutral-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar (collapsible) */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3">
              <SearchBar onSubmit={() => setMobileSearchOpen(false)} />
            </div>
          </div>
        )}

        {/* Desktop category strip */}
        <CategoryStrip />
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
