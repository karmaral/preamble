import {
  QUOTE_RESET_TIME,
  SETTINGS_DEFAULTS,
} from './utils';
import {
  isEmpty,
  isError,
} from 'lodash-es';
import {
  startOfDay,
  addDays,
  addHours,
  isAfter,
} from 'date-fns';
import type {
  Storage,
  StoredSettings,
  Quote,
  Weather,
  Coordinates,
} from "src/types";

const preamble = {
  weather: {
    async init(initParams) {
      const { geolocation: initialGeo } = initParams;
      console.log('init weather', { i: initParams, g: initialGeo });
      const currentWeather = await this.getCurrent();
      const source = await preamble.settings.getWeatherSource();
      const geolocation =  await preamble.settings.getGeolocation();

      if (isEmpty(source)) {
        const { weather_source } = SETTINGS_DEFAULTS;
        await preamble.settings.set({ weather_source });
      }
      if (isEmpty(geolocation)) {
        console.log('empty geolocation setting');
        if (!isEmpty(initialGeo)) {
          if (isError(initialGeo)) {
            // set disabled
            return;
          }
          console.log('setting geoloc', initialGeo);
          await chrome.storage.local.set({
            geolocation: initialGeo,
          });
        }

      }
      if (isEmpty(currentWeather)) {
        await this.new();
        return;
      }

      this.sync(currentWeather);
    },
    async fetch() {
      console.log('fetch weather');
      const source = await preamble.settings.getWeatherSource();
      const unit = await preamble.settings.getWeatherUnit();
      const { latitude, longitude } = await preamble.settings.getGeolocation();
      const lat = `?latitude=${latitude}`;
      const long = `&longitude=${longitude}`;
      const u = unit === 'fahrenheit' ? `&temperature_unit=${unit}` : '';
      const url = `${source}${lat}${long}&current_weather=true&timezone=auto${u}`;
      console.log(url);

      let data = await fetch(url);
      data = await data.json();
      console.log({ weatherFetch: data });

      const { temperature, time, weathercode } = data.current_weather;

      const weather: Weather = {
        temperature,
        weathercode,
        text: this.getWeatherCodeString(weathercode),
        time,
        unit: this.getUnitSymbol(unit),
      };

      return weather;
    },
    async getCurrent(): Promise<Weather> {
      const { current_weather } = await chrome.storage.local.get('current_weather') as StoredSettings;
      return current_weather;
    },
    async setCurrent(weather: Weather) {
      await chrome.storage.local.set({ current_weather: weather });
    },
    async new() {
      const newWeather = await this.fetch();
      this.setCurrent(newWeather);
      await preamble.renderer.updateWeather(newWeather);
    },
    async sync(weather: Weather) {
      const currentWeather = weather ?? await this.getCurrent();

      const lastChange = new Date(currentWeather.time);
      const nextChange = addHours(lastChange, 1);
      const now = new Date();

      if (isAfter(now, nextChange)) {
        await this.new();
        return;
      }
      preamble.renderer.updateWeather(currentWeather);
    },
    getWeatherCodeString(weathercode: number): string | null {
      const mappings = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light, freezing drizzle',
        57: 'Dense, freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snowfall',
        73: 'Moderate snowfall',
        75: 'Heavy snowfall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
      };
      return mappings[weathercode] ?? null;
    },
    getUnitSymbol(unit: string) {
      if (!unit) return '°C';
      const letter = unit.charAt(0).toUpperCase();
      return `°${letter}`;
    },

  },
  quotes: {
    async init() {
      const currentQuote = await this.getCurrent();
      const history = await this.getHistory();
      const source = await preamble.settings.getQuoteSource();

      if (isEmpty(source)) {
        const { quotes_source } = SETTINGS_DEFAULTS;
        await preamble.settings.set({ quotes_source });
      }
      if (isEmpty(history)) {
        const quotes_history = [];
        await preamble.settings.set({ quotes_history });
      }
      if (isEmpty(currentQuote)) {
        await this.new();
        return;
      }

      this.sync(currentQuote);
    },
    async setCurrent(quote: Quote) {
      await chrome.storage.local.set({ current_quote: quote });
      return;
    },
    async getCurrent(): Promise<Quote> {
      const { current_quote } = await chrome.storage.local.get('current_quote') as Storage;
      return current_quote;
    },
    async getHistory(): Promise<Quote[]> {
      const { quotes_history } = await chrome.storage.local.get('quotes_history') as Storage;
      return quotes_history;
    },
    async fetch(): Promise<Quote> {
      const url = await preamble.settings.getQuoteSource();
      let data = await fetch(url);
      // data = target === 'GitHub'
      //   ? await data.text()
      //   : await data.json();
      data = await data.json();

      let quote: Quote;

      quote = {
        id: data.contents.quotes[0].id,
        author: data.contents.quotes[0].author,
        text: data.contents.quotes[0].quote,
        source: data.contents.quotes[0].permalink,
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

      await chrome.storage.local.set(storage);
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
    async set(updateData: Record<string, unknown>): Promise<void> {
      const settings = await preamble.settings.getAll();
      Object.keys(updateData).forEach((k) => {
        settings[k] = updateData[k];
      });
      await chrome.storage.local.set({ settings });
    },
    async getAll(): Promise<StoredSettings> {
      const { settings } = await chrome.storage.local.get('settings');
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
    async getGeolocation(): Promise<Coordinates> {
      const { geolocation } = await chrome.storage.local.get('geolocation') as Storage;
      return geolocation;
    },
  },
  renderer: {
    async updateQuote(quote: Quote) {
      chrome.runtime.sendMessage({
        action: 'update:quote',
        payload: quote,
      });
    },
    async updateWeather(weather: Weather) {
      chrome.runtime.sendMessage({
        action: 'update:weather',
        payload: weather,
      });
    },
  },
};

export default preamble;
