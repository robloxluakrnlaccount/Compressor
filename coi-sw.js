// coi-sw.js — deploy this file in the SAME directory as index.html on GitHub Pages
// It intercepts all fetches and adds the COOP/COEP headers that SharedArrayBuffer needs.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;
  e.respondWith(
    fetch(e.request).then(response => {
      // Only wrap basic same-origin responses
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      const headers = new Headers(response.headers);
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }).catch(() => fetch(e.request))
  );
});
