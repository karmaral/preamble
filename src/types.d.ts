export interface IStorage {
    count: number;
}


export interface UnsplashPhoto {
	id: number;
	width: number;
	height: number;
	urls: { large: string; regular: string; raw: string; small: string };
	color: string | null;
	user: {
		username: string;
		name: string;
	};
}

export interface BackgroundPhoto {
  id: string;
  src: string;
  url: string;
  user_name: string;
  alt_description: string;
  location: string;
  img_color: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  date: string;
}

export interface Weather {
  temperature: number;
  time: string;
  unit: string;
  weathercode: number;
  text: string;
}
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface StoredSettingVariable {
  setting: string;
  value: string;
}

export interface StoredSettings {
  current_bg?: BackgroundPhoto;
  last_changed?: string;
  user_name?: string;
  backdrop_color?: StoredSettingVariable;
  current_quote?: Quote;
  quote_history?: Quote[];
  quote_source?: StoredSettingVariable;
  current_weather?: Weather;
  weather_source?: StoredSettingVariable;
  weather_unit?: StoredSettingVariable;
  geolocation?: Coordinates;
  font_family?: StoredSettingVariable;
}

export interface SettingsOption {
  label: string;
  value: string | number | boolean;
  custom?: boolean;
}
export interface SettingsItem {
  item_key: string;
  title: string;
  description: string;
  input_type: string;
  input_label?: string;
  options?: SettingsOption[];
  direction?: string;
}
export interface SettingsDataEntry {
  label: string;
  settings: SettingsItem[];
}
export interface SettingsData {
  [key: string]: SettingsDataEntry;
}
