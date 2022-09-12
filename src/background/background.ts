import { SETTINGS_KEYS } from './utils';
import { isArray, isEmpty } from 'lodash-es';
import { createApi } from 'unsplash-js';
import type { Random } from "unsplash-js/dist/methods/photos/types";
import type { BackgroundPhoto, StoredSettings } from "src/types";

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

  const { backdrop_color } = await chrome.storage.local.get('backdrop_color');
  const newBackdrop = {
    setting: backdrop_color.setting,
    value: backdrop_color.setting === 'auto'
      ? imgFetch.color
      : backdrop_color.value,
  };

  const storedSettings: StoredSettings = {
    current_bg: photo,
    last_changed,
    backdrop_color: newBackdrop,
  };

  await chrome.storage.local.set(storedSettings);

  sendUpdatedBackground(photo);

  return photo;
}


async function sendUpdatedBackground(photo: BackgroundPhoto) {
  chrome.runtime.sendMessage({
    action: 'update:bg',
    payload: photo,
  });
}

async function init(): Promise<BackgroundPhoto> {
  let photo: BackgroundPhoto;
  const {
    current_bg,
    last_changed,
    user_name,
    backdrop_color,
  } = await chrome.storage.local.get(SETTINGS_KEYS) as StoredSettings;

  if (isEmpty(last_changed)) {
    const date = new Date().toString();
    await chrome.storage.local.set({ last_changed: date });
  }

  photo = isEmpty(current_bg)
    ? await newBackground()
    : current_bg;

  if (isEmpty(backdrop_color) ) {
    await chrome.storage.local.set({
      backdrop_color: {
        setting: 'auto',
        value: photo.img_color,
      },
    });
  }
  }

  console.log({ current_bg, last_changed, user_name });

  return photo;
}

function onMessage(request, sender, sendResponse) {
  console.log(`bg >> onMessage: ${request.action}`);
  switch (request.action) {
    case 'request:init':
      init().then(response => sendResponse({ response }));
      break;
    case 'request:new_bg':
      newBackground();
      break;
    default: break;
  }

  return true;
}

chrome.runtime.onMessage.addListener(onMessage);

