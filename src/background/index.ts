import type { BackgroundPhoto } from "src/types";
import { isEmpty } from 'lodash';
import { createApi } from 'unsplash-js';
import type { Random } from "unsplash-js/dist/methods/photos/types";

const collections = [
  '2156994', // Nature Backgrounds (Momentum) - Nicholas Prozorovsky
  '327760', // Nature - Alex Chaves
];

type StorageResult = { [key: string]: any };


const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY })

async function fetchRandomImage(): Promise<Random | Random[]> {
  const fetch = await unsplash.photos.getRandom({
    collectionIds: collections,
  });

  return fetch.response;
}


async function newBackground(): Promise<BackgroundPhoto> {
  const photo = await fetchRandomImage();

  const newBg: BackgroundPhoto = {
    src: `${photo.urls.raw}?q=75&fm=jph&w=1920`,
    url: photo.links.html,
    user_name: photo.user.name,
  };

  await chrome.storage.local.set({ current_bg: newBg });

  return newBg;
}

async function init(): Promise<void> {
  let currentBg : StorageResult = await chrome.storage.local.get('current_bg');
  if (isEmpty(currentBg)) {
    console.log('initializing bg image storage');
    const newBgFetch = await fetchRandomImage();

    const newBg : BackgroundPhoto  = {
      src: `${newBgFetch.urls.raw}?q=75&fm=jph&w=1920`,
      url: newBgFetch.links.html,
      user_name: newBgFetch.user.name,
    }
  }
}

function onMessage(request, sender, sendResponse) {
  switch (request.action) {
    case 'bg:new':
      const img = fetchRandomImage();
      sendResponse({ response; img });
      break;
    default: break;
  }

  return true;
}

chrome.runtime.onMessage.addListener(onMessage);

export { };
