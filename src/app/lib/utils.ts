import browser from 'webextension-polyfill';

export async function setInitialSettings() {
  const { settings } = await browser.storage.local.get('settings');
  const backdrop = settings?.backdrop_color?.value ?? '';
  let font = settings?.font_family?.value ?? '';
  if (font === 'custom') {
    font = settings.font_family.custom_value
  }


  document.body.style.setProperty('--backdrop_color', backdrop);
  document.body.style.setProperty('--font_family', font);
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
