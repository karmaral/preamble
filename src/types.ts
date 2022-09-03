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
  src: string,
  url: string,
  user_name: string,
};
