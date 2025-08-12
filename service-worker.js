/*
 * Service Worker for Delivery Pay & Expenses Tracker
 *
 * This service worker implements a simple cache-first strategy.
 * When the user first loads the app, the assets listed in the
 * `FILES_TO_CACHE` array are cached. Subsequent visits load files
 * from the cache when available, falling back to the network if
 * needed. This allows the app to work offline and improves load
 * performance on repeat visits.
 */

const CACHE_NAME = 'pay-tracker-cache-v1';

// List of files to cache. Note: update this list when adding new
// assets that should be available offline. The icons and manifest
// are included implicitly when referenced from the HTML.
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js'
];

// Install event: cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate event: clean up old caches if any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: respond with cached assets when available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});