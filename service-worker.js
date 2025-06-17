import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/styles.css',
  '/src/components/ui.js',
  '/src/components/api.js',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Inter:wght@400;700&display=swap'
]);
cleanupOutdatedCaches();

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  new StaleWhileRevalidate()
);

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/public/index.html'))
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => !self.__WB_MANIFEST.map(f => f.url).includes(key)).map(key => caches.delete(key))
    ))
  );
  clients.claim();
});
