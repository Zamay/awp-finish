// Files to cache
var cacheName = 'js13kPWA-v3';
var appShellFiles = [
  '',
  'index.html',
  'pwa.html',
  'main.js',
  './js/lightgallery.min.js',

  './css/cssi.css',
  './css/index.css',
  './css/pwa.css',
  './css/lightgallery.min.css',

  './fonts/lg.woff',

  './img/1.webp',
  './img/2.webp',
  './img/3.webp',
  './img/4.webp',
  './img/5.webp',
  './img/6.webp',
  './img/7.webp',
  './img/8.webp',
  './img/icon.png',
  './img/l1.jpg',
  './img/l2.jpg',
  './img/l3.jpg',
  './img/loading.gif',
  './img/photo1.png',
  './img/photod.png',
  './img/play_prism_hlock_m.png',
  './img/star-full.png',
  './img/star-full-big.png',
  './sw2.js'
];

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(appShellFiles);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      // console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          // console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log("delete caches");
  e.waitUntil(
    caches.keys().then((keyList) => {
        console.log("delete caches");
          return Promise.all(keyList.map((key) => {
        if(key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

