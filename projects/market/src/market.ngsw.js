'use script';
importScripts('ngsw-worker.js');
let version = '0.0.1';
self.addEventListener('activate', (event)=> {
  event.waitUntil(
    caches.keys().then((names) =>{
      console.log('1');
      console.log('2');
      for (let name of names) caches.delete(name);
    }))
});
let channel = new BroadcastChannel('sw-messages');

channel.addEventListener('message', (event)=> {
  if (event.data.type === 'version') {
    channel.postMessage({type : 'version', version : version});
  }
  else if(event.data.type === 'checkUpdate'){
    self.registration.update();
    console.log('2');
  }
})
