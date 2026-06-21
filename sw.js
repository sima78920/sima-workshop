// 서비스워커: 앱 셸 캐시 → 오프라인 작동
const CACHE = "lecture-tool-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/app.js",
  "./js/util.js",
  "./js/state.js",
  "./js/timer.js",
  "./js/markdown.js",
  "./js/views/home.js",
  "./js/views/agenda.js",
  "./js/views/session.js",
  "./js/views/cheats.js",
  "./js/views/checklist.js",
  "./js/views/settings.js",
  "./data/default-lecture.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// cache-first, 네트워크 폴백 후 캐시에 저장
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
