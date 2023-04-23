import browser from 'webextension-polyfill';
import {
  QUOTE_RESET_TIME,
  SETTINGS_INIT_DATA,
  BACKGROUND_FALLBACK,
} from './utils';
import {
  isEmpty,
} from 'lodash-es';
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  isAfter,
} from 'date-fns';
import type { Random as RandomImage } from 'unsplash-js/dist/methods/photos/types';
import type {
  Storage,
  StoredSettings,
  SettingChangePayload,
  BackgroundPhoto,
  Quote,
  Weather,
  LocationData,
} from "$types";

const preamble = {
  background: {
    async init() {
      const current = await this.getCurrent();
      const history = await this.getHistory();

      if (isEmpty(history)) {
        await browser.storage.local.set({ bg_history: [] });
      }

      if (isEmpty(current)) {
        await preamble.background.new();
      }
    },
    async fetch(): Promise<RandomImage> {
      const url = 'https://preamble-server.vercel.app/api/background';
      const res = await fetch(url);
      const result = await res.json();
      return result;
    },
    async new(): Promise<BackgroundPhoto> {
      const bgHistory = await this.getHistory();
      const imgFetch = await preamble.background.fetch();
      let photo: BackgroundPhoto;

      const last_changed = Date().toString();
      if (imgFetch) {
        photo = {
          id: imgFetch.id,
          src: `${imgFetch.urls.raw}?q=80&fm=jpg&w=1920`,
          url: imgFetch.links.html,
          user_name: imgFetch.user.name,
          alt_description: imgFetch.alt_description,
          location: imgFetch.location.name || 'Unknown',
          img_color: imgFetch.color,
          date: last_changed,
        };
      } else {
        photo = BACKGROUND_FALLBACK;
      }

      const newBackdrop = { value: photo.img_color };

      const storage: Partial<Storage> = {
        current_bg: photo,
        bg_history: [...bgHistory, photo],
      };

      await browser.storage.local.set(storage);
      await preamble.settings.set({ backdrop_color: newBackdrop });

      return photo;
    },
    async getCurrent(): Promise<BackgroundPhoto> {
      const { current_bg } = await browser.storage.local.get('current_bg') as Storage;
      return current_bg;
    },
    async getHistory() {
      const { bg_history } = await browser.storage.local.get('bg_history') as Storage;
      return bg_history;
    },
  },
  weather: {
    async init() {
      const currentWeather = await this.getCurrent();
      const locationData = await preamble.settings.getLocationData();

      if (isEmpty(locationData)) {
        await browser.storage.local.set({ weather_location_data: {} });
      }

      if (isEmpty(currentWeather)) {
        await this.new();
        return;
      }

      this.sync(currentWeather);
    },
    async fetch() {
      const source = 'https://preamble-server.vercel.app/api/weather';
      const locationData = await preamble.settings.getLocationData();
      const u = await preamble.settings.getWeatherUnit();
      const { lat, lon } = locationData;
      const url = `${source}?lat=${lat}&lon=${lon}&unit=${u}`;


      const res = await fetch(url);
      const data = await res.json() as Partial<Weather>;
      const { temperature, weathercode, text, text_long, time } = data;

      const weather: Weather = {
        temperature,
        weathercode,
        text,
        text_long,
        time,
        city: locationData.name,
      };

      return weather;
    },
    async fetchLocationData(query: string) {
      const source = 'https://preamble-server.vercel.app/api/geolocation';
      const url = `${source}?q=${query}`;

      const res = await fetch(url);
      const data = await res.json();

      return data;
    },
    async getCurrent(): Promise<Weather> {
      const { current_weather } = await browser.storage.local.get('current_weather') as Storage;
      return current_weather;
    },
    async setCurrent(weather: Weather) {
      await browser.storage.local.set({ current_weather: weather });
    },
    async new() {
      const locationData = await preamble.settings.getLocationData();
      if (isEmpty(locationData)) return;

      const newWeather = await this.fetch();

      this.setCurrent(newWeather);
      await preamble.renderer.updateWeather(newWeather);
    },
    async sync(weather: Weather) {
      const currentWeather = weather ?? await this.getCurrent();
      const CHANGE_INTERVAL = 30;

      const lastChange = new Date(currentWeather.time);
      const nextChange = addMinutes(lastChange, CHANGE_INTERVAL);
      const now = new Date();

      if (isAfter(now, nextChange)) {
        await this.new();
        return;
      }
      preamble.renderer.updateWeather(currentWeather);
    },
    async getLocationString() {
      const { weather_location } = await preamble.settings.getAll();
      return weather_location;
    },
    async handleLocationUpdate(payload: SettingChangePayload) {
      const locationString = payload.value as string;
      preamble.settings.handleUpdate({
        key: 'weather_location',
        value: locationString,
      });

      const data = await preamble.weather.fetchLocationData(locationString);
      await browser.storage.local.set({
        weather_location_data: data,
      });

      await preamble.weather.new();
    },

  },
  quotes: {
    async init() {
      const currentQuote = await this.getCurrent();
      const history = await this.getHistory();

      if (isEmpty(history)) {
        const quotes_history = [];
        await browser.storage.local.set({ quotes_history });
      }
      if (isEmpty(currentQuote)) {
        await this.new();
        return;
      }

      this.sync(currentQuote);
    },
    async setCurrent(quote: Quote) {
      await browser.storage.local.set({ current_quote: quote });
      return;
    },
    async getCurrent(): Promise<Quote> {
      const { current_quote } = await browser.storage.local.get('current_quote') as Storage;
      return current_quote;
    },
    async getHistory(): Promise<Quote[]> {
      const { quotes_history } = await browser.storage.local.get('quotes_history') as Storage;
      return quotes_history;
    },
    async fetch(): Promise<Quote> {
      const url = 'https://preamble-server.vercel.app/api/quote';

      const res = await fetch(url);
      const data = await res.json();
      const { author, text, source } = data;


      const quote: Quote = {
        author, text, source,
        date: new Date().toString(),
      };
      console.log({ quote });

      return quote;
    },
    async new() {
      const newQuote = await this.fetch();
      const quotesHistory = await this.getHistory();

      const storage: Partial<Storage> = {
        current_quote: newQuote,
        quotes_history: [...quotesHistory, newQuote],
      };

      await browser.storage.local.set(storage);
      await preamble.renderer.updateQuote(newQuote);
    },
    async sync(quote: Quote) {
      const currentQuote = quote ?? await this.getCurrent();

      const lastDate = new Date(currentQuote.date);
      const lastChange = addHours(startOfDay(lastDate), QUOTE_RESET_TIME);
      const nextChange = addDays(lastChange, 1);
      const now = new Date();

      if (isAfter(now, nextChange)) {
        await this.new();
        return;
      }
      console.log({ now, nextChange, lastChange, isAfter: isAfter(now, nextChange) });
      preamble.renderer.updateQuote(currentQuote);
    },
  },
  settings: {
    async init() {
      const settings = await preamble.settings.getAll();
      if (isEmpty(settings)) {
        await preamble.settings.set(SETTINGS_INIT_DATA);
      }
    },
    async set(updateData: Record<string, unknown>): Promise<void> {
      const settings = await preamble.settings.getAll() ?? {};
      Object.keys(updateData).forEach((k) => {
        settings[k] = updateData[k];
      });
      await browser.storage.local.set({ settings });
    },
    async handleUpdate(payload: SettingChangePayload) {
      const { key, label, value } = payload;
      const updateData: Record<string, unknown> = { setting: label, value };
      if (payload.custom_value) {
        updateData.custom_value = payload.custom_value;
      }
      await preamble.settings.set({ [key]: updateData });
    },
    async getAll(): Promise<StoredSettings> {
      const { settings } = await browser.storage.local.get('settings');
      return settings;
    },
    async getQuoteSource(): Promise<string> {
      const { quotes_source } = await preamble.settings.getAll();
      return quotes_source?.value;
    },
    async getWeatherSource(): Promise<string> {
      const { weather_source } = await preamble.settings.getAll();
      return weather_source?.value;
    },
    async getWeatherUnit(): Promise<string> {
      const { weather_unit } = await preamble.settings.getAll();
      return weather_unit?.value;
    },
    async getLocationData(): Promise<LocationData> {
      const { weather_location_data } = await browser.storage.local.get('weather_location_data') as Storage;
      return weather_location_data;
    }
  },
  renderer: {
    updateBackground(photo: BackgroundPhoto) {
      browser.runtime.sendMessage({
        action: 'update:bg',
        payload: photo,
      });
    },
    async updateQuote(quote: Quote) {
      browser.runtime.sendMessage({
        action: 'update:quote',
        payload: quote,
      });
    },
    async updateWeather(weather: Weather) {
      browser.runtime.sendMessage({
        action: 'update:weather',
        payload: weather,
      });
    },
  },
};

export default preamble;
