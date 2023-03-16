import type { InitData } from "src/types";
import browser from 'webextension-polyfill';

export function requestNewBackground() {
  browser.runtime.sendMessage({
    action: 'request:new_bg',
  });
}

export async function requestInit(): Promise<InitData> {
  console.log('middleware: requestInit');
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const geo = isError(position) ? position : {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
  };

  const request = await browser.runtime.sendMessage({
    action: 'request:init',
    payload: { geolocation: geo },
  });

  return request.response;
}
export function updateSetting(payload: SettingChangePayload) {
  browser.runtime.sendMessage({
    action: 'update:setting',
    payload,
  });
}
