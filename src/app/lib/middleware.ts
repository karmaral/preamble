import type { InitData } from "src/types";

export function requestNewBackground() {
  chrome.runtime.sendMessage({
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

  const request = await chrome.runtime.sendMessage({
    action: 'request:init',
    payload: { geolocation: geo },
  });

  return request.response;
}
export function updateSetting(payload: { key: string; label: string; value: unknown }) {
  chrome.runtime.sendMessage({
    action: 'update:setting',
    payload,
  });
}
