import { requestInit } from '$lib/middleware';
import type { Weather, Quote, BackgroundPhoto } from 'src/types';
import { writable } from 'svelte/store';


export let settingsOpen = writable<boolean>(false);
export let photos = writable<BackgroundPhoto[]>([] as BackgroundPhoto[]);
export let isBackgroundChanging = writable<boolean>(false);
export let dailyQuote = writable<Quote>(null as Quote);
export let currentWeather = writable<Weather>(null as Weather);

async function initStores() {
  const photo = await requestInit();
  photos.set([photo]);
}

function onMessage(request) {
  switch (request.action) {
    case 'update:bg':
      photos.update(($photos) => [...$photos, request.payload]);
      break;
    case 'update:quote':
      dailyQuote.set(request.payload);
      break;
    case 'update:weather':
      currentWeather.set(request.payload);
      break;
    default: break;
  }
}

chrome.runtime.onMessage.addListener(onMessage);

initStores();
