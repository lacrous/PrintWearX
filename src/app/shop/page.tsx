import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ShopPage } from "@/views/shop";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Shop premium print apparel — t-shirts, hoodies, crewnecks & more",
  description:
    "Browse our full collection of original print apparel. Premium cotton tees, heavyweight fleece hoodies, midweight crewnecks, long-sleeves, caps, and totes. Free shipping over $50. 30-day returns.",
  keywords: [
    "shop t-shirts",
    "shop hoodies",
    "shop crewnecks",
    "shop long-sleeves",
    "buy caps",
    "buy tote bags",
    "printed apparel",
    "premium cotton shirts",
    "heavyweight fleece",
    "original artwork clothing",
  ],
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    title: "Shop premium print apparel",
    description:
      "Original prints on heavyweight cotton, fleece, and canvas. T-shirts, hoodies, crewnecks, and accessories.",
    url: `${SITE_URL}/shop`,
    type: "website",
    images: [
      {
        url: "/og/og-shop.webp",
        width: 1200,
        height: 630,
        alt: "Shop PrintWearX premium print apparel",
      },
    ],
  },
  twitter: {
    title: "Shop premium print apparel",
    description:
      "Original prints on heavyweight cotton, fleece, and canvas. T-shirts, hoodies, crewnecks, and accessories.",
    images: ["/og/og-shop.webp"],
  },
};

export default function ShopRoute() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="md:pb-0 pb-16">
        <ShopPage />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}