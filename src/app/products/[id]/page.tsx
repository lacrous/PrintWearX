import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductDetailPage } from "@/views/product-detail";
import { getProductBySlug, products } from "@/lib/products";
import { notFound } from "next/navigation";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://printwearx.app";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) return {};
  const url = `${SITE_URL}/products/${product.slug}`;
  const description =
    product.longDescription ?? product.description;
  return {
    title: `${product.name} — ${product.category}`,
    description: description.slice(0, 160),
    keywords: [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      "print on demand",
      "premium cotton",
      "original artwork",
      ...(product.colors ?? []).map((c) => c.toLowerCase()),
      ...(product.sizes ?? []).map((s) => `${product.name.toLowerCase()} ${s.toLowerCase()}`),
    ],
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: description.slice(0, 200),
      url,
      type: "website",
      siteName: "PrintWearX",
      images: product.image
        ? [
            {
              url: product.image,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description.slice(0, 200),
      images: product.image ? [product.image] : undefined,
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "USD",
    },
  };
}

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) notFound();

  const productUrl = `${SITE_URL}/products/${product.slug}`;

  // JSON-LD Product + BreadcrumbList for Google rich snippets.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.longDescription ?? product.description,
      image: product.image ? [`${SITE_URL}${product.image}`] : undefined,
      category: product.category,
      sku: product.id,
      mpn: product.id,
      brand: {
        "@type": "Brand",
        name: "PrintWearX",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews,
        bestRating: 5,
        worstRating: 1,
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "USD",
        price: product.price,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "PrintWearX",
          url: SITE_URL,
        },
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "US",
          },
          freeShippingThreshold: {
            "@type": "MonetaryAmount",
            value: 50,
            currency: "USD",
          },
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop",
          item: `${SITE_URL}/shop`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.category,
          item: `${SITE_URL}/shop?category=${encodeURIComponent(
            product.category
          )}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: product.name,
          item: productUrl,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content" tabIndex={-1} className="md:pb-0 pb-32">
        <ProductDetailPage />
      </main>
      <Footer />
    </>
  );
}