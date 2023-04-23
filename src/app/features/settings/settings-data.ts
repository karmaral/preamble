import { updateWeatherLocation } from '$lib/middleware';

export default {
  image_fetching : {
    label: 'Data Sources',
    settings: [
      {
        item_key: 'quotes_source',
        title: 'Quotes',
        description: 'The daily quote will change at 04:00am',
        input_type: 'enum',
        options: [
          { label: 'They Said So', value: 'https://quotes.rest/qod' },
          { label: 'GitHub', value: 'https://api.github.com/zen' },
        ],
      },
      {
        item_key: 'weather_location',
        title: 'Weather Geolocation',
        description: 'Specify the place to get the weather from',
        input_type: 'text',
        direction: 'vertical',
        custom_action: updateWeatherLocation,
      },
    ],
  },
  interface : {
    label: 'Interface',
    settings: [
      {
        item_key: 'font_family',
        title: 'Font Family',
        description: 'Choose a font or type a custom one (must be installed locally).',
        input_type: 'select',
        options: [
          { label: 'Avenir', value: 'Avenir' },
          { label: 'System UI', value: '-apple-system, system-ui, BlinkMacSystemFont' },
          { label: 'Segoe UI', value: 'Segoe UI' },
          { label: 'Ubuntu', value: 'Ubuntu' },
          { label: 'San Francisco', value: '-apple-system, BlinkMacSystemFont' },
          { label: 'Monospace', value: 'monospace' },
          { label: 'Custom', value: 'custom', custom: true },
        ],
      },
    ],
  },
  behaviour : {
    label: 'Behaviour',
    settings: [
      {
        item_key: 'background_change_interval',
        title: 'Background change',
        description: 'How often should the background change?\nDefault mode will change every day at 0:00.',
        input_type: 'range',
        input_label: '',
      },
      {
        item_key: 'clock_display_format',
        title: 'Clock Display Format',
        description: '',
        input_type: 'enum',
        options: [
          { label: '12h', value: '12' },
          { label: '24h', value: '24' },
        ],
        input_label: '12h | 24h',
      },
    ],
  },
  user : {
    label: 'You',
    settings: [
      {
        item_key: 'user_name',
        title: 'What\'s your name?',
        description: '',
        input_type: 'text',
        input_label: '',
        direction: 'vertical',
      },
    ],
  },
};
