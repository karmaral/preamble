export type IStorage = {
    count: number;
};


export type UnsplashPhoto = {
	id: number;
	width: number;
	height: number;
	urls: { large: string; regular: string; raw: string; small: string };
	color: string | null;
	user: {
		username: string;
		name: string;
	};
};

export type BackgroundPhoto = {
  id: string,
  src: string,
  url: string,
  user_name: string,
  alt_description: string,
  location: string,
  img_color: string,
};

export type Quote = {
  id: string,
  text: string,
  author: string,
  source: string,
  date: string,
};

export type Weather = {
  temperature: number,
  time: string,
  unit: string,
  weathercode: number,
  text: string,
};
export type Coordinates = {
  latitude: number,
  longitude: number,
};

export type StoredSettingVariable = {
  setting: string,
  value: string,
};

export type StoredSettings = {
  current_bg?: BackgroundPhoto,
  last_changed?: string,
  user_name?: string,
  backdrop_color?: StoredSettingVariable,
  current_quote?: Quote,
  quote_history?: Quote[],
  quote_source?: StoredSettingVariable,
  current_weather?: Weather,
  weather_source?: StoredSettingVariable,
  weather_unit?: StoredSettingVariable,
  geolocation?: Coordinates,
};


export type SettingsItem = {
  item_key: string,
  title: string,
  description: string,
  input_type: string,
  input_label?: string,
  enum_options?: { label: string, value: string }[],
  direction?: string,
};
export type SettingsDataEntry = {
  label: string,
  settings: SettingsItem[],
};
export interface SettingsData {
  [key: string]: SettingsDataEntry
}
