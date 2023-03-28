export default {
  image_fetching : {
    label: 'Data Fetching',
    settings: [
      {
        item_key: 'unsplash_public_key',
        title: 'Unsplash API',
        description: 'Currently this app leverages the developer API from Unsplash.\n You will have to create an account and use its key in order for the app to work properly.',
        input_type: 'text',
        input_label: 'Access Key',
        direction: 'vertical',
      },
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
    ],
  },
  interface : {
    label: 'Interface',
    settings: [
      {
        item_key: 'backdrop_color',
        title: 'Backdrop Color',
        description: 'Force the backdrop color or let Preamble decide using the time of day.',
        input_type: 'enum',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Black', value: 'black' },
          { label: 'White', value: 'white' },
        ],
        input_label: 'Black | White | Auto',
      },
      {
        item_key: 'font_family',
        title: 'Font Family',
        description: 'Choose a font or type a custom one (must be installed locally).',
        input_type: 'select',
        options: [
          { label: 'Avenir (local)', value: 'Avenir' },
          { label: 'System UI', value: 'system-ui' },
          { label: 'Custom', value: '', custom: true },
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
