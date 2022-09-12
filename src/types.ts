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
  quote_history?: { date: string, q: Quote }[],
  quote_source?: StoredSettingVariable,
};
