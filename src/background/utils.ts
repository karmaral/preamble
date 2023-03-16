const SETTINGS_KEYS: string[] = [
  'current_bg',
  'last_changed',
  'user_name',
  'backdrop_color',
  'current_quote',
  'quotes_history',
  'quotes_source',
];
const QUOTE_RESET_TIME = 4;

const SETTINGS_DEFAULTS = {
  quotes_source: {
    setting: 'They Said So',
    value: 'https://quotes.rest/qod',
  },
  weather_source: {
    setting: 'Open Meteo',
    value: 'https://api.open-meteo.com/v1/forecast',
  },
  user_name: {
    setting: '',
    value: '',
  },
};

export {
  SETTINGS_DEFAULTS,
  SETTINGS_KEYS,
  QUOTE_RESET_TIME,
};
