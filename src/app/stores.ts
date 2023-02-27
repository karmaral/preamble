import { requestInit } from '$lib/middleware';
import type {
  Weather,
  Quote,
  BackgroundPhoto,
  StoredSettings,
} from 'src/types';
import { writable } from 'svelte/store';


export const settings = writable<StoredSettings>({} as StoredSettings);
export const settingsOpen = writable<boolean>(false);

export let photos = writable<BackgroundPhoto[]>([] as BackgroundPhoto[]);
export let isBackgroundChanging = writable<boolean>(false);
export let dailyQuote = writable<Quote>(null as Quote);
export let currentWeather = writable<Weather>(null as Weather);

async function initStores() {
  const res = await requestInit();
  photos.set([res.photo]);
  settings.set(res.settings);
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
    case 'sync:settings':
      settings.update((prev) => {
        return { ...prev, ...request.payload };
      });
      break;
    default: break;
  }
}

chrome.runtime.onMessage.addListener(onMessage);

initStores();
