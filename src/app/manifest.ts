import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PrintWearX — Premium Print & Apparel",
    short_name: "PrintWearX",
    description:
      "Curated picks, honest pricing, fast shipping. Shop electronics, fashion, home & more.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#007AFF",
    scope: "/",
    icons: [
      {
        src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='40' fill='%23007AFF'/%3E%3Cpath d='M96 36 36 60v72c0 39.6 28.8 76.8 60 84 31.2-7.2 60-44.4 60-84V60L96 36z' fill='white'/%3E%3C/svg%3E",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='96' fill='%23007AFF'/%3E%3Cpath d='M256 96 96 160v192c0 105.6 76.8 204.8 160 224 83.2-19.2 160-118.4 160-224V160L256 96z' fill='white'/%3E%3C/svg%3E",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["shopping", "lifestyle"],
    shortcuts: [
      {
        name: "Shop",
        short_name: "Shop",
        url: "/shop",
      },
      {
        name: "Cart",
        short_name: "Cart",
        url: "/cart",
      },
      {
        name: "Search",
        short_name: "Search",
        url: "/search",
      },
    ],
  };
}
