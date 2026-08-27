// Service Worker MAXORA (Stratégie Network-First pour garantir les mises à jour en direct)
const CACHE_NAME = 'maxora-cache-v3';

self.addEventListener('install', (event) => {
  // Forcer l'activation immédiate sans attendre la fermeture de l'onglet
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Supprimer automatiquement tous les anciens caches obsolètes
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les requêtes d'API
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // Stratégie Network-First : toujours chercher la version fraîche en ligne
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En cas d'absence totale de réseau (mode hors-ligne)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
