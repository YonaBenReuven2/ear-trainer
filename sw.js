/* Offline shell for the ear trainer and its note-detector page.
   Network first so a re-upload reaches you, cache fallback so a tunnel,
   a plane or no signal doesn't stop a practice session. */
var CACHE = 'eartrainer-v9';
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './tuner.html'
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
      /* cache storage is shared across the whole origin, so only ever
         delete our own old versions -- the note detector in ./tuner/ is a
         separate app with its own cache */
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE && k.indexOf('eartrainer-') === 0) return caches.delete(k);
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
        /* offline navigation we have not cached: land on the page asked for */
        var toTuner = e.request.url.indexOf('tuner') !== -1;
        return caches.match(toTuner ? './tuner.html' : './index.html');
      });
    })
  );
});
