import { ScramjetServiceWorker, setConfig } from "/scram/scramjet.bundle.js";
import { SCRAMJET_CONFIG } from "/js/scramjet-config.js";

setConfig(SCRAMJET_CONFIG);
const sw = new ScramjetServiceWorker();

function isScramjetRequest(request) {
  const url = request.url;
  return (
    url.startsWith(location.origin + SCRAMJET_CONFIG.prefix) ||
    url.startsWith(location.origin + SCRAMJET_CONFIG.files.wasm)
  );
}

self.addEventListener("install",  () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", event => {
  if (!isScramjetRequest(event.request)) return;

  event.respondWith((async () => {
    try {
      await sw.loadConfig();
      return await sw.fetch(event);
    } catch (error) {
      console.error("scramjet service worker fetch failed:", error);
      return fetch(event.request);
    }
  })());
});
