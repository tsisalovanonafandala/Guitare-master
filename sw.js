// ── GLITA Service Worker ──────────────────────────────────────
// Version : mise à jour ce numéro à chaque déploiement majeur
const CACHE_NAME = 'glita-v1';

// Fichiers à mettre en cache pour le mode hors ligne
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&display=swap'
];

// ── INSTALLATION ───────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Cache partiel:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATION ────────────────────────────────────────────────
// Supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH — Network First ─────────────────────────────────────
// Essaie toujours le réseau en premier pour avoir les mises à jour
// Si pas de connexion → utilise le cache
self.addEventListener('fetch', event => {
  // Ignore les requêtes non-GET et Firebase
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore.googleapis.com')) return;
  if (event.request.url.includes('firebase')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Met en cache la nouvelle version
        if (response && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() => {
        // Pas de connexion → cache
        return caches.match(event.request);
      })
  );
});
