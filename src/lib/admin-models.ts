/**
 * Extended admin data models. These complement the core models in
 * `admin-data.ts`. In production each model maps to a database table;
 * here we ship realistic mock data so every admin page is populated.
 */

import { products as baseProducts, customers as baseCustomers, orders as baseOrders } from "./admin-data";

/* ─────────────────────── Product Variant ─────────────────────── */

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  option: string;        // "Red / M", "256GB / Silver"
  price: number;
  cost: number;
  stock: number;
  reserved: number;
  image?: string;
  barcode?: string;
  weight?: number;       // grams
}

export const variants: ProductVariant[] = [
  // Organic Cotton Tee
  { id: "v1", productId: "5", sku: "PWX-TEE-005-WHT-S", option: "White / S", price: 39.99, cost: 11, stock: 42, reserved: 2 },
  { id: "v2", productId: "5", sku: "PWX-TEE-005-WHT-M", option: "White / M", price: 39.99, cost: 11, stock: 88, reserved: 4 },
  { id: "v3", productId: "5", sku: "PWX-TEE-005-WHT-L", option: "White / L", price: 39.99, cost: 11, stock: 67, reserved: 3 },
  { id: "v4", productId: "5", sku: "PWX-TEE-005-BLK-S", option: "Black / S", price: 39.99, cost: 11, stock: 31, reserved: 1 },
  { id: "v5", productId: "5", sku: "PWX-TEE-005-BLK-M", option: "Black / M", price: 39.99, cost: 11, stock: 56, reserved: 2 },
  { id: "v6", productId: "5", sku: "PWX-TEE-005-BLK-L", option: "Black / L", price: 39.99, cost: 11, stock: 28, reserved: 2 },
  // Running Shoes X1
  { id: "v7", productId: "6", sku: "PWX-SHO-006-09", option: "US 9 / Black", price: 159.99, cost: 48, stock: 3, reserved: 1 },
  { id: "v8", productId: "6", sku: "PWX-SHO-006-10", option: "US 10 / Black", price: 159.99, cost: 48, stock: 4, reserved: 1 },
  { id: "v9", productId: "6", sku: "PWX-SHO-006-11", option: "US 11 / Black", price: 159.99, cost: 48, stock: 2, reserved: 1 },
  // Premium Leather Watch
  { id: "v10", productId: "1", sku: "PWX-WAT-001-BRN", option: "Brown strap", price: 299.99, cost: 110, stock: 89, reserved: 5 },
  { id: "v11", productId: "1", sku: "PWX-WAT-001-BLK", option: "Black strap", price: 299.99, cost: 110, stock: 53, reserved: 3 },
  // Wireless Headphones Pro
  { id: "v12", productId: "2", sku: "PWX-HDP-002-BLK", option: "Black", price: 199.99, cost: 65, stock: 47, reserved: 2 },
  { id: "v13", productId: "2", sku: "PWX-HDP-002-WHT", option: "White", price: 199.99, cost: 65, stock: 40, reserved: 2 },
];

export function variantsForProduct(productId: string) {
  return variants.filter((v) => v.productId === productId);
}

/* ─────────────────────── Address ─────────────────────── */

export interface Address {
  id: string;
  customerId: string;
  type: "shipping" | "billing";
  isDefault: boolean;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  zip: string;
  country: string;
  phone?: string;
}

export const addresses: Address[] = [
  { id: "a1", customerId: "c1", type: "shipping", isDefault: true, fullName: "Olivia Chen", line1: "120 Bedford Ave", line2: "Apt 4B", city: "Brooklyn", region: "NY", zip: "11201", country: "US", phone: "+1 555-0123" },
  { id: "a2", customerId: "c4", type: "shipping", isDefault: true, fullName: "Liam O'Connor", line1: "44 Grafton Street", city: "Dublin", region: "D2", zip: "D02", country: "IE" },
  { id: "a3", customerId: "c8", type: "shipping", isDefault: true, fullName: "Diego Santos", line1: "Av. Paulista 1000", line2: "Sala 1201", city: "São Paulo", region: "SP", zip: "01310-100", country: "BR" },
  { id: "a4", customerId: "c2", type: "shipping", isDefault: true, fullName: "Marcus Patel", line1: "12 Marine Drive", city: "Mumbai", region: "MH", zip: "400001", country: "IN" },
];

