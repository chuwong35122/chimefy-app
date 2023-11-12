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
