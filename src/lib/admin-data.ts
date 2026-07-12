/**
 * Mock data store for the admin dashboard.
 *
 * All admin pages read from this file. In production, replace each accessor
 * with a fetch() to your real backend (Supabase, Prisma, Sanity dataset, etc.).
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "T-Shirts" | "Hoodies" | "Crewnecks" | "Long-Sleeves" | "Caps" | "Totes";
  price: number;
  cost: number;
  stock: number;
  reserved: number;
  status: "active" | "draft" | "archived";
  image: string;
  rating: number;
  reviewCount: number;
  sales30d: number;
  revenue30d: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "refunded" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded" | "failed";
  items: Array<{ productId: string; name: string; qty: number; unitPrice: number }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: "USD";
  shippingAddress: { city: string; country: string; zip: string };
  placedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  ordersCount: number;
  lifetimeValue: number;
  avgOrderValue: number;
  status: "active" | "vip" | "at_risk" | "blocked";
  lastOrderAt: string;
  tags: string[];
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  startsAt: string;
  endsAt: string;
  uses: number;
  limit: number;
  minOrder: number;
  status: "active" | "scheduled" | "expired";
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  sku: string;
  current: number;
  threshold: number;
  daysOfStock: number;
  supplier: string;
  leadTimeDays: number;
}

export interface ContentItem {
  id: string;
  type: "banner" | "collection" | "blog" | "page";
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  updatedAt: string;
  author: string;
  views: number;
}

/* ─────────────────────── Products ─────────────────────── */

export const products: Product[] = [
  { id: "1", slug: "sunset-wave-tee", name: "Sunset Wave Tee", category: "T-Shirts", price: 32.0, cost: 9, stock: 412, reserved: 18, status: "active", image: "/imgs/sunset_wave_tee.jpg", rating: 4.8, reviewCount: 312, sales30d: 287, revenue30d: 9184, createdAt: "2026-04-12", updatedAt: "2026-07-01" },
  { id: "2", slug: "mountain-peak-hoodie", name: "Mountain Peak Hoodie", category: "Hoodies", price: 68.0, cost: 22, stock: 187, reserved: 12, status: "active", image: "/imgs/mountain_peak_hoodie.jpg", rating: 4.9, reviewCount: 487, sales30d: 198, revenue30d: 13464, createdAt: "2026-03-08", updatedAt: "2026-07-02" },
  { id: "3", slug: "cosmic-dreams-tee", name: "Cosmic Dreams Tee", category: "T-Shirts", price: 36.0, cost: 11, stock: 234, reserved: 8, status: "active", image: "/imgs/cosmic_dreams_tee.jpg", rating: 4.7, reviewCount: 256, sales30d: 142, revenue30d: 5112, createdAt: "2026-05-22", updatedAt: "2026-06-30" },
  { id: "4", slug: "botanical-crewneck", name: "Botanical Crewneck", category: "Crewnecks", price: 54.0, cost: 18, stock: 89, reserved: 4, status: "active", image: "/imgs/botanical_crewneck.jpg", rating: 4.6, reviewCount: 178, sales30d: 67, revenue30d: 3618, createdAt: "2026-04-15", updatedAt: "2026-06-28" },
  { id: "5", slug: "retro-geometric-sweatshirt", name: "Retro Geometric Sweatshirt", category: "Crewnecks", price: 58.0, cost: 19, stock: 124, reserved: 6, status: "active", image: "/imgs/retro_geometric_sweatshirt.jpg", rating: 4.5, reviewCount: 142, sales30d: 89, revenue30d: 5162, createdAt: "2026-05-04", updatedAt: "2026-07-01" },
  { id: "6", slug: "abstract-splash-longsleeve", name: "Abstract Splash Long-Sleeve", category: "Long-Sleeves", price: 42.0, cost: 13, stock: 156, reserved: 5, status: "active", image: "/imgs/abstract_splash_longsleeve.jpg", rating: 4.7, reviewCount: 198, sales30d: 124, revenue30d: 5208, createdAt: "2026-04-30", updatedAt: "2026-06-29" },
  { id: "7", slug: "focus-typography-tee", name: "Focus Typography Tee", category: "T-Shirts", price: 32.0, cost: 9, stock: 287, reserved: 11, status: "active", image: "/imgs/focus_typography_tee.jpg", rating: 4.8, reviewCount: 421, sales30d: 312, revenue30d: 9984, createdAt: "2026-02-18", updatedAt: "2026-07-02" },
  { id: "8", slug: "urban-skyline-hoodie", name: "Urban Skyline Hoodie", category: "Hoodies", price: 72.0, cost: 24, stock: 142, reserved: 9, status: "active", image: "/imgs/urban_skyline_hoodie.jpg", rating: 4.9, reviewCount: 367, sales30d: 178, revenue30d: 12816, createdAt: "2026-03-22", updatedAt: "2026-07-03" },
  { id: "9", slug: "wave-cap", name: "Wave Cap", category: "Caps", price: 28.0, cost: 7, stock: 198, reserved: 3, status: "active", image: "/imgs/wave_cap.jpg", rating: 4.6, reviewCount: 156, sales30d: 142, revenue30d: 3976, createdAt: "2026-05-10", updatedAt: "2026-06-25" },
  { id: "10", slug: "cat-tote", name: "Cat Tote", category: "Totes", price: 24.0, cost: 6, stock: 4, reserved: 2, status: "active", image: "/imgs/cat_tote.jpg", rating: 4.7, reviewCount: 234, sales30d: 187, revenue30d: 4488, createdAt: "2026-04-22", updatedAt: "2026-06-29" },
  { id: "11", slug: "lightning-tee", name: "Lightning Bolt Tee", category: "T-Shirts", price: 34.0, cost: 10, stock: 78, reserved: 2, status: "active", image: "/imgs/lightning_tee.jpg", rating: 4.5, reviewCount: 188, sales30d: 98, revenue30d: 3332, createdAt: "2026-05-19", updatedAt: "2026-06-15" },
  { id: "12", slug: "wolf-emblem-tee", name: "Wolf Emblem Tee", category: "T-Shirts", price: 38.0, cost: 11, stock: 91, reserved: 4, status: "draft", image: "/imgs/wolf_emblem_tee.jpg", rating: 4.8, reviewCount: 274, sales30d: 0, revenue30d: 0, createdAt: "2026-06-12", updatedAt: "2026-07-01" },
];

