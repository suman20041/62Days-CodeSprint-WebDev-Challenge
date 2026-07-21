// Minimal "app shell" service worker.
//
// Educational scope: it caches the built static assets so the UI itself
// (HTML/JS/CSS) still loads while offline. It intentionally does NOT try
// to cache/serve API responses - that job is handled explicitly by the
// localStorage offline queue in src/utils/offlineQueue.js, which is easier
// to reason about for a learning project than an opaque SW fetch cache.
const CACHE_NAME = 'finance-ledger-shell-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/index.html']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
