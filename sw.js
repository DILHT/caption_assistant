    const CACHE_NAME = 'caption-assistant-v1';
    const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/LargeTile.scale-150.png',
    '/LargeTile.scale-200.png'
    ];

    self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(ASSETS))
    );
    });

    self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
    });