/* ─────────────────────── Customers ─────────────────────── */

export const customers: Customer[] = [
  { id: "c1", name: "Olivia Chen", email: "olivia.chen@example.com", avatar: "OC", joinedAt: "2024-11-12", ordersCount: 18, lifetimeValue: 4820.50, avgOrderValue: 267.81, status: "vip", lastOrderAt: "2026-07-02", tags: ["repeat", "hoodies"] },
  { id: "c2", name: "Marcus Patel", email: "marcus.patel@example.com", avatar: "MP", joinedAt: "2025-02-04", ordersCount: 7, lifetimeValue: 1834.99, avgOrderValue: 262.14, status: "active", lastOrderAt: "2026-06-28", tags: ["tees"] },
  { id: "c3", name: "Sofia Rodriguez", email: "sofia.r@example.com", avatar: "SR", joinedAt: "2025-08-19", ordersCount: 3, lifetimeValue: 489.97, avgOrderValue: 163.32, status: "active", lastOrderAt: "2026-06-14", tags: ["new"] },
  { id: "c4", name: "Liam O'Connor", email: "liam.oc@example.com", avatar: "LO", joinedAt: "2024-05-22", ordersCount: 24, lifetimeValue: 6210.40, avgOrderValue: 258.77, status: "vip", lastOrderAt: "2026-07-01", tags: ["vip", "crewnecks"] },
  { id: "c5", name: "Aisha Hassan", email: "aisha.h@example.com", avatar: "AH", joinedAt: "2025-12-03", ordersCount: 1, lifetimeValue: 89.99, avgOrderValue: 89.99, status: "at_risk", lastOrderAt: "2026-02-14", tags: ["at-risk"] },
  { id: "c6", name: "Noah Williams", email: "noah.w@example.com", avatar: "NW", joinedAt: "2026-01-08", ordersCount: 5, lifetimeValue: 1149.95, avgOrderValue: 229.99, status: "active", lastOrderAt: "2026-06-22", tags: ["accessories"] },
  { id: "c7", name: "Emma Johansson", email: "emma.j@example.com", avatar: "EJ", joinedAt: "2025-04-30", ordersCount: 12, lifetimeValue: 3104.88, avgOrderValue: 258.74, status: "active", lastOrderAt: "2026-06-19", tags: ["repeat"] },
  { id: "c8", name: "Diego Santos", email: "diego.s@example.com", avatar: "DS", joinedAt: "2024-09-11", ordersCount: 31, lifetimeValue: 8740.21, avgOrderValue: 281.94, status: "vip", lastOrderAt: "2026-07-03", tags: ["vip", "repeat"] },
  { id: "c9", name: "Yuki Tanaka", email: "yuki.t@example.com", avatar: "YT", joinedAt: "2025-06-17", ordersCount: 2, lifetimeValue: 259.98, avgOrderValue: 129.99, status: "active", lastOrderAt: "2026-05-28", tags: ["tees"] },
  { id: "c10", name: "Aisha Khan", email: "aisha.k@example.com", avatar: "AK", joinedAt: "2025-11-29", ordersCount: 0, lifetimeValue: 0, avgOrderValue: 0, status: "blocked", lastOrderAt: "—", tags: ["fraud-risk"] },
];