/* ─────────────────────── Review ─────────────────────── */

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  photos: number;
  verified: boolean;
  status: "pending" | "approved" | "rejected" | "spam";
  response?: { body: string; respondedAt: string };
  createdAt: string;
  helpful: number;
}

export const reviews: Review[] = [
  { id: "r1", productId: "5", customerId: "c1", customerName: "Olivia Chen", rating: 5, title: "Best organic tee I've owned", body: "Soft, fits true to size, holds up after multiple washes. Worth every penny.", photos: 2, verified: true, status: "approved", response: { body: "Thanks Olivia — glad you love it!", respondedAt: "2026-06-12" }, createdAt: "2026-06-08", helpful: 24 },
  { id: "r2", productId: "5", customerId: "c7", customerName: "Emma Johansson", rating: 4, title: "Great quality, runs slightly small", body: "Loved the fabric. I'd recommend sizing up if you're between sizes.", photos: 0, verified: true, status: "approved", createdAt: "2026-06-04", helpful: 12 },
  { id: "r3", productId: "2", customerId: "c8", customerName: "Diego Santos", rating: 5, title: "Noise cancellation is unreal", body: "Daily commute transformed. 30h battery is real, I tested.", photos: 1, verified: true, status: "approved", createdAt: "2026-06-18", helpful: 41 },
  { id: "r4", productId: "2", customerId: "c4", customerName: "Liam O'Connor", rating: 3, title: "Good but ear cups tight", body: "Sound is great but after 2 hours my ears get sore.", photos: 0, verified: true, status: "approved", createdAt: "2026-06-22", helpful: 8 },
  { id: "r5", productId: "10", customerId: "c6", customerName: "Noah Williams", rating: 2, title: "Stitching came loose", body: "Quality issue — sent photos to support. Awaiting refund.", photos: 3, verified: true, status: "pending", createdAt: "2026-07-02", helpful: 0 },
  { id: "r6", productId: "9", customerId: "c1", customerName: "Olivia Chen", rating: 5, title: "Stunning coat", body: "Worth the price. Heavy, warm, looks expensive.", photos: 4, verified: true, status: "approved", createdAt: "2026-06-29", helpful: 19 },
  { id: "r7", productId: "1", customerId: "c8", customerName: "Diego Santos", rating: 5, title: "Swiss movement, classic look", body: "Genuine Italian leather feels premium. Keeps perfect time.", photos: 0, verified: true, status: "approved", createdAt: "2026-06-15", helpful: 31 },
  { id: "r8", productId: "5", customerId: "c9", customerName: "Yuki Tanaka", rating: 1, title: "Looks like a different brand", body: "Packaging was off, very disappointed.", photos: 1, verified: false, status: "spam", createdAt: "2026-06-30", helpful: 0 },
  { id: "r9", productId: "8", customerId: "c2", customerName: "Marcus Patel", rating: 4, title: "Great tracker for the price", body: "Accurate HR, decent sleep tracking. App could be better.", photos: 0, verified: true, status: "approved", createdAt: "2026-06-11", helpful: 16 },
  { id: "r10", productId: "11", customerId: "c7", customerName: "Emma Johansson", rating: 5, title: "Beautiful planters", body: "Plants look stunning in these. The matte finish is gorgeous.", photos: 2, verified: true, status: "pending", createdAt: "2026-07-03", helpful: 0 },
];

/* ─────────────────────── Refund ─────────────────────── */

