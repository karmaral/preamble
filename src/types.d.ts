export interface InitData {
  photo: BackgroundPhoto;
  settings: StoredSettings
};

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

export interface Storage {
  settings: Partial<StoredSettings>;
  current_quote: Quote;
  quotes_history: Quote[];
  current_weather: Weather;
  geolocation: Coordinates;
  last_changed: string;
  current_bg: BackgroundPhoto;
}

export interface StoredSettingVariable {
  setting: string;
  value: string;
  custom?: boolean;
}

export interface StoredSettings {
  user_name: StoredSettingsVariable;
  backdrop_color: StoredSettingVariable;
  quotes_source: StoredSettingVariable;
  weather_source: StoredSettingVariable;
  weather_unit: StoredSettingVariable;
  font_family: StoredSettingVariable;
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

export interface SettingChangePayload {
  key: string;
  value: string | number | boolean;
  label: string;
  custom?: boolean;
}