/* ─────────────────────── Orders ─────────────────────── */

export const orders: Order[] = [
  { id: "o1", number: "PWX-100248", customerId: "c1", customerName: "Olivia Chen", customerEmail: "olivia.chen@example.com", status: "delivered", paymentStatus: "paid", items: [{ productId: "8", name: "Urban Skyline Hoodie", qty: 1, unitPrice: 72.0 }], subtotal: 72.0, tax: 5.76, shipping: 0, total: 77.76, currency: "USD", shippingAddress: { city: "Brooklyn, NY", country: "US", zip: "11201" }, placedAt: "2026-07-02", shippedAt: "2026-07-03", deliveredAt: "2026-07-04" },
  { id: "o2", number: "PWX-100247", customerId: "c4", customerName: "Liam O'Connor", customerEmail: "liam.oc@example.com", status: "shipped", paymentStatus: "paid", items: [{ productId: "2", name: "Mountain Peak Hoodie", qty: 1, unitPrice: 68.0 }, { productId: "1", name: "Sunset Wave Tee", qty: 2, unitPrice: 32.0 }], subtotal: 132.0, tax: 10.56, shipping: 8.99, total: 151.55, currency: "USD", shippingAddress: { city: "Dublin", country: "IE", zip: "D02" }, placedAt: "2026-07-01", shippedAt: "2026-07-02" },
  { id: "o3", number: "PWX-100246", customerId: "c8", customerName: "Diego Santos", customerEmail: "diego.s@example.com", status: "processing", paymentStatus: "paid", items: [{ productId: "7", name: "Focus Typography Tee", qty: 3, unitPrice: 32.0 }], subtotal: 96.0, tax: 7.68, shipping: 0, total: 103.68, currency: "USD", shippingAddress: { city: "São Paulo", country: "BR", zip: "01310" }, placedAt: "2026-07-03" },
  { id: "o4", number: "PWX-100245", customerId: "c2", customerName: "Marcus Patel", customerEmail: "marcus.patel@example.com", status: "pending", paymentStatus: "pending", items: [{ productId: "9", name: "Wave Cap", qty: 1, unitPrice: 28.0 }], subtotal: 28.0, tax: 2.24, shipping: 5.99, total: 36.23, currency: "USD", shippingAddress: { city: "Mumbai", country: "IN", zip: "400001" }, placedAt: "2026-07-03" },
  { id: "o5", number: "PWX-100244", customerId: "c7", customerName: "Emma Johansson", customerEmail: "emma.j@example.com", status: "delivered", paymentStatus: "paid", items: [{ productId: "3", name: "Cosmic Dreams Tee", qty: 1, unitPrice: 36.0 }], subtotal: 36.0, tax: 2.88, shipping: 5.99, total: 44.87, currency: "USD", shippingAddress: { city: "Stockholm", country: "SE", zip: "11122" }, placedAt: "2026-06-19", shippedAt: "2026-06-20", deliveredAt: "2026-06-25" },
  { id: "o6", number: "PWX-100243", customerId: "c6", customerName: "Noah Williams", customerEmail: "noah.w@example.com", status: "refunded", paymentStatus: "refunded", items: [{ productId: "10", name: "Cat Tote", qty: 1, unitPrice: 24.0 }], subtotal: 24.0, tax: 1.92, shipping: 5.99, total: 31.91, currency: "USD", shippingAddress: { city: "Toronto", country: "CA", zip: "M5V" }, placedAt: "2026-06-22" },
  { id: "o7", number: "PWX-100242", customerId: "c1", customerName: "Olivia Chen", customerEmail: "olivia.chen@example.com", status: "delivered", paymentStatus: "paid", items: [{ productId: "1", name: "Sunset Wave Tee", qty: 4, unitPrice: 32.0 }], subtotal: 128.0, tax: 10.24, shipping: 0, total: 138.24, currency: "USD", shippingAddress: { city: "Brooklyn, NY", country: "US", zip: "11201" }, placedAt: "2026-06-15", shippedAt: "2026-06-16", deliveredAt: "2026-06-19" },
  { id: "o8", number: "PWX-100241", customerId: "c3", customerName: "Sofia Rodriguez", customerEmail: "sofia.r@example.com", status: "cancelled", paymentStatus: "refunded", items: [{ productId: "4", name: "Botanical Crewneck", qty: 1, unitPrice: 54.0 }], subtotal: 54.0, tax: 4.32, shipping: 5.99, total: 64.31, currency: "USD", shippingAddress: { city: "Madrid", country: "ES", zip: "28001" }, placedAt: "2026-06-14" },
];

