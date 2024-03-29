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
  date: string;
}

export interface Quote {
  text: string;
  author: string;
  source: string;
  date: string;
}

export interface Weather {
  temperature: number;
  time: number;
  weathercode: number;
  text: string;
  text_long: string;
  city: string;
}
export interface LocationData {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface Storage {
  settings: Partial<StoredSettings>;
  current_quote: Quote;
  quotes_history: Quote[];
  current_weather: Weather;
  weather_location_data: LocationData;
  current_bg: BackgroundPhoto;
  bg_history: BackgroundPhoto[];
}

export interface StoredSettingVariable {
  setting?: string;
  value: string;
  custom_value?: string;
}

export interface StoredSettings {
  user_name: StoredSettingsVariable;
  backdrop_color: StoredSettingVariable;
  quotes_source: StoredSettingVariable;
  weather_source: StoredSettingVariable;
  weather_unit: StoredSettingVariable;
  font_family: StoredSettingVariable;
  weather_location: StoredSettingVariable;
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
  custom_action?: (...args: unknown) => void;
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
  label?: string;
  custom_value?: string | number | boolean;
}

export interface Message {
  action: string;
  payload: unknown;
  [key: string]: unknown;
}
