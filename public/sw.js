import { ScramjetServiceWorker, setConfig } from "/scram/scramjet.bundle.js";
import { SCRAMJET_CONFIG } from "/js/scramjet-config.js";

setConfig(SCRAMJET_CONFIG);
const sw = new ScramjetServiceWorker();

self.addEventListener("install",  () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", event => {
  try {
    if (sw.route(event)) event.respondWith(sw.fetch(event));
  } catch (error) {
    console.error("scramjet service worker route failed:", error);
  }
});
