
self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'Gratitude Challenge';
  const options = {
    body: data.body || 'Time for your daily gratitude entry!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