/* ─────────────────────── Discount codes ─────────────────────── */

export const discountCodes: DiscountCode[] = [
  { id: "d1", code: "WELCOME10", type: "percent", value: 10, startsAt: "2026-01-01", endsAt: "2026-12-31", uses: 412, limit: 1000, minOrder: 0, status: "active" },
  { id: "d2", code: "FREESHIP", type: "fixed", value: 8, startsAt: "2026-06-01", endsAt: "2026-07-31", uses: 891, limit: 5000, minOrder: 50, status: "active" },
  { id: "d3", code: "SUMMER25", type: "percent", value: 25, startsAt: "2026-07-01", endsAt: "2026-07-15", uses: 0, limit: 500, minOrder: 100, status: "scheduled" },
  { id: "d4", code: "VIP50", type: "percent", value: 50, startsAt: "2026-04-12", endsAt: "2026-04-19", uses: 88, limit: 100, minOrder: 200, status: "expired" },
];

/* ─────────────────────── Inventory alerts ─────────────────────── */

export const inventoryAlerts: InventoryAlert[] = [
  { productId: "10", productName: "Cat Tote", sku: "PWX-TOT-010", current: 4, threshold: 20, daysOfStock: 3, supplier: "Heritage Canvas Co.", leadTimeDays: 14 },
  { productId: "4", productName: "Botanical Crewneck", sku: "PWX-CRW-004", current: 9, threshold: 25, daysOfStock: 5, supplier: "Pacific Rim Apparel", leadTimeDays: 21 },
  { productId: "11", productName: "Lightning Bolt Tee", sku: "PWX-TEE-011", current: 23, threshold: 30, daysOfStock: 28, supplier: "Northwind Print House", leadTimeDays: 35 },
  { productId: "9", productName: "Wave Cap", sku: "PWX-CAP-009", current: 18, threshold: 25, daysOfStock: 14, supplier: "CapCraft Co.", leadTimeDays: 28 },
];

/* ─────────────────────── Content ─────────────────────── */

