const CACHE = "forza-v7";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./splash-375x667@2.png", "./splash-375x812@3.png", "./splash-390x844@3.png", "./splash-393x852@3.png", "./splash-402x874@3.png", "./splash-414x896@2.png", "./splash-414x896@3.png", "./splash-428x926@3.png", "./splash-430x932@3.png", "./splash-440x956@3.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const same = new URL(e.request.url).origin === location.origin;
  if (e.request.mode === "navigate" || (same && e.request.url.endsWith(".html"))) {
    e.respondWith(fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (same && res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return res;
  })));
});
