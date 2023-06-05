import type { PrivateUser, AccessToken } from 'spotify-types';
import { writable } from 'svelte/store';

export const spotifyAccessToken = writable<{
	access_token: string;
	refresh_token: string;
	since: Date | null;
}>({
	access_token: '',
	refresh_token: '',
	since: null
});
export const spotifyPlayerId = writable('');
export const spotifyUserProfile = writable<PrivateUser | null>(null);
export const hasRefreshTokenRefreshed = writable(false);

export const SPOTIFY_AUTH_SCOPES = [
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'app-remote-control',
	'streaming',
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-private',
	'playlist-modify-public',
	'user-read-playback-position',
	'user-top-read',
	'user-read-recently-played',
	'user-library-modify',
	'user-library-read',
	'user-read-email',
	'user-read-private'
];

export function getBearerToken(access_token: string) {
	return `Bearer ${access_token}`;
}

export function setTokenStore(
	access_token: string | null | undefined,
	refresh_token: string | null | undefined
) {
	spotifyAccessToken.set({
		access_token: access_token ?? '',
		refresh_token: refresh_token ?? '',
		since: new Date()
	});
}

export async function refreshSpotifyToken(refresh_token: string) {
	const res = await fetch('/api/spotify/auth/refresh', {
		method: 'POST',
		body: JSON.stringify({
			refresh_token
		})
	});

	return (await res.json()) as AccessToken;
}
