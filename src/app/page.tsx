import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { LandingPage } from "@/views/landing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const metadata = {
  title: "Premium print & apparel — original artwork on cotton & fleece",
  description:
    "Discover PrintWearX: original prints on heavyweight cotton, fleece, and canvas. Free shipping over $50, 30-day returns, and ethical production. Shop t-shirts, hoodies, crewnecks, and accessories.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "PrintWearX — Premium Print & Apparel",
    description:
      "Original prints on heavyweight cotton, fleece, and canvas. Free shipping over $50, 30-day returns.",
    url: SITE_URL,
    type: "website",
    siteName: "PrintWearX",
    images: [
      {
        url: "/og/og-default.webp",
        width: 1200,
        height: 630,
        alt: "PrintWearX — Premium Print & Apparel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintWearX — Premium Print & Apparel",
    description:
      "Original prints on heavyweight cotton, fleece, and canvas. Free shipping over $50, 30-day returns.",
    images: ["/og/og-default.webp"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What kind of apparel does PrintWearX sell?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PrintWearX sells premium print-on-demand apparel including t-shirts, hoodies, crewnecks, long-sleeve shirts, caps, and tote bags. Every piece features original artwork printed on heavyweight cotton, fleece, or canvas using water-based inks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer free shipping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer free shipping on every order over $50 within the United States. Most orders ship within 2-5 business days.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer 30-day returns on all unworn items with original tags. If you're not happy with your purchase for any reason, send it back for a full refund. No questions asked.",
      },
    },
    {
      "@type": "Question",
      name: "Are your prints eco-friendly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All our prints use water-based, PVC-free inks that are cured at 320°F. The prints are soft to the touch, won't crack or fade, and are safer for the environment than traditional plastisol inks.",
      },
    },
    {
      "@type": "Question",
      name: "Where do you ship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We currently ship to the United States, Canada, and the European Union. Free shipping is available for US orders over $50. International shipping rates are calculated at checkout.",
      },
    },
    {
      "@type": "Question",
      name: "How do I contact customer support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our customer support team is available 24/7. You can reach us at support@printwearx.com or through the contact form on our website. We typically respond within a few hours.",
      },
    },
  ],
};

export default function HomeRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>
      <main id="main-content" tabIndex={-1} className="md:pb-0 pb-16">
        <LandingPage />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}