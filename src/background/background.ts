import browser from 'webextension-polyfill';
import preamble from './preamble';
import { isArray, isEmpty } from 'lodash-es';
import type {
  BackgroundPhoto,
  SettingChangePayload,
  Message,
  Storage,
  InitData,
} from 'src/types';


function handleSettingUpdate(payload: SettingChangePayload) {
  const { key, label, value } = payload;
  const updateData: Record<string, unknown> = { setting: label, value };
  if (payload.custom_value) {
    updateData.custom_value = payload.custom_value;
  }
  preamble.settings.set({ [key]: updateData });
}

async function init(initParams): Promise<InitData> {
  console.log('init', initParams);
  const { geolocation } = initParams;

  await preamble.settings.init();
  await preamble.background.init();
  const photo = await preamble.background.getCurrent();


  await preamble.quotes.init();
  await preamble.weather.init({ geolocation });
  const settings = await preamble.settings.getAll();

  return { photo, settings };
}

async function onMessage(
  message: Message,
  _sender: browser.Runtime.MessageSender,
  _sendResponse: (params: unknown) => void) {
  console.log(`bg >> onMessage: ${message.action}`);
  let response: unknown;
  switch (message.action) {
    case 'request:init':
      response = await init(message.payload)
      break;
    case 'request:new_bg':
      let bg = await preamble.background.new();
      preamble.renderer.updateBackground(bg);
      break;
    case 'update:setting':
      handleSettingUpdate(message.payload as SettingChangePayload);
      break;
    default: break;
  }

  return { response };
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
