import browser from 'webextension-polyfill';
import preamble from './preamble';
import { isArray, isEmpty } from 'lodash-es';
import { createApi } from 'unsplash-js';
import type { Random } from 'unsplash-js/dist/methods/photos/types';
import type {
  BackgroundPhoto,
  StoredSettings,
  Storage,
  InitData,
  Storage,
  InitData,
  Storage,
  InitData,
  Storage,
  InitData,
} from 'src/types';

const collections = [
  '2156994', /* Nature Backgrounds (Momentum) - Nicholas Prozorovsky */
  '327760', /* Nature - Alex Chaves */
];
console.log('background');

const unsplash = createApi({ accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY });


async function fetchRandomImage(): Promise<Random> {
  console.log('bg >> calling unsplash API');
  const fetch = await unsplash.photos.getRandom({
    collectionIds: collections,
  });
  const result = isArray(fetch.response) ? fetch.response[0] : fetch.response;

  return result;
}

async function newBackground(): Promise<BackgroundPhoto> {
  const imgFetch = await fetchRandomImage();

  const photo: BackgroundPhoto = {
    id: imgFetch.id,
    src: `${imgFetch.urls.raw}?q=80&fm=jpg&w=1920`,
    url: imgFetch.links.html,
    user_name: imgFetch.user.name,
    alt_description: imgFetch.alt_description,
    location: imgFetch.location.name || 'Unknown',
    img_color: imgFetch.color,
  };

  const last_changed = Date().toString();

  const { backdrop_color } = await preamble.settings.getAll();
  const newBackdrop = {
    setting: backdrop_color.setting,
    value: backdrop_color.setting.toLowerCase().toLowerCase() === 'auto'
      ? imgFetch.color
      : backdrop_color.value,
  };

  const storage: Partial<Storage> = {
    current_bg: photo,
    last_changed,
  };

  await browser.storage.local.set(storage);
  await preamble.settings.set({ backdrop_color: newBackdrop });

  return photo;
}


async function sendUpdatedBackground(photo: BackgroundPhoto) {
  chrome.runtime.sendMessage({
    action: 'update:bg',
    payload: photo,
  });
}

function handleSettingUpdate(payload: SettingChangePayload) {
  const { key, label, value } = payload;
  const updateData: Record<string, unknown> = { setting: label, value };
  if (payload.custom) {
    updateData.custom = true;
  }
  preamble.settings.set({ [key]: updateData });
}

async function init(initParams): Promise<InitData> {
  console.log('init', initParams);
  const { geolocation } = initParams;
  const storage = await browser.storage.local.get([
    'current_bg',
    'last_changed',
    'settings',
  ]) as Partial<Storage>;

  const { current_bg, last_changed, settings } = storage;
  const { backdrop_color, user_name } = settings;

  let photo: BackgroundPhoto;

  if (isEmpty(last_changed)) {
    const date = new Date().toString();
    await browser.storage.local.set({ last_changed: date });
  }

  photo = isEmpty(current_bg)
    ? await newBackground()
    : current_bg;

  if (isEmpty(backdrop_color) ) {
    handleSettingUpdate({
      key: 'backdrop_color',
      label: 'auto',
      value: photo.img_color,
    });
  }

  if (isEmpty(user_name)) {
    handleSettingUpdate({
      key: 'user_name',
      label: '',
      value: '',
  }

  if (isEmpty(user_name)) {
    handleSettingUpdate({
      key: 'user_name',
      label: '',
      value: '',
    });
  }

  await preamble.quotes.init();
  await preamble.weather.init({ geolocation });
  const latestSettings = await preamble.settings.getAll();
  const latestSettings = await preamble.settings.getAll();
  const latestSettings = await preamble.settings.getAll();
  const latestSettings = await preamble.settings.getAll();

  return { { photo, settings: latestSettings }, settings: latestSettings };
}

function onMessage(request, sender, sendResponse) {
  console.log(`bg >> onMessage: ${request.action}`);
  switch (request.action) {
    case 'request:init':
      init(request.payload)
        
        .then(response => sendResponse({ response }));
        
        .then(response => sendResponse({ response }));
      break;
    case 'request:new_bg':
      newBackground()
        .then(response => preamble.renderer.updateBackground(response));
      break;
    case 'update:setting':
      handleSettingUpdate(request.payload);
      break;
    default: break;
  }

  return true;
}


browser.runtime.onMessage.addListener(onMessage);
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;
  if (Object.hasOwn(changes, 'settings')) {
    browser.runtime.sendMessage({
      action: 'sync:settings',
      payload: changes.settings.newValue,
    });

  }
});
