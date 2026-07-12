import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SearchPage } from "@/views/search";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Search products",
  description:
    "Search across the full PrintWearX catalog. Find t-shirts, hoodies, crewnecks, long-sleeves, caps, and tote bags.",
  alternates: { canonical: `${SITE_URL}/search` },
  robots: { index: false, follow: true },
};

export default function SearchRoute() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="md:pb-0 pb-16">
        <SearchPage />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}