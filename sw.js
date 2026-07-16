// Bump this when app-shell files change so old caches get evicted on activate.
const CACHE_VERSION = "v1";
const CACHE_NAME = `startpage-${CACHE_VERSION}`;

// Core files needed to render the page with no network at all.
// Everything else (fonts, icons, banners, backgrounds) is cached opportunistically on first fetch.
const APP_SHELL = [
  "./",
  "./index.html",
  "./userconfig.js",
  "./src/css/style.css",
  "./src/css/awoo.min.css",
  "./src/common/palette.js",
  "./src/common/theme.js",
  "./src/common/utils.js",
  "./src/common/storage.js",
  "./src/common/actions.js",
  "./src/common/config.js",
  "./src/common/i18n.js",
  "./src/common/strftime.js",
  "./src/common/component.js",
  "./src/common/module.js",
  "./src/components/tabs/tabs.component.js",
  "./src/components/weather/weather.api.js",
  "./src/components/weather/weather.component.js",
  "./src/components/clock/clock.component.js",
  "./src/components/statusbar/statusbar.component.js",
  "./src/birthday.js",
  "./src/img/favicon.png",
];

// Live/dynamic APIs must never be served from cache.
const NEVER_CACHE_HOSTS = ["api.openweathermap.org", "generativelanguage.googleapis.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (NEVER_CACHE_HOSTS.includes(url.hostname)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      // Cache-first for instant paint; falls back to network for anything not yet cached.
      return cached || network;
    }),
  );
});
