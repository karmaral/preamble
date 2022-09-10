import { requestInit } from '@lib/middleware';
import type { BackgroundPhoto } from 'src/types';
import { writable } from 'svelte/store';

export let bgData = writable<BackgroundPhoto>();

export let photos = writable<BackgroundPhoto[]>([] as BackgroundPhoto[]);
export let isBackgroundChanging = writable<boolean>(false);

async function initStores() {
  const photo = await requestInit();
  photos.set([photo]);
}

function onMessage(request) {
  switch (request.action) {
    case 'update:bg':
      photos.update(($photos) => [...$photos, request.payload]);
      break;
    default: break;
  }
}

chrome.runtime.onMessage.addListener(onMessage);

initStores();
