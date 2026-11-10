/* TONAL service worker — the app opens with no internet.
   VERSION and PRECACHE are filled in by scripts/postbuild.mjs on every build. */
const VERSION = "ebf206437cf7";
const CACHE = `tonal-${VERSION}`;
const PRECACHE = ["/Tonal/","/Tonal/assets/index-COtqe68a.js","/Tonal/assets/index-DO8LWDs3.css","/Tonal/favicon.svg","/Tonal/icon-180.png","/Tonal/icon-192.png","/Tonal/icon-512.png","/Tonal/index.html","/Tonal/manifest.webmanifest","/Tonal/og.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(PRECACHE.map((p) => new Request(p, { cache: "reload" })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("tonal-") && key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scope)) return;
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(scope, res.clone());
          return res;
        } catch {
          return (await cache.match(scope)) || (await cache.match(`${scope}index.html`)) || Response.error();
        }
      })(),
    );
    return;
  }
  event.respondWith(
    (async () => {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
      return res;
    })(),
  );
});
