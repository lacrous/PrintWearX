/**
 * CMS abstraction layer.
 *
 * Production: connects to a Sanity project via `@sanity/client`.
 * Fallback (dev/no env): uses the in-memory mock from `lib/products.ts`.
 *
 * Set the following env vars to switch to real Sanity:
 *   VITE_SANITY_PROJECT_ID
 *   VITE_SANITY_DATASET       (default: "production")
 *   VITE_SANITY_API_VERSION   (default: "2024-12-01")
 *   VITE_SANITY_TOKEN         (only for previewing drafts)
 */

import { products as mockProducts, type Product } from "./products";

export interface CMSProduct extends Product {}

let sanityClient: any = null;

async function getClient() {
  if (sanityClient) return sanityClient;
  const projectId = (import.meta as any).env?.VITE_SANITY_PROJECT_ID;
  if (!projectId) return null;

  const { createClient } = await import("@sanity/client");
  sanityClient = createClient({
    projectId,
    dataset: (import.meta as any).env?.VITE_SANITY_DATASET || "production",
    apiVersion: (import.meta as any).env?.VITE_SANITY_API_VERSION || "2024-12-01",
    token: (import.meta as any).env?.VITE_SANITY_TOKEN,
    useCdn: true,
    perspective: "published",
  });
  return sanityClient;
}

function fromSanity(doc: any): Product {
  return {
    id: doc._id,
    slug: doc.slug?.current ?? doc._id,
    name: doc.name,
    description: doc.description,
    longDescription: doc.longDescription,
    price: doc.price,
    image: doc.image?.asset?.url ?? doc.image ?? "/imgs/placeholder.jpg",
    category: doc.category,
    rating: doc.rating ?? 4.5,
    reviews: doc.reviews ?? 0,
    inStock: doc.inStock ?? true,
    features: doc.features ?? [],
    colors: doc.colors ?? [],
    sizes: doc.sizes ?? [],
  };
}

/* ──────────────────────────── Public API ──────────────────────────── */

export async function listProducts(opts?: {
  category?: string;
  search?: string;
  limit?: number;
  sort?: "featured" | "price-low" | "price-high" | "rating" | "newest";
}): Promise<Product[]> {
  const client = await getClient();

  if (!client) {
    let result = mockProducts.slice();
    if (opts?.category)
      result = result.filter((p) => p.category === opts.category);
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (opts?.sort === "price-low")
      result.sort((a, b) => a.price - b.price);
    else if (opts?.sort === "price-high")
      result.sort((a, b) => b.price - a.price);
    else if (opts?.sort === "rating")
      result.sort((a, b) => b.rating - a.rating);
    if (opts?.limit) result = result.slice(0, opts.limit);
    return result;
  }

  const filters: string[] = ['inStock == true'];
  if (opts?.category) filters.push(`category == "${opts.category}"`);
  const where = filters.length ? `*[${filters.join(" && ")}]` : '*';

  let q = client.fetch(
    `${where} | order(featured desc, _createdAt desc) ${
      opts?.limit ? `[0...${opts.limit}]` : ""
    }`
  );
  if (opts?.search) {
    q = client.fetch(
      `${where} && (name match "*${opts.search}*" || category match "*${opts.search}*" || description match "*${opts.search}*") ${
        opts?.limit ? `[0...${opts.limit}]` : ""
      }`
    );
  }
  const docs = await q;
  let products = docs.map(fromSanity);

  if (opts?.sort === "price-low") products.sort((a: Product, b: Product) => a.price - b.price);
  else if (opts?.sort === "price-high")
    products.sort((a: Product, b: Product) => b.price - a.price);
  else if (opts?.sort === "rating")
    products.sort((a: Product, b: Product) => b.rating - a.rating);

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = await getClient();

  if (!client) {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }

  const doc = await client.fetch(
    `*[_type == "product" && slug.current == "${slug}"][0]`
  );
  return doc ? fromSanity(doc) : null;
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  const products = await listProducts({ category, limit: limit + 5 });
  return products.filter((p) => p.id !== productId).slice(0, limit);
}

export async function isCMSConnected(): Promise<boolean> {
  const client = await getClient();
  return client !== null;
}
