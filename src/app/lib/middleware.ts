import type { BackgroundPhoto } from "src/types";

export async function requestNewBackground(): Promise<BackgroundPhoto> {
  const request = await chrome.runtime.sendMessage({
    action: 'bg:new',
  });

  return request.response;
}

export { };
