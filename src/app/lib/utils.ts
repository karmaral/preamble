export async function setInitialSettings() {
  const { settings } = await chrome.storage.local.get('settings');
  const { backdrop_color, font_family } = settings;
  document.body.style.setProperty('--backdrop_color', backdrop_color?.value);
  document.body.style.setProperty('--font_family', font_family?.value);
}