export interface Refund {
  id: string;
  number: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: "customer_request" | "damaged" | "wrong_item" | "not_received" | "other";
  status: "pending" | "approved" | "processing" | "refunded" | "rejected";
  notes: string;
  requestedAt: string;
  resolvedAt?: string;
  refundedTo: "original_payment" | "store_credit" | "exchange";
}

export const refunds: Refund[] = [
  { id: "rf1", number: "REF-100024", orderId: "o6", orderNumber: "PWX-100243", customerId: "c6", customerName: "Noah Williams", amount: 92.38, reason: "damaged", status: "refunded", notes: "Stitching came loose — customer sent photos.", requestedAt: "2026-06-24", resolvedAt: "2026-06-25", refundedTo: "original_payment" },
  { id: "rf2", number: "REF-100025", orderId: "o8", orderNumber: "PWX-100242", customerId: "c3", customerName: "Sofia Rodriguez", amount: 59.98, reason: "customer_request", status: "refunded", notes: "Changed mind.", requestedAt: "2026-06-16", resolvedAt: "2026-06-17", refundedTo: "original_payment" },
  { id: "rf3", number: "REF-100026", orderId: "o5", orderNumber: "PWX-100244", customerId: "c7", customerName: "Emma Johansson", amount: 45.00, reason: "damaged", status: "pending", notes: "Lamp arrived broken. Photos attached.", requestedAt: "2026-07-03", refundedTo: "store_credit" },
];

/* ─────────────────────── Collection ─────────────────────── */

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  productIds: string[];
  type: "manual" | "automatic";
  rule?: string;        // for automatic, e.g. "category = Fashion AND tag = new-arrival"
  status: "published" | "draft";
  updatedAt: string;
  hero: string;         // gradient tailwind classes
  accent: string;
}

export const collections: Collection[] = [
  { id: "cl1", title: "New arrivals", slug: "new-arrivals", description: "Just dropped — last 30 days", productIds: ["1", "9", "10", "11", "12"], type: "automatic", rule: "createdAt > 30 days ago", status: "published", updatedAt: "2026-07-01", hero: "from-primary-500 to-primary-700", accent: "primary" },
  { id: "cl2", title: "Best sellers", slug: "best-sellers", description: "Top revenue generators", productIds: ["5", "2", "8", "10", "6"], type: "automatic", rule: "top by revenue (30d)", status: "published", updatedAt: "2026-07-03", hero: "from-amber-500 to-orange-600", accent: "amber" },
  { id: "cl3", title: "Sustainable picks", slug: "sustainable", description: "Eco-friendly, organic, ethical", productIds: ["5", "11", "9"], type: "manual", status: "published", updatedAt: "2026-06-22", hero: "from-emerald-500 to-teal-600", accent: "emerald" },
  { id: "cl4", title: "Gift under $100", slug: "gifts-under-100", description: "Perfect gifts", productIds: ["4", "5", "7", "11"], type: "automatic", rule: "price < 100 AND tag = giftable", status: "draft", updatedAt: "2026-06-30", hero: "from-pink-500 to-rose-600", accent: "pink" },
];

/* ─────────────────────── Tag ─────────────────────── */

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: string;
}

export const tags: Tag[] = [
  { id: "t1", name: "new-arrival", slug: "new-arrival", count: 12, color: "#007AFF" },
  { id: "t2", name: "bestseller", slug: "bestseller", count: 5, color: "#FF9500" },
  { id: "t3", name: "sustainable", slug: "sustainable", count: 8, color: "#34C759" },
  { id: "t4", name: "limited-edition", slug: "limited-edition", count: 3, color: "#AF52DE" },
  { id: "t5", name: "giftable", slug: "giftable", count: 18, color: "#FF2D55" },
  { id: "t6", name: "staff-pick", slug: "staff-pick", count: 6, color: "#5856D6" },
];

/* ─────────────────────── Activity Event (audit log) ─────────────────────── */

