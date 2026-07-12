import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow major crawlers to index the storefront
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/checkout",
          "/cart",
          "/order-success",
          "/login",
          "/signup",
          "/admin",
          "/admin/*",
          "/search", // search result pages have no SEO value
          "/api",
          "/api/*",
          "/_next",
          "/_next/*",
          "/sw.js",
          "/manifest.webmanifest",
          "/offline.html",
        ],
      },
      // Block AI scrapers explicitly (be respectful of crawlers)
      {
        userAgent: ["GPTBot", "Claude-Web", "PerplexityBot", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}