export const content: ContentItem[] = [
  { id: "ct1", type: "banner", title: "Summer sale — 25% off selected", slug: "/summer-sale", status: "published", updatedAt: "2026-07-01", author: "Hassan El-Deghidy", views: 12480 },
  { id: "ct2", type: "collection", title: "New arrivals — Q3 2026", slug: "/shop?filter=new", status: "published", updatedAt: "2026-06-28", author: "Hassan El-Deghidy", views: 8912 },
  { id: "ct3", type: "blog", title: "Why heavyweight cotton prints last longer", slug: "/blog/heavyweight-cotton", status: "published", updatedAt: "2026-06-22", author: "Maya Singh", views: 3421 },
  { id: "ct4", type: "page", title: "About PrintWearX", slug: "/about", status: "published", updatedAt: "2026-05-30", author: "Hassan El-Deghidy", views: 1129 },
  { id: "ct5", type: "blog", title: "How we source organic cotton", slug: "/blog/organic-cotton-sourcing", status: "draft", updatedAt: "2026-07-02", author: "Maya Singh", views: 0 },
  { id: "ct6", type: "banner", title: "Winter collection teaser", slug: "/winter-2026", status: "scheduled", updatedAt: "2026-07-03", author: "Hassan El-Deghidy", views: 0 },
];

/* ─────────────────────── Analytics ─────────────────────── */

export const revenue30d = [
  { date: "Jun 4", revenue: 3120, orders: 14 },
  { date: "Jun 7", revenue: 4890, orders: 21 },
  { date: "Jun 10", revenue: 5340, orders: 23 },
  { date: "Jun 13", revenue: 6210, orders: 28 },
  { date: "Jun 16", revenue: 4180, orders: 19 },
  { date: "Jun 19", revenue: 7890, orders: 35 },
  { date: "Jun 22", revenue: 9120, orders: 41 },
  { date: "Jun 25", revenue: 8460, orders: 38 },
  { date: "Jun 28", revenue: 11240, orders: 49 },
  { date: "Jul 1", revenue: 12580, orders: 56 },
];

export const trafficSources = [
  { source: "Organic search", visits: 18420, percentage: 38, color: "#007AFF" },
  { source: "Direct", visits: 12380, percentage: 26, color: "#34C759" },
  { source: "Social media", visits: 8410, percentage: 18, color: "#FF9500" },
  { source: "Email", visits: 4820, percentage: 10, color: "#AF52DE" },
  { source: "Paid ads", visits: 3280, percentage: 8, color: "#FF3B30" },
];

export const conversionFunnel = [
  { stage: "Visits", value: 48310, rate: 100 },
  { stage: "Product views", value: 24120, rate: 49.9 },
  { stage: "Add to cart", value: 7240, rate: 15.0 },
  { stage: "Checkout", value: 3120, rate: 6.5 },
  { stage: "Purchase", value: 1840, rate: 3.8 },
];

export const topProducts30d = [
  { id: "7", name: "Focus Typography Tee", revenue: 9984, units: 312 },
  { id: "1", name: "Sunset Wave Tee", revenue: 9184, units: 287 },
  { id: "2", name: "Mountain Peak Hoodie", revenue: 13464, units: 198 },
  { id: "8", name: "Urban Skyline Hoodie", revenue: 12816, units: 178 },
  { id: "5", name: "Retro Geometric Sweatshirt", revenue: 5162, units: 89 },
];

/* ─────────────────────── Aggregate KPIs ─────────────────────── */

export function getKpis() {
  const totalRevenue = revenue30d.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = revenue30d.reduce((s, r) => s + r.orders, 0);
  const aov = totalRevenue / totalOrders;
  const revenuePrev = totalRevenue * 0.84; // pretend last month was 16% lower
  const ordersPrev = Math.round(totalOrders * 0.91);
  const aovPrev = revenuePrev / ordersPrev;
  const customersTotal = customers.length;
  const returningRate = 64.2; // %
  return {
    revenue: totalRevenue,
    revenueDelta: ((totalRevenue - revenuePrev) / revenuePrev) * 100,
    orders: totalOrders,
    ordersDelta: ((totalOrders - ordersPrev) / ordersPrev) * 100,
    aov,
    aovDelta: ((aov - aovPrev) / aovPrev) * 100,
    customers: customersTotal,
    returningRate,
  };
}