export interface ActivityEvent {
  id: string;
  actor: string;       // user name or "system"
  action: string;
  target?: string;     // entity name
  targetType?: "product" | "order" | "customer" | "discount" | "campaign" | "content" | "settings" | "auth" | "integration";
  meta?: Record<string, string | number>;
  at: string;          // ISO date
  ip?: string;
}

export const activity: ActivityEvent[] = [
  { id: "ev1", actor: "Hassan El-Deghidy", action: "signed in", targetType: "auth", at: "2026-07-04 08:42", ip: "203.0.113.42" },
  { id: "ev2", actor: "system", action: "order placed", target: "PWX-100246", targetType: "order", meta: { total: 1403.99 }, at: "2026-07-03 19:18" },
  { id: "ev3", actor: "Hassan El-Deghidy", action: "marked order shipped", target: "PWX-100247", targetType: "order", at: "2026-07-02 16:30" },
  { id: "ev4", actor: "Maya Singh", action: "edited content", target: "Summer sale banner", targetType: "content", at: "2026-07-01 14:22" },
  { id: "ev5", actor: "Hassan El-Deghidy", action: "updated inventory for", target: "Leather Wallet", targetType: "product", meta: { added: 50 }, at: "2026-07-01 11:08" },
  { id: "ev6", actor: "system", action: "low stock alert fired for", target: "Leather Wallet", targetType: "product", at: "2026-06-30 23:50" },
  { id: "ev7", actor: "system", action: "refund processed for", target: "PWX-100243", targetType: "order", meta: { amount: 92.38 }, at: "2026-06-25 09:14" },
  { id: "ev8", actor: "Hassan El-Deghidy", action: "rotated API key", target: "Stripe webhook", targetType: "integration", at: "2026-06-22 17:00" },
  { id: "ev9", actor: "Maya Singh", action: "approved review", target: "on Premium Leather Watch", targetType: "product", at: "2026-06-22 12:41" },
  { id: "ev10", actor: "system", action: "campaign sent", target: "Abandoned cart recovery", targetType: "campaign", meta: { sent: 24 }, at: "2026-06-15 09:00" },
  { id: "ev11", actor: "Hassan El-Deghidy", action: "created discount", target: "SUMMER25", targetType: "discount", at: "2026-06-10 11:00" },
  { id: "ev12", actor: "Hassan El-Deghidy", action: "signed in", targetType: "auth", at: "2026-06-09 09:22", ip: "203.0.113.42" },
];

/* ─────────────────────── Webhook ─────────────────────── */

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];       // order.created, product.updated, etc.
  status: "active" | "paused" | "failing";
  lastDeliveryAt?: string;
  lastStatus?: number;    // HTTP status
  successRate: number;    // last 30d
  deliveries: number;     // last 30d
}

export const webhooks: Webhook[] = [
  { id: "wh1", name: "Stripe → accounting", url: "https://api.xero.com/webhooks/pwx", events: ["order.paid", "order.refunded"], status: "active", lastDeliveryAt: "2026-07-03 19:18", lastStatus: 200, successRate: 99.4, deliveries: 1842 },
  { id: "wh2", name: "Klaviyo email sync", url: "https://a.klaviyo.com/api/webhooks/printwearx", events: ["customer.created", "order.placed"], status: "active", lastDeliveryAt: "2026-07-03 18:42", lastStatus: 200, successRate: 100, deliveries: 481 },
  { id: "wh3", name: "Inventory sync — ERP", url: "https://erp.printwearx.com/inbound", events: ["product.updated", "product.stock_changed"], status: "failing", lastDeliveryAt: "2026-07-03 11:08", lastStatus: 503, successRate: 84.2, deliveries: 238 },
];

/* ─────────────────────── Integration ─────────────────────── */

