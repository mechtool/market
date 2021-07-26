'use script';
importScripts('ngsw-worker.js');
let version = '0.0.1';
let channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', async (event)=> {
  if (event.data.type === 'version') {
    channel.postMessage({type : 'version', version : version});
  }
})
