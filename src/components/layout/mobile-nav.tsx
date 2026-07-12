"use client";
import { Link, useLocation } from "@/lib/nav";
import {
  X,
  Home,
  Store,
  Shirt,
  ShoppingBag,
  Layers,
  Pen,
  Crown,
  Sparkles,
  User,
  LogIn,
  Sun,
  Moon,
  Bell,
  Heart,
  Settings,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Package,
  HeadphonesIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: Props) {
  const location = useLocation();
  const darkMode = useUI((s) => s.darkMode);
  const toggle = useUI((s) => s.toggleDarkMode);
  const cartCount = useCart(
    (s) => s.items.reduce((acc, i) => acc + i.quantity, 0)
  );
  const [section, setSection] = useState<"main" | "categories" | "account">(
    "main"
  );

  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      triggerRef.current =
        (document.activeElement as HTMLElement) ?? null;
      document.body.style.overflow = "hidden";
      setTimeout(() => closeBtnRef.current?.focus(), 60);
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Reset section when drawer closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setSection("main"), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC + focus trap
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="mobile-nav-backdrop"
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="mobile-nav-drawer"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                PrintWearX
              </div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                {section === "main" && "Menu"}
                {section === "categories" && "Shop by category"}
                {section === "account" && "Your account"}
              </div>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-11 h-11 min-w-[44px] rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main section */}
        {section === "main" && (
          <div className="flex-1 overflow-y-auto">
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2 p-4">
              <Link
                href="/cart"
                onClick={onClose}
                className="relative flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors min-h-[80px]"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold">Cart</span>
              </Link>
              <button
                onClick={() => setSection("account")}
                className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors min-h-[80px]"
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-semibold">Account</span>
              </button>
            </div>

            {/* Primary nav */}
            <nav className="px-3 pb-3 space-y-1" aria-label="Mobile primary">
              <DrawerLink
                href="/"
                onClick={onClose}
                icon={Home}
                label="Home"
                active={location.pathname === "/"}
              />
              <DrawerLink
                href="/shop"
                onClick={onClose}
                icon={Store}
                label="Shop all"
                active={location.pathname === "/shop" && !location.search}
              />
              <button
                onClick={() => setSection("categories")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[44px] text-left"
              >
                <Layers className="w-5 h-5" />
                <span className="flex-1">Categories</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </nav>

            {/* Section divider */}
            <div className="mx-4 my-2 border-t border-neutral-200 dark:border-neutral-800" />

            {/* Quick links */}
            <nav className="px-3 pb-3 space-y-1" aria-label="Mobile secondary">
              <DrawerLink
                href="/orders"
                onClick={onClose}
                icon={Package}
                label="Track order"
                active={location.pathname === "/orders"}
              />
              <DrawerLink
                href="/wishlist"
                onClick={onClose}
                icon={Heart}
                label="Wishlist"
                active={location.pathname === "/wishlist"}
              />
              <DrawerLink
                href="/support"
                onClick={onClose}
                icon={HelpCircle}
                label="Help & support"
                active={location.pathname === "/support"}
              />
            </nav>
          </div>
        )}

        {/* Categories section */}
        {section === "categories" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <button
                onClick={() => setSection("main")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[36px]"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Back to menu
              </button>
            </div>
            <nav className="px-3 pb-3 space-y-1" aria-label="Categories">
              <DrawerLink
                href="/shop?category=T-Shirts"
                onClick={onClose}
                icon={Shirt}
                label="T-Shirts"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("T-Shirts")
                }
              />
              <DrawerLink
                href="/shop?category=Hoodies"
                onClick={onClose}
                icon={ShoppingBag}
                label="Hoodies"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("Hoodies")
                }
              />
              <DrawerLink
                href="/shop?category=Crewnecks"
                onClick={onClose}
                icon={Layers}
                label="Crewnecks"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("Crewnecks")
                }
              />
              <DrawerLink
                href="/shop?category=Long-Sleeves"
                onClick={onClose}
                icon={Pen}
                label="Long-Sleeves"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("Long-Sleeves")
                }
              />
              <DrawerLink
                href="/shop?category=Caps"
                onClick={onClose}
                icon={Crown}
                label="Caps"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("Caps")
                }
              />
              <DrawerLink
                href="/shop?category=Totes"
                onClick={onClose}
                icon={ShoppingBag}
                label="Totes"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("Totes")
                }
              />
            </nav>

            <div className="mx-4 my-2 border-t border-neutral-200 dark:border-neutral-800" />

            <nav className="px-3 pb-3 space-y-1" aria-label="Collections">
              <DrawerLink
                href="/shop?filter=new"
                onClick={onClose}
                icon={Sparkles}
                label="New arrivals"
                accent="amber"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("filter=new")
                }
              />
              <DrawerLink
                href="/shop?filter=sale"
                onClick={onClose}
                icon={Sparkles}
                label="On sale"
                accent="amber"
                active={
                  location.pathname === "/shop" &&
                  location.search.includes("filter=sale")
                }
              />
            </nav>
          </div>
        )}

        {/* Account section */}
        {section === "account" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <button
                onClick={() => setSection("main")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[36px]"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Back to menu
              </button>
            </div>

            {/* User card */}
            <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
                  PW
                </div>
                <div>
                  <div className="font-bold">Welcome back</div>
                  <div className="text-xs opacity-90">
                    Sign in to track orders & earn rewards
                  </div>
                </div>
              </div>
              <Link
                href="/login"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white text-primary-600 font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            </div>

            <nav className="px-3 pb-3 space-y-1" aria-label="Account">
              <DrawerLink
                href="/signup"
                onClick={onClose}
                icon={Sparkles}
                label="Create account"
                active={location.pathname === "/signup"}
              />
              <DrawerLink
                href="/orders"
                onClick={onClose}
                icon={Package}
                label="My orders"
                active={location.pathname === "/orders"}
              />
              <DrawerLink
                href="/wishlist"
                onClick={onClose}
                icon={Heart}
                label="Wishlist"
                active={location.pathname === "/wishlist"}
              />
              <DrawerLink
                href="/notifications"
                onClick={onClose}
                icon={Bell}
                label="Notifications"
                active={location.pathname === "/notifications"}
              />
              <DrawerLink
                href="/support"
                onClick={onClose}
                icon={HeadphonesIcon}
                label="Help & support"
                active={location.pathname === "/support"}
              />
              <DrawerLink
                href="/settings"
                onClick={onClose}
                icon={Settings}
                label="Settings"
                active={location.pathname === "/settings"}
              />
            </nav>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1 bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            onClick={toggle}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] rounded-xl font-medium text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              {darkMode ? "Light mode" : "Dark mode"}
            </span>
            <span
              className={cn(
                "inline-flex items-center w-9 h-5 rounded-full transition-colors",
                darkMode ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700"
              )}
            >
              <span
                className={cn(
                  "inline-block w-4 h-4 rounded-full bg-white shadow transition-transform",
                  darkMode ? "translate-x-4.5" : "translate-x-0.5"
                )}
              />
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

function DrawerLink({
  href,
  onClick,
  icon: Icon,
  label,
  active,
  accent,
}: {
  href: string;
  onClick?: () => void;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  accent?: "amber";
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium min-h-[44px] transition-colors",
        active
          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
          : accent === "amber"
            ? "text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            : "text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400"
      )}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="flex-1">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
    </Link>
  );
}