export interface Integration {
  id: string;
  name: string;
  category: "analytics" | "email" | "shipping" | "accounting" | "automation" | "support" | "social";
  status: "connected" | "available";
  description: string;
  installs: number;
  rating: number;
  icon: string;       // letter or emoji for the tile
  color: string;
}

export const integrations: Integration[] = [
  { id: "i1", name: "Google Analytics", category: "analytics", status: "connected", description: "Track sessions, conversion, audience", installs: 4820, rating: 4.7, icon: "GA", color: "#F9AB00" },
  { id: "i2", name: "Meta Pixel", category: "analytics", status: "connected", description: "Facebook + Instagram ad tracking", installs: 3210, rating: 4.5, icon: "M", color: "#1877F2" },
  { id: "i3", name: "Klaviyo", category: "email", status: "connected", description: "Email + SMS marketing automation", installs: 1940, rating: 4.8, icon: "K", color: "#000000" },
  { id: "i4", name: "ShipStation", category: "shipping", status: "connected", description: "Multi-carrier shipping & labels", installs: 2810, rating: 4.6, icon: "SS", color: "#1A73E8" },
  { id: "i5", name: "Xero", category: "accounting", status: "connected", description: "Accounting & invoicing", installs: 1620, rating: 4.5, icon: "X", color: "#13B5EA" },
  { id: "i6", name: "Zapier", category: "automation", status: "available", description: "Connect to 5000+ apps", installs: 3120, rating: 4.6, icon: "Z", color: "#FF4A00" },
  { id: "i7", name: "Intercom", category: "support", status: "available", description: "Live chat + helpdesk", installs: 2210, rating: 4.7, icon: "IC", color: "#1F8DED" },
  { id: "i8", name: "TikTok Pixel", category: "analytics", status: "available", description: "TikTok ad performance", installs: 1480, rating: 4.4, icon: "TT", color: "#000000" },
  { id: "i9", name: "Mailchimp", category: "email", status: "available", description: "Email marketing", installs: 2890, rating: 4.5, icon: "MC", color: "#FFE01B" },
  { id: "i10", name: "DHL Express", category: "shipping", status: "available", description: "International express shipping", installs: 920, rating: 4.4, icon: "DH", color: "#FFCC00" },
];

/* ─────────────────────── Gift Card ─────────────────────── */

export interface GiftCard {
  id: string;
  code: string;
  initialBalance: number;
  balance: number;
  status: "active" | "depleted" | "expired" | "voided";
  issuedAt: string;
  expiresAt: string;
  issuedTo?: string;
  lastUsedAt?: string;
}

export const giftCards: GiftCard[] = [
  { id: "gc1", code: "GIFT-ABCD-1234", initialBalance: 100, balance: 64.50, status: "active", issuedAt: "2026-05-12", expiresAt: "2027-05-12", issuedTo: "Emma Johansson", lastUsedAt: "2026-07-01" },
  { id: "gc2", code: "GIFT-EFGH-5678", initialBalance: 50, balance: 0, status: "depleted", issuedAt: "2026-03-04", expiresAt: "2027-03-04", issuedTo: "Aisha Khan", lastUsedAt: "2026-06-20" },
  { id: "gc3", code: "GIFT-IJKL-9012", initialBalance: 25, balance: 25, status: "active", issuedAt: "2026-06-30", expiresAt: "2027-06-30", issuedTo: "Yuki Tanaka" },
];

/* ─────────────────────── Helpers ─────────────────────── */

export function getProduct(id: string) {
  return baseProducts.find((p) => p.id === id);
}

export function getCustomer(id: string) {
  return baseCustomers.find((c) => c.id === id);
}

export function getOrder(id: string) {
  return baseOrders.find((o) => o.id === id);
}

export function getCustomerOrders(customerId: string) {
  return baseOrders.filter((o) => o.customerId === customerId);
}

export function getProductReviews(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function getCustomerAddresses(customerId: string) {
  return addresses.filter((a) => a.customerId === customerId);
}