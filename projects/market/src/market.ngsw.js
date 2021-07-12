'use script';
importScripts('ngsw-worker.js');
let version = '0.0.1';
let channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', (event)=> {
  console.log('message');
  if (event.data.type === 'version') {
    channel.postMessage({type : 'version', version : version});
  }
})
