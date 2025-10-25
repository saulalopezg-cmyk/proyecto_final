const CACHE_NAME = "mi-pwa-cache-v3";
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

// Instalar el Service Worker y cachear los archivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activar y eliminar caché antigua
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
});

// Interceptar peticiones
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
