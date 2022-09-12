import { SETTINGS_KEYS } from './utils';
import { isArray, isEmpty } from 'lodash-es';
import { createApi } from 'unsplash-js';
import type { Random } from "unsplash-js/dist/methods/photos/types";
import type {
  BackgroundPhoto,
  Quote,
  StoredSettings,
  StoredSettingVariable,
} from "src/types";

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

async function fetchDailyQuote(): Promise<Quote> {
  const { quote_source } = await chrome.storage.local.get('quote_source') as { quote_source: StoredSettingVariable };
  const { value: url } = quote_source;

  let data = await fetch(url);
  // data = target === 'GitHub'
  //   ? await data.text()
  //   : await data.json();
  data = await data.json();

  console.log({
    data,
    contents: data.contents,
    quotes: data.contents.quotes,
  });
  let result : Quote;

  result = {
    id: data.contents.quotes[0].id,
    author: data.contents.quotes[0].author,
    text: data.contents.quotes[0].quote,
    source: data.contents.quotes[0].permalink,
  };
  console.log({ result });

  return result;
}

async function newQuote(skipSend: boolean = false): Promise<Quote> {
  const quote = await fetchDailyQuote();
  const { quote_history } = await chrome.storage.local.get('quote_history');

  // check if can get quote
  // (day passed since last)
  const newEntry = { q: quote, date: new Date().toString() };
  const storedSettings: StoredSettings = {
    current_quote: quote,
    quote_history: [...quote_history, newEntry],
  };

  await chrome.storage.local.set(storedSettings);

  if (!skipSend) {
    sendUpdatedQuote(quote);
  }

  return quote;
}

async function sendUpdatedQuote(quote: Quote) {
  chrome.runtime.sendMessage({
    action: 'update:quote',
    payload: quote,
  });
}

async function init(): Promise<BackgroundPhoto> {
  let photo: BackgroundPhoto;
  let quote : Quote;
  const {
    current_bg,
    last_changed,
    user_name,
    backdrop_color,
    current_quote,
    quote_history,
    quote_source,
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

  if (isEmpty(quote_source)) {
    await chrome.storage.local.set({
      quote_source: {
        setting: 'They Said So',
        value: 'https://quotes.rest/qod',
      },
    });
  }
  if (isEmpty(quote_history)) {
    await chrome.storage.local.set({
      quote_history: [],
    });
  }

  quote = isEmpty(current_quote)
    ? await newQuote(true)
    : current_quote;

  sendUpdatedQuote(quote);

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

