import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CartPage } from "@/views/cart";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Your shopping cart",
  description:
    "Review your cart and proceed to checkout. Free shipping over $50, 30-day returns, secure SSL checkout.",
  alternates: { canonical: `${SITE_URL}/cart` },
  robots: { index: false, follow: true },
};

export default function CartRoute() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="md:pb-0 pb-16">
        <CartPage />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}