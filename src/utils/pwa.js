// Utilidades para PWA y gestión de caché
import { openDB } from 'idb';

const DB_NAME = 'plumas-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store para historial
      if (!db.objectStoreNames.contains('historial')) {
        const historialStore = db.createObjectStore('historial', { keyPath: 'id', autoIncrement: true });
        historialStore.createIndex('fecha', 'fecha');
      }
      // Store para configuración
      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config');
      }
      // Store para caché de respuestas
      if (!db.objectStoreNames.contains('respuestas')) {
        db.createObjectStore('respuestas', { keyPath: 'id' });
      }
    },
  });
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado:', registration);

      // Manejo de actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            notifyUpdate();
          }
        });
      });
    } catch (error) {
      console.error('Error al registrar Service Worker:', error);
    }
  }
}

export function notifyUpdate() {
  const event = new CustomEvent('pwaUpdateAvailable');
  window.dispatchEvent(event);
}

export async function checkConnectivity() {
  try {
    const response = await fetch('/ping');
    return response.ok;
  } catch {
    return false;
  }
}

// API para métricas y diagnóstico
export async function logMetric(metric) {
  const db = await initDB();
  await db.add('metrics', {
    ...metric,
    timestamp: Date.now(),
  });
}

// Gestión de alertas y notificaciones
export async function setupNotifications() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export async function showNotification(title, options = {}) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    });
  }
}

// Gestión de instalación de PWA
export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
    const event = new CustomEvent('pwaInstallAvailable');
    window.dispatchEvent(event);
  });
}

// Manejo de estado online/offline
export function setupConnectivityListeners(callbacks) {
  window.addEventListener('online', () => {
    callbacks.online?.();
  });

  window.addEventListener('offline', () => {
    callbacks.offline?.();
  });
}

// Debug API for Service Worker
export const swDebugAPI = {
  async getMetrics() {
    if (!navigator.serviceWorker.controller) return null;
    try {
      const response = await navigator.serviceWorker.controller.postMessage({
        type: 'GET_METRICS'
      });
      return response;
    } catch (error) {
      console.error('Error getting SW metrics:', error);
      return null;
    }
  },

  async validateCaches() {
    if (!navigator.serviceWorker.controller) return;
    try {
      await navigator.serviceWorker.controller.postMessage({
        type: 'VALIDATE_CACHES'
      });
    } catch (error) {
      console.error('Error validating caches:', error);
    }
  },

  async clearMetrics() {
    if (!navigator.serviceWorker.controller) return;
    try {
      await navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_METRICS'
      });
    } catch (error) {
      console.error('Error clearing metrics:', error);
    }
  },

  async checkCacheSize(cacheName) {
    if (!navigator.serviceWorker.controller) return 0;
    try {
      const response = await navigator.serviceWorker.controller.postMessage({
        type: 'CHECK_CACHE_SIZE',
        cacheName
      });
      return response;
    } catch (error) {
      console.error('Error checking cache size:', error);
      return 0;
    }
  }
};
