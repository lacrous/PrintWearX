# PrintWearX

> Modern print-on-demand apparel storefront with a full admin dashboard. Built with Next.js 15, React 19, Tailwind v4, and a clean static-export deployment.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production-success)]()

PrintWearX is a complete e-commerce frontend for a print-on-demand apparel brand. It ships a polished customer storefront, a gated admin dashboard with 15+ management pages, PWA support, and ships as a single static-export bundle that can be hosted on any CDN.

**Live demo:** [printwearx.app](https://kllgiz68e3jr.space.minimax.io)

---

## ✨ Features

### Storefront
- **Landing page** with hero, category tiles, bestsellers, benefits, stats, testimonials, newsletter, and final CTA
- **Shop** with category filter, sort, price range, rating filter, search, and bottom-sheet filter drawer on mobile
- **Product detail** with image gallery, color/size variants, quantity selector, mobile sticky CTA, related products, and trust badges
- **Cart** with quantity controls, promo code, and mobile sticky checkout
- **Checkout** with shipping form, payment selector (Stripe-ready), and order summary
- **Search** with live suggestions, popular categories, and recent searches
- **Auth** with modern glassmorphic design, passwordless option, social login (Google, Facebook)
- **Order success** with order details, next steps, and recommendations
- **Mobile bottom nav** with safe-area insets, badge support
- **Dark mode** with no-FOUC preload and persistent preference
- **PWA** with manifest, service worker, offline page, and install prompt
- **Skip link**, semantic HTML, ARIA labels, keyboard nav, focus rings

### Admin dashboard (`/admin`)
- **Dashboard** with KPI cards, revenue area chart, recent orders, top products
- **Analytics** with traffic donut, conversion funnel, and 30-day series
- **Products** list with bulk actions, filters, detail drawer, search
- **Product form** with variants, images, SEO, inventory tracking
- **Orders** list with status filters, detail drawer, status timeline
- **Order detail** with line items, customer, shipping, payment
- **Customers** list with VIP/at-risk segmentation
- **Customer detail** with order history, lifetime value, tags
- **Inventory** with stock levels, low-stock alerts
- **Restock** flow with supplier and lead time
- **Marketing** with discount codes and email campaigns
- **Discounts** with code builder, usage limits, category targeting
- **Campaigns** with audience builder, send preview, performance
- **Content** manager (banners, collections, blog, pages)
- **Reviews** moderation
- **Refunds** with full / partial / store credit
- **Collections** with manual and dynamic rules
- **Integrations** (Stripe, Mailchimp, Meta Pixel, etc.)
- **Audit log** of all admin actions
- **Settings** (General, Payments, Shipping, Tax, Team, Notifications, Security)

### Engineering
- **Next.js 15 App Router** with `output: "export"` for CDN deployment
- **TypeScript** strict mode
- **Tailwind v4** CSS-first with `@theme` design tokens
- **Zustand** for cart and UI state (persist + auto-apply theme)
- **Framer Motion** for admin charts and animations
- **PWA** with workbox-free service worker
- **JSON-LD** Product schema on every product page
- **Clean URLs** (no `.html` in browser) via History API + inline redirect script
- **Responsive** mobile-first design with safe-area insets and 44px touch targets
- **A11y** skip link, ARIA, keyboard nav, focus rings, semantic HTML

---

## 🚀 Quick start

```bash
# Clone
git clone https://github.com/nurovia/printwearx.git
cd printwearx

# Install
npm install

# Develop
npm run dev
# → http://localhost:3000

# Build (static export)
npm run build
# → ./out (deploy this directory to any CDN)

# Serve locally to test the static build
npx serve out
```

### Demo credentials

The admin dashboard uses a localStorage-based mock auth (for demo). In production, replace `src/lib/auth-client.ts` with a real backend.

| Role     | Email                    | Password   |
| -------- | ------------------------ | ---------- |
| Admin    | `admin@printwearx.com`   | `admin123` |
| Customer | `demo@printwearx.com`    | `demo123`  |

Any email starting with `admin` + any 6+ character password also works as admin.

---

## 📦 Tech stack

| Layer            | Choice                                         |
| ---------------- | ---------------------------------------------- |
| Framework        | Next.js 15.5 (App Router)                      |
| Language         | TypeScript 5                                   |
| UI               | React 19                                       |
| Styling          | Tailwind CSS v4 (CSS-first)                    |
| State            | Zustand (with persist)                         |
| Animations       | Framer Motion (admin only)                     |
| Icons            | Lucide React                                   |
| Fonts            | Inter (Google Fonts)                           |
| Charts           | Custom SVG (no chart library)                  |
| Auth             | localStorage mock (replace with NextAuth/Clerk)|
| Payments         | Stripe Elements (env-gated, demo fallback)     |
| CMS              | Sanity (env-gated, mock fallback)              |
| Deployment       | Static export → any CDN                        |

---

## 🏗 Project structure

```
printwearx/
├── .github/                       # GitHub templates
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                        # Static assets (served at /)
│   ├── imgs/                      # 12 product images
│   ├── sw.js                      # Service worker
│   ├── manifest.webmanifest
│   └── offline.html
├── sanity/                        # Sanity CMS schemas (env-gated)
│   └── schemas/product.ts
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (admin)/admin/         # Admin route group
│   │   │   ├── layout.tsx         # AdminGate + AdminShell
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── analytics/
│   │   │   ├── products/          # List + /new + /[id]/edit
│   │   │   ├── orders/            # List + /[id]
│   │   │   ├── customers/         # List + /[id]
│   │   │   ├── inventory/         # List + /restock/[id]
│   │   │   ├── marketing/
│   │   │   ├── discounts/         # /new + /[id]/edit
│   │   │   ├── campaigns/         # /new + /[id]
│   │   │   ├── content/           # List + /new + /[id]/edit
│   │   │   ├── reviews/
│   │   │   ├── refunds/
│   │   │   ├── collections/
│   │   │   ├── integrations/
│   │   │   ├── audit-log/
│   │   │   └── settings/
│   │   ├── shop/
│   │   ├── products/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order-success/
│   │   ├── search/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── actions/               # Server actions
│   │   ├── layout.tsx             # Root layout (head scripts)
│   │   ├── template.tsx           # Route fade transitions
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── manifest.ts
│   │   └── globals.css            # Tailwind v4 + design tokens
│   ├── components/
│   │   ├── admin/                 # Admin shell, gate, charts, forms, toast
│   │   ├── auth/                  # Auth card
│   │   ├── cart/                  # Stripe payment element
│   │   ├── layout/                # Header, footer, mobile nav, search
│   │   ├── product/               # Product card, filter pills
│   │   ├── ui/                    # Button, input, image-fallback, skeleton
│   │   ├── pwa-install.tsx
│   │   └── error-boundary.tsx
│   ├── lib/
│   │   ├── admin-data.ts          # Mock product/order/customer data
│   │   ├── admin-models.ts        # TypeScript types for all models
│   │   ├── admin-auth.ts          # Admin auth helpers
│   │   ├── auth-client.ts         # Client-side login/signup
│   │   ├── payment-client.ts      # Client-side payment helpers
│   │   ├── cms.ts                 # Sanity abstraction (env-gated)
│   │   ├── nav.tsx                # Link/router shim
│   │   ├── products.ts            # Product catalog
│   │   ├── store.ts               # Zustand (cart + UI state)
│   │   └── utils.ts               # cn, formatCurrency, etc.
│   ├── views/                     # Page-level client components
│   │   ├── landing.tsx
│   │   ├── shop.tsx
│   │   ├── product-detail.tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── order-success.tsx
│   │   ├── search.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── not-found.tsx
│   │   └── admin/                 # 15+ admin page components
│   └── middleware.ts.template     # Edge middleware (Node runtime)
├── next.config.mjs                # output: "export", unoptimized: true
├── tsconfig.json
├── postcss.config.mjs
├── package.json
├── .gitignore
├── .env.example                   # Environment variables template
├── .nvmrc                         # Node version
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
└── README.md
```

---

## 🌍 Deployment

This project uses Next.js `output: "export"` to generate a fully static bundle in `./out/`. Deploy it to **any** static host:

### Cloudflare Pages
```bash
# Build command: npm run build
# Output directory: out
```

### Vercel
```bash
vercel --prod
# (Vercel auto-detects the static export)
```

### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"
```

### AWS S3 + CloudFront
```bash
aws s3 sync out/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### GitHub Pages
```bash
npm run build
# Push ./out to gh-pages branch
npx gh-pages -d out
```

### Any static host
Upload the contents of `./out/` to your host. That's it. No Node server required.

---

## 🔧 Configuration

Copy `.env.example` to `.env.local` and fill in the values you need. **All variables are optional** — the project works with sensible mocks out of the box.

```bash
# Site URL (used for absolute OG image URLs and canonical)
NEXT_PUBLIC_SITE_URL=https://printwearx.com

# Sanity CMS (optional — falls back to mock data)
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_TOKEN=

# Stripe (optional — falls back to demo-mode form)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

## 🧪 Testing the build

```bash
# Production build
npm run build

# Serve the static export
npx serve out

# Open http://localhost:3000
```

Test these flows:
- [x] Home page loads with hero, products, categories
- [x] Click any product → detail page loads
- [x] Add to cart → cart count updates in header
- [x] Cart page shows items, totals, mobile sticky checkout
- [x] Checkout page renders shipping form
- [x] Search bar in header shows suggestions
- [x] Dark mode toggle persists across navigation
- [x] Navigate to `/admin` → admin sign-in form (no `.html` in URL)
- [x] Sign in with `admin@printwearx.com` / `admin123` → admin dashboard
- [x] All admin pages render with charts, tables, filters
- [x] Resize to mobile → bottom nav appears, sticky CTAs work
- [x] All touch targets ≥ 44px

---

## 🎨 Design system

**Colors** (defined as CSS variables in `globals.css`):
- Primary: `#007AFF` (Apple system blue)
- Surface: `#FAFAFA` (light), `#0A0A0A` (dark)
- Text: `#0A0A0A` / `#FAFAFA`
- Accent gradients: blue→cyan, pink→rose, amber→orange, emerald→teal

**Typography**: Inter, with `font-feature-settings: "cv11", "ss01"` for Apple-style numerics.

**Spacing**: Tailwind defaults + custom `pb-safe` for iPhone home indicator.

**Touch targets**: All interactive elements ≥ 44px (Apple HIG).

**Border radius**: 14px for buttons, 16-24px for cards, 32px for modals.

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

For security issues, see [SECURITY.md](SECURITY.md) — please **don't** open public issues for security bugs.

---

## 📄 License

[MIT](LICENSE) © Hassan El-Deghidy / [Nurovia](https://nurovia.dev)

---

## 🏢 About Nurovia

PrintWearX is built by **[Nurovia](https://nurovia.dev)** — an AI-native product company shipping industry-defining software. We build intelligent tools that help people and businesses work faster, decide better, and automate the complex.

- 🌐 [nurovia.dev](https://nurovia.dev)
- 🐦 [@nurovia](https://twitter.com/nurovia)
- 📧 hello@nurovia.dev

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) — the framework
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [Lucide](https://lucide.dev) — beautiful icons
- [Framer Motion](https://www.framer.com/motion/) — admin animations
- [Vercel](https://vercel.com) — for the engineering blog and the OG image tool

---

<p align="center">
  Built with ❤️ by <a href="https://nurovia.dev">Nurovia</a>
</p>
