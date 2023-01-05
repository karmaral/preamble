export async function setInitialBackdropColor() {
  const { backdrop_color } = await chrome.storage.local.get('backdrop_color');
  document.body.style.setProperty('--backdrop-color', backdrop_color.value);
}
