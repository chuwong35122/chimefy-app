import { appTokenStore } from '$stores/spotify/user';
import type { PrivateUser, AccessToken } from 'spotify-types';

export const SPOTIFY_AUTH_SCOPES = [
	'user-read-playback-state',
	'user-modify-playback-state',
	'app-remote-control',
	'streaming',
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
	appTokenStore.set({
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

export async function getSpotifyProfile(accessToken: string | null | undefined) {
	if (!accessToken) return null;

	const profileRes = await fetch('/api/spotify/profile', {
		method: 'POST',
		body: JSON.stringify({
			access_token: accessToken
		})
	});

	const profile = (await profileRes.json()) as PrivateUser;
	return profile;
}
