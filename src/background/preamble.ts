import {
  QUOTE_RESET_TIME,
  SETTINGS_DEFAULTS,
} from './utils';
import {
  isEmpty,
} from 'lodash-es';
import {
  startOfDay,
  addDays,
  addHours,
  isAfter,
} from 'date-fns';
import type {
  Quote,
  StoredSettings,
} from "src/types";

const preamble = {
  quotes: {
    async init() {
      const currentQuote = await this.getCurrent();
      const history = await this.getHistory();
      const source = await preamble.settings.getQuoteSource();

      if (isEmpty(source)) {
        const { quote_source } = SETTINGS_DEFAULTS;
        await chrome.storage.local.set({ quote_source });
      }
      if (isEmpty(history)) {
        const quote_history = [];
        await chrome.storage.local.set({ quote_history });
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
      const { current_quote } = await chrome.storage.local.get('current_quote') as StoredSettings;
      return current_quote;
    },
    async getHistory(): Promise<Quote[]> {
      const { quote_history } = await chrome.storage.local.get('quote_history') as StoredSettings;

      return quote_history;
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
      const quoteHistory = await this.getHistory();

      const storedSettings: StoredSettings = {
        current_quote: newQuote,
        quote_history: [...quoteHistory, newQuote],
      };

      await chrome.storage.local.set(storedSettings);
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
    async getQuoteSource(): Promise<string> {
      const { quote_source } = await chrome.storage.local.get('quote_source') as StoredSettings;
      return quote_source?.value;
    },
  },
  renderer: {
    async updateQuote(quote: Quote) {
      chrome.runtime.sendMessage({
        action: 'update:quote',
        payload: quote,
      });
    },
  },
};

export default preamble;
