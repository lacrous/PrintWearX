/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVED output: "export" — backend requires Node.js runtime
  // for API routes, sessions, and database access.
  //
  // Deployment now needs a Node.js host:
  //   - Vercel (auto)
  //   - Render (auto)
  //   - Railway (auto)
  //   - Fly.io
  //   - Your own VPS with Node 20+
  //
  // The frontend still works the same — it's just no longer
  // statically pre-rendered. Each request hits the Node server,
  // which is fine for an MVP. Add caching/CDN in front later.

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  // Trailing slash is OFF for the Node.js deployment.
  // (It was ON for static export to make directory+index.html work
  // on every static host. Now that we're running a Node.js server,
  // /path works natively — no redirect needed.)
  trailingSlash: false,

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Standalone output for efficient Node.js deploys
  // (single self-contained server bundle)
  output: "standalone",
};

export default nextConfig;