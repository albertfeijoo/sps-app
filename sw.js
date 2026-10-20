// Service worker: la app abre sin conexión. Los datos del grupo NO pasan por aquí.
const CACHE = 'sps-v3';
const SHELL = ['./', 'index.html', 'app.css', 'core.js', 'app.js', 'config.js', 'manifest.json',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'brand/logo.jpg', 'brand/pill.jpg'];
const CDN = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // Primero la red (para recibir actualizaciones); si no hay, la copia guardada
    e.respondWith(fetch(req).then(r => {
      const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)).catch(() => {});
      return r;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else if (CDN.includes(url.hostname)) {
    // Librerías y tipografías: copia guardada primero
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)).catch(() => {});
      return r;
    })));
  }
  // Supabase (datos, audios, inicio de sesión) va siempre directo a la red
});
