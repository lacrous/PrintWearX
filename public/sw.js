/**
 * PrintWearX Service Worker
 *
 * Strategy:
 *  - Pre-cache critical shell at install
 *  - Network-first for HTML navigation (always fresh)
 *  - Cache-first for static assets (JS / CSS / images) — fast repeat visits
 *  - Pass-through for /api/* and Stripe
 */

const VERSION = "v1";
const STATIC_CACHE = `printwearx-static-${VERSION}`;
const RUNTIME_CACHE = `printwearx-runtime-${VERSION}`;

const PRECACHE = ["/", "/shop", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((c) => c.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Pass through for non-GET or chrome-extension or API/Stripe
  if (
    req.method !== "GET" ||
    url.protocol === "chrome-extension:" ||
    url.host.endsWith("stripe.com") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Network-first for HTML
  const isHtml = req.headers.get("Accept")?.includes("text/html");
  if (isHtml) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then(
            (cached) =>
              cached ||
              caches.match("/").then((root) => root || caches.match("/offline.html"))
          )
        )
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => cached)
    )
  );
});
