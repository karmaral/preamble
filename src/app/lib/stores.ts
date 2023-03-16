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
export let currentWeather = writable<Weather>(null as Weather);

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

// let aa;
// function succ(pos) {
//   const crd = pos.coords;
//   aa = crd;
//   console.log('aaa', aa?.latitude);
// }
// function er(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }
// navigator.geolocation.getCurrentPosition(succ, er, { timeout: 5000 });
// console.log(aa);
// setTimeout(() => console.log(aa), 5000);

// navigator.geolocation.getCurrentPosition(
//   (position) => { const c = position.coords; console.log(c); initStores(c); },
//   (positionErr) => { initStores(positionErr); },
// );
initStores();
