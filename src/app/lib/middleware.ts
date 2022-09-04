import type { BackgroundPhoto } from "src/types";

export function requestNewBackground() {
  chrome.runtime.sendMessage({
    action: 'request:new_bg',
  });
}

export async function requestInit(): Promise<BackgroundPhoto> {
  const request = await chrome.runtime.sendMessage({
    action: 'request:init',
  });

  return request.response;
}
