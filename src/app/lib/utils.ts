import browser from 'webextension-polyfill';

export async function setInitialSettings() {
  const { settings } = await browser.storage.local.get('settings');
  const { backdrop_color, font_family } = settings;
  document.body.style.setProperty('--backdrop_color', backdrop_color?.value);
  document.body.style.setProperty('--font_family', font_family?.value);
}

export function cls(classes: Record<string, unknown>) {
  let active: string[] = [];
  Object.keys(classes).forEach(k => {
    if (Boolean(classes[k])) {
      active.push(k);
    }
  });
  return active.filter(Boolean).join(' ');
}
