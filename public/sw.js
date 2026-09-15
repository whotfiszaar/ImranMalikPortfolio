/* Imran Malik Portfolio - Service Worker */
const VERSION = "im-portfolio-v2";
const STATIC_CACHE = `ik-static-${VERSION}`;
const IMAGE_CACHE = `ik-images-${VERSION}`;
const PAGE_CACHE = `ik-pages-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/og-image.png",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS.map((u) => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== IMAGE_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isImageRequest(url) {
  return (
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/image") ||
    /\.(png|jpg|jpeg|webp|svg|gif|avif)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests.
  // API calls (chat) always go to the network.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Images: cache first, refresh in background
  if (isImageRequest(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Pages and assets: network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && (request.destination === "document" || request.destination === "")) {
          const clone = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.destination === "document") {
            return caches.match("/offline.html").then(
              (offline) =>
                offline ||
                new Response(
                  "<html><body style='background:#0a0908;color:#f2ecdf;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'><div style='text-align:center'><h1 style='color:#c9a24b;font-weight:600'>You are offline</h1><p>This page needs a connection. Please reconnect and try again.</p></div></body></html>",
                  { headers: { "Content-Type": "text/html" } }
                )
            );
          }
          return new Response("", { status: 504 });
        })
      )
  );
});
