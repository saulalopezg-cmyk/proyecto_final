const CACHE_NAME = "mi-pwa-cache-v6";
const urlsToCache = [
  "./",
  "./index.html",
  "./simplex.html",
  "./transporte.html",
  "./asignacion.html",
  "./css/style.css",
  "./css/style2.css",
  "./css/style3.css",
  "./css/style4.css",
  "./js/ia.js",
  "./js/script.js",
  "./js/script2.js",
  "./js/script3.js",
  "./js/script4.js",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

// Instalar y cachear
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

// Activar y limpiar caché vieja
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Interceptar SOLO mismo origen y SOLO GET
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // No interceptar cross-origin (workers.dev, CDNs, etc.)
  if (url.origin !== self.location.origin) return;

  // No interceptar métodos no-GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
