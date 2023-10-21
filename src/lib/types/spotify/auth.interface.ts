import type { AccessToken } from 'spotify-types';

export interface AuthTokens extends AccessToken {
	refresh_token: string;
	scope: string;
}
