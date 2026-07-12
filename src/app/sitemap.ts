import { products, categories } from "@/lib/products";
import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Home, shop, search, auth — high priority pages
  const topRoutes = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/shop", priority: 0.9, freq: "daily" as const },
    { path: "/signup", priority: 0.8, freq: "monthly" as const },
    { path: "/search", priority: 0.5, freq: "weekly" as const },
    { path: "/login", priority: 0.4, freq: "monthly" as const },
  ];

  const topEntries: MetadataRoute.Sitemap = topRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // Category pages — boost SEO for long-tail category keywords
  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((c) => c !== "All Products")
    .map((c) => ({
      url: `${SITE_URL}/shop?category=${encodeURIComponent(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Product pages with image sitemap entries (for Google Images)
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.image ? [`${SITE_URL}${p.image}`] : [],
  }));

  return [...topEntries, ...categoryEntries, ...productEntries];
}