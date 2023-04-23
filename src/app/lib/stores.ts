import browser from 'webextension-polyfill';
import { requestInit } from '$lib/middleware';
import type {
  Weather,
  Quote,
  BackgroundPhoto,
  StoredSettings,
} from '$types';
import { writable } from 'svelte/store';


export const settings = writable<StoredSettings>({} as StoredSettings);
export const settingsOpen = writable<boolean>(false);

export let photos = writable<BackgroundPhoto[]>([] as BackgroundPhoto[]);
export let isBackgroundChanging = writable<boolean>(false);

export let dailyQuote = writable<Quote>(null as Quote);
export let currentWeather = writable<Weather>({} as Weather);

async function initStores() {
  const res = await requestInit();
  photos.set([res.photo]);
  settings.set(res.settings);
}

function onMessage(request: Record<string, unknown>) {
  switch (request.action) {
    case 'update:bg':
      photos.update(($photos) => [...$photos, request.payload as BackgroundPhoto]);
      break;
    case 'update:quote':
      dailyQuote.set(request.payload as Quote);
      break;
    case 'update:weather':
      currentWeather.set(request.payload as Weather);
      break;
    case 'sync:settings':
      console.log('sync:settings', request.payload);
      settings.update((prev) => {
        return { ...prev, ...request.payload as Partial<StoredSettings> };
      });
      break;
    default: break;
  }
}

browser.runtime.onMessage.addListener(onMessage);
initStores();
