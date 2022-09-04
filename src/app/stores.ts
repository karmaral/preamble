import { requestInit } from '@lib/middleware';
import type { BackgroundPhoto } from 'src/types';
import { writable } from 'svelte/store';

export let bgData = writable<BackgroundPhoto>();


async function initStores() {
  const photo = await requestInit();
  bgData.set(photo);
}

function onMessage(request) {
  switch (request.action) {
    case 'update:bg':
      bgData.set(request.payload);
      break;
    default: break;
  }
}

chrome.runtime.onMessage.addListener(onMessage);

initStores();
