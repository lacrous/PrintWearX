import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutPage } from "@/views/checkout";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Secure checkout",
  description:
    "Complete your purchase securely. SSL encrypted, PCI-compliant payment processing. Free shipping over $50. 30-day returns.",
  alternates: { canonical: `${SITE_URL}/checkout` },
  robots: { index: false, follow: false },
};

export default function CheckoutRoute() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <CheckoutPage />
      </main>
      <Footer />
    </>
  );
}