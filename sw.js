// ═══════════════════════════════════════════════════════════
// KSP SafeRoute — Service Worker v1.0
// Background Notification + GPS Tracking
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'ksp-saferoute-v2';

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Fetch — cache สำคัญเพื่อให้แอปทำงาน offline ได้บางส่วน
self.addEventListener('fetch', e => {
  // ให้ผ่านไปปกติ ไม่ cache
  return;
});

// Notification click — เปิดแอปเมื่อกด notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // ถ้าแอปเปิดอยู่แล้ว → focus
      for (const client of list) {
        if (client.url.includes('KSP-sugarcane-route') && 'focus' in client) {
          return client.focus();
        }
      }
      // ถ้าแอปปิดอยู่ → เปิดใหม่
      if (clients.openWindow) {
        return clients.openWindow('/KSP-sugarcane-route/');
      }
    })
  );
});

// Message from main app
self.addEventListener('message', e => {
  if (e.data?.type === 'ALERT') {
    const { title, body } = e.data;
    self.registration.showNotification(title, {
      body,
      icon: '/KSP-sugarcane-route/icon.png',
      badge: '/KSP-sugarcane-route/icon.png',
      tag: 'ksp-alert',
      renotify: true,
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: false,
    });
  }
});
