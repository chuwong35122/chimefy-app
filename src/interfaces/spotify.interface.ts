export interface SpotifyTokenResponse {
	access_token: string;
	expires_in: 3600 | number;
	refresh_token: string;
	scope: string;
	token_type: 'Bearer';
}

export interface SpotifyUserProfile {
	country: string;
	display_name: string;
	email: string;
	explicit_content: UserProfileExplicitContent;
	external_urls: SpotifyUserProfileExternalUrls;
	href: string;
	id: string;
	images: SpotifyUserProfileImage[];
	product: 'premium' | string;
	type: 'user' | string;
	uri: string;
}

interface UserProfileExplicitContent {
	filter_enabled: boolean;
	filter_locked: boolean;
}
interface SpotifyUserProfileExternalUrls {
	spotify: string;
}

export interface SpotifyUserProfileImage {
	height: null | number;
	url: string;
	width: null | number;
}
