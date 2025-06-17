// Debug config
const DEBUG = true;
const DEBUG_PREFIX = '[ServiceWorker]';

// Utility debug function
const debug = (type, message, data = null) => {
  if (!DEBUG) return;
  const styles = {
    info: 'color: #2563eb',
    warn: 'color: #d97706',
    error: 'color: #dc2626',
    success: 'color: #059669'
  };

  console.log(
    `%c${DEBUG_PREFIX} [${type.toUpperCase()}]`,
    styles[type] || styles.info,
    message,
    data || ''
  );
};

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Precaching de recursos críticos con logging
debug('info', 'Iniciando precaching de recursos críticos');
try {
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
  debug('success', 'Precaching completado exitosamente');
} catch (error) {
  debug('error', 'Error en precaching', { error: error.toString() });
}

// Caché de fuentes
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'font-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
      }),
    ],
  })
);

// Caché de imágenes
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// Caché de scripts y estilos
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Estrategia para API y datos dinámicos
registerRoute(
  ({ request }) => request.destination === 'fetch',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 12 * 60 * 60, // 12 horas
      }),
    ],
  })
);

// Manejo de actualizaciones
self.addEventListener('install', (event) => {
  debug('info', 'Installing Service Worker...');
  self.skipWaiting();
  event.waitUntil(
    caches.open('offline-fallback').then((cache) => {
      return cache.addAll([
        '/offline.html',
        '/favicon.svg',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  debug('success', 'Service Worker activated');
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Limpieza de cachés antiguos
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (!['font-cache', 'image-cache', 'static-resources', 'api-cache', 'offline-fallback'].includes(key)) {
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// Log cache operations
self.addEventListener('fetch', event => {
  debug('info', `Fetching: ${event.request.url}`);
});

// Performance monitoring
self.addEventListener('message', event => {
  debug('info', 'Message received:', event.data);
  if (event.data && event.data.type === 'MEASURE_PERFORMANCE') {
    // Performance measurements
    const measurements = performance.getEntriesByType('measure');
    debug('info', 'Performance measurements:', measurements);
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache monitoring utilities
const monitorCacheSize = async (cacheName) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const size = keys.length;
    debug('info', `Cache ${cacheName} size:`, size);
    return size;
  } catch (error) {
    debug('error', `Error monitoring cache ${cacheName}:`, error);
    return 0;
  }
};

const validateCache = async (cacheName) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let invalidCount = 0;

    for (const request of keys) {
      const response = await cache.match(request);
      if (!response || response.status !== 200) {
        invalidCount++;
        debug('warn', `Invalid cache entry found:`, request.url);
      }
    }

    debug('info', `Cache validation complete for ${cacheName}. Invalid entries:`, invalidCount);
  } catch (error) {
    debug('error', `Error validating cache ${cacheName}:`, error);
  }
};

// Error tracking and metrics
const metrics = {
  errors: 0,
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0
};

const trackError = (error, context = '') => {
  metrics.errors++;
  debug('error', `Error in ${context}:`, error);
};

const updateMetrics = (type) => {
  metrics[type]++;
  if (DEBUG && metrics[type] % 10 === 0) { // Log every 10 occurrences
    debug('info', 'Current metrics:', metrics);
  }
};

// Network status monitoring
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const cache = await caches.open('runtime-cache');
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        updateMetrics('cacheHits');
        debug('success', 'Cache hit:', event.request.url);
        return cachedResponse;
      }

      updateMetrics('cacheMisses');
      debug('info', 'Cache miss, fetching from network:', event.request.url);

      const networkResponse = await fetch(event.request);
      updateMetrics('networkRequests');

      if (networkResponse.ok) {
        await cache.put(event.request, networkResponse.clone());
      }

      return networkResponse;
    } catch (error) {
      trackError(error, 'fetch event');
      throw error;
    }
  })());
});

// Periodic cache cleanup
const CACHE_CLEANUP_INTERVAL = 1000 * 60 * 60; // 1 hour
setInterval(async () => {
  debug('info', 'Starting periodic cache cleanup');
  try {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await validateCache(cacheName);
      await monitorCacheSize(cacheName);
    }
    debug('success', 'Cache cleanup complete');
  } catch (error) {
    trackError(error, 'cache cleanup');
  }
}, CACHE_CLEANUP_INTERVAL);
