import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precaching de los recursos generados por Vite y los estáticos
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

// Estrategia para recursos externos y API
registerRoute(
  ({url}) => url.origin === 'https://cdn.tailwindcss.com' || url.origin.includes('fonts.googleapis.com'),
  new StaleWhileRevalidate()
);

registerRoute(
  ({request}) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  new StaleWhileRevalidate()
);

// Fallback para navegación offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/public/index.html'))
    );
  }
});

// Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => !key.startsWith('workbox')).map(key => caches.delete(key)))
    )
  );
  clients.claim();
});
