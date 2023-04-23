import browser from 'webextension-polyfill';
import type { InitData, SettingChangePayload } from '$types';

export function requestNewBackground() {
  browser.runtime.sendMessage({
    action: 'request:new_bg',
  });
}

export async function requestInit(): Promise<InitData> {
  const request = await browser.runtime.sendMessage({
    action: 'request:init',
  });
  return request.response;
}

export function updateSetting(payload: SettingChangePayload) {
  browser.runtime.sendMessage({
    action: 'update:setting',
    payload,
  });
}
export function updateWeatherLocation(payload: SettingChangePayload) {
  browser.runtime.sendMessage({
    action: 'update:weather_location',
    payload,
  });
}
