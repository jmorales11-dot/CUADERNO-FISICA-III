const CACHE_NAME = 'fisica3-notebook-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/variables.css',
  './css/notebook.css',
  './css/geogebra.css',
  './css/simulations.css',
  './css/components.css',
  './js/app.js',
  './js/geogebra-engine.js',
  './js/simulations.js',
  './js/problems.js',
  './js/mindmap.js',
  './js/timeline.js',
  './js/glossary.js',
  './imagenes/Portada.webp',
  './imagenes/Plantilla_contenido.webp',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
