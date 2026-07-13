// ZiphyNet Service Worker - Push Notifications
const CACHE_NAME = 'ziphynet-v1'

self.addEventListener('install', function(e){
  self.skipWaiting()
})

self.addEventListener('activate', function(e){
  e.waitUntil(clients.claim())
})

self.addEventListener('push', function(e){
  if(!e.data) return
  var data = {}
  try { data = e.data.json() } catch(err) { data = { title: 'ZiphyNet', body: e.data.text() } }

  var title = data.title || 'ZiphyNet'
  var options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-96.png',
    tag: data.tag || 'ziphynet-notif',
    data: { url: data.url || 'https://app.ziphynet.com/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(e){
  e.notification.close()
  var url = (e.notification.data && e.notification.data.url) || 'https://app.ziphynet.com/'
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(windowClients){
      for(var i=0; i<windowClients.length; i++){
        var client = windowClients[i]
        if(client.url === url && 'focus' in client) return client.focus()
      }
      if(clients.openWindow) return clients.openWindow(url)
    })
  )
})
