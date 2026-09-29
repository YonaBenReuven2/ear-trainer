/* Offline shell for the ear trainer and the note detector.
   Network first so a re-upload reaches you, cache fallback so a tunnel,
   a plane or no signal doesn't stop a practice session. */
var CACHE = 'eartrainer-v7';
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './tuner.html',
  './tuner.webmanifest',
  './tuner-icon-192.png',
  './tuner-icon-512.png',
  './tuner-icon-maskable-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .catch(function () { /* a missing optional file must not block install */ })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.status === 200 && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        if (hit) return hit;
        /* offline navigation to a page we have not cached: send it to the
           right app, not always the ear trainer */
        var toTuner = e.request.url.indexOf('tuner') !== -1;
        return caches.match(toTuner ? './tuner.html' : './index.html');
      });
    })
  );
});
