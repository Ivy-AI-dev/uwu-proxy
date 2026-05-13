importScripts("uv.bundle.js");
importScripts("uv.config.js");
importScripts(__uv$config.sw || "uv.sw.js");

self.addEventListener("install",  (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

const sw = new UVServiceWorker();
self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
