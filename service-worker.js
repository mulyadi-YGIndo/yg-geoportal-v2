const CACHE_NAME = "yg-geoportal-v2-20260714-2";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./webgis.html",
  "./monitoring.html",
  "./report.html",
  "./object-manager.html",
  "./polygon-editor.html",
  "./manifest.webmanifest",
  "./assets/logo-yayasan-gambut.png",
  "./assets/logo-yayasan-gambut-192.png",
  "./assets/logo-yayasan-gambut-512.png",
  "./css/app.css",
  "./css/dashboard-actions.css",
  "./css/dashboard-v3.css",
  "./css/webgis-v3.css",
  "./css/monitoring.css",
  "./css/object-manager.css",
  "./css/polygon-editor.css",
  "./css/report-v6.css",
  "./js/pwa.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Data Apps Script harus selalu segar dan tidak disimpan ke cache.
  if (
    url.hostname === "script.google.com" ||
    url.hostname === "script.googleusercontent.com"
  ) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached =>
            cached || caches.match("./index.html")
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok && url.origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
