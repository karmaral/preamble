import browser from 'webextension-polyfill';
import preamble from './preamble';
import type {
  SettingChangePayload,
  Message,
  InitData,
} from 'src/types';


async function init(): Promise<InitData> {
  await preamble.settings.init();
  await preamble.background.init();
  const photo = await preamble.background.getCurrent();
  await preamble.quotes.init();
  await preamble.weather.init();
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
      response = await init()
      break;
    case 'request:new_bg':
      let bg = await preamble.background.new();
      preamble.renderer.updateBackground(bg);
      break;
    case 'update:setting':
      await preamble.settings.handleUpdate(message.payload as SettingChangePayload);
      break;
    case 'update:weather_location':
      await preamble.weather.handleLocationUpdate(message.payload as SettingChangePayload);
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
