import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipLink } from "@/components/layout/skip-link";
import { PWAInstall } from "@/components/pwa-install";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app"
  ),
  title: {
    default: "PrintWearX — Premium Print & Apparel",
    template: "%s · PrintWearX",
  },
  description:
    "Premium prints on heavyweight cotton, fleece, and canvas. Original artwork, ethical production, free shipping over $50, and 30-day returns. Shop t-shirts, hoodies, crewnecks, and accessories.",
  applicationName: "PrintWearX",
  authors: [{ name: "Hassan El-Deghidy", url: "https://nurovia.dev" }],
  creator: "Hassan El-Deghidy",
  publisher: "PrintWearX",
  generator: "Nurovia",
  category: "Shopping",
  classification: "E-commerce",
  keywords: [
    "print on demand",
    "printed apparel",
    "t-shirts",
    "hoodies",
    "crewnecks",
    "long sleeve shirts",
    "caps",
    "tote bags",
    "original artwork",
    "premium cotton",
    "heavyweight fleece",
    "eco-friendly inks",
    "water-based inks",
    "ethical production",
    "free shipping",
    "30-day returns",
    "screen printing",
    "streetwear",
    "minimalist clothing",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "PrintWearX",
    title: "PrintWearX — Premium Print & Apparel",
    description:
      "Premium prints on heavyweight cotton, fleece, and canvas. Original artwork, ethical production, free shipping over $50, and 30-day returns.",
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/og/og-default.webp",
        width: 1200,
        height: 630,
        alt: "PrintWearX — Premium Print & Apparel",
        type: "image/webp",
      },
      {
        url: "/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "PrintWearX — Premium Print & Apparel",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@printwearx",
    creator: "@nurovia",
    title: "PrintWearX — Premium Print & Apparel",
    description:
      "Premium prints on heavyweight cotton, fleece, and canvas. Original artwork, ethical production, free shipping over $50, and 30-day returns.",
    images: ["/og/og-default.webp"],
  },
  // facebook: { appId: "YOUR_FB_APP_ID" }, // uncomment + add when you have a FB App
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Add these once you have accounts:
    // google: "google-site-verification-code",
    // yandex: "yandex-verification",
    // bing: "bing-verification",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.webp", sizes: "32x32", type: "image/webp" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/og/logo.webp", sizes: "512x512", type: "image/webp" },
      { url: "/og/logo.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [
      { url: "/apple-touch-icon.webp", sizes: "180x180", type: "image/webp" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PrintWearX",
  },
  formatDetection: { telephone: false, email: false, address: false },
  other: {
    "theme-color": "#007AFF",
    "color-scheme": "light dark",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#007AFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const noFlashScript = `
(function () {
  try {
    var raw = localStorage.getItem("printwearx-ui");
    if (raw) {
      var parsed = JSON.parse(raw);
      var dark = !!(parsed && parsed.state && parsed.state.darkMode);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    }
  } catch (e) {}
})();
`;

/**
 * Clean-URL script for static export (host-agnostic).
 *
 * We build with `output: "export"` and `trailingSlash: true`, so every
 * route ships as a directory with an index.html inside (e.g.
 * /admin/products/new/index.html). Different hosts handle directory
 * URLs differently:
 *
 *   - Vercel, Netlify, Cloudflare Pages, S3+CloudFront: auto-serve
 *     index.html for both /admin/products/new and /admin/products/new/
 *   - Raw S3, GitHub Pages (without custom domain), some CDNs: only
 *     serve index.html for the trailing-slash version
 *   - Truly broken setups: serve 404 (handled by our smart 404.html)
 *
 * This script does two things so the address bar always shows the
 * canonical clean URL (no trailing slash, no .html):
 *
 * Phase 1: on first load, if the URL has no trailing slash AND no
 *   extension, immediately do a window.location.replace to the
 *   trailing-slash version. This guarantees the host serves the right
 *   file. The replace() is invisible (no history entry, no full reload
 *   flash for the user) because it happens in <head> before paint.
 *
 * Phase 2: after the page loads, the same script (in the trailing IIFE)
 *   strips the trailing slash from the address bar using
 *   history.replaceState. The user sees the clean URL.
 */
const cleanUrlRedirectScript = `
(function () {
  try {
    var path = window.location.pathname;
    if (!path) return;
    var search = window.location.search || '';
    var hash = window.location.hash || '';

    // Save the original path so the 404 page can recover it if the
    // host redirects us to /404/ (loses the original URL).
    try {
      if (path && path !== '/404' && path !== '/404/') {
        sessionStorage.setItem('pwx_last_path', path);
      }
    } catch (e) {}

    var changed = false;

    // Phase 1: ensure trailing slash for clean directory URLs.
    // Skip if:
    //   - already has trailing slash
    //   - has a file extension (e.g. .html, .css, .js, .png)
    //   - is the root path
    //   - is a Next.js internal path
    if (
      path !== '/' &&
      !path.endsWith('/') &&
      !/\\.[a-z0-9]{1,6}$/i.test(path) &&
      !path.startsWith('/_next/') &&
      !path.startsWith('/api/')
    ) {
      window.location.replace(path + '/' + search + hash);
      return;
    }

    // Phase 2: clean the address bar.
    var cleanPath = path;
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.replace(/\\/+$/, '');
      changed = true;
    }
    if (cleanPath.endsWith('.html')) {
      cleanPath = cleanPath.replace(/\\.html$/, '');
      if (cleanPath === '/index') cleanPath = '/';
      changed = true;
    }
    if (changed) {
      var newUrl = cleanPath + search + hash;
      try {
        window.history.replaceState({}, '', newUrl);
        // Re-save the cleaned path so 404 detection still works
        if (cleanPath && cleanPath !== '/404' && cleanPath !== '/404/') {
          sessionStorage.setItem('pwx_last_path', cleanPath);
        }
      } catch (e) {}
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

  // Organization + WebSite JSON-LD. Injected site-wide so every page
  // contributes to the same brand graph.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PrintWearX",
      legalName: "PrintWearX",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og/logo.webp`,
        width: 512,
        height: 512,
      },
      image: `${siteUrl}/og/og-default.webp`,
      description:
        "Premium print-on-demand apparel. Original artwork on heavyweight cotton, fleece, and canvas. Ethical production, free shipping over $50, and 30-day returns.",
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        name: "Hassan El-Deghidy",
        url: "https://nurovia.dev",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@printwearx.com",
          availableLanguage: ["English"],
        },
      ],
      sameAs: [
        "https://twitter.com/printwearx",
        "https://instagram.com/printwearx",
        "https://facebook.com/printwearx",
        "https://pinterest.com/printwearx",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "PrintWearX",
      description:
        "Premium prints on heavyweight cotton, fleece, and canvas.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        // Google requires the literal placeholder name below.
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Preload the most important product image (home page hero) */}
        <link
          rel="preload"
          as="image"
          href="/imgs/sunset_wave_tee-1080.webp"
          type="image/webp"
          fetchPriority="high"
        />
        {/* Preload logo for LCP */}
        <link rel="preload" as="image" href="/favicon.svg" type="image/svg+xml" />

        {/* Canonical is set per-page via `alternates.canonical` */}
        <meta name="theme-color" content="#007AFF" />
        <meta name="color-scheme" content="light dark" />
        <meta name="application-name" content="PrintWearX" />
        <meta name="apple-mobile-web-app-title" content="PrintWearX" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <script dangerouslySetInnerHTML={{ __html: cleanUrlRedirectScript }} />
      </head>
      <body className="font-sans antialiased">
        <SkipLink />
        <ErrorBoundary>
          <Suspense fallback={null}>{children}</Suspense>
        </ErrorBoundary>
        <PWAInstall />
      </body>
    </html>
  );
}
