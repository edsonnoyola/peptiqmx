// PEPTIQ Tracker Service Worker · v2.6.1 · Fix double-init bug que rompía registration guard
const CACHE = 'peptiq-tracker-v31';
const ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700&family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Don't cache API calls
  if (url.pathname.startsWith('/.netlify/functions/')) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      // Stale-while-revalidate for app shell
      if (url.pathname.startsWith('/app/') || url.host.includes('cdn.') || url.host.includes('fonts.')) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match('/app/index.html')))
  );
});

// Push notifications (recordatorios)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'PEPTIQ', body: 'Hora de tu dosis' };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/app/icons/icon-192.png',
    badge: '/app/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: data.url || '/app/',
    actions: [
      { action: 'taken', title: '✓ Aplicada' },
      { action: 'snooze', title: 'Posponer 15min' }
    ]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'snooze') return;
  e.waitUntil(clients.openWindow(e.notification.data || '/app/'));
});
