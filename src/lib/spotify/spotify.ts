import { writable } from 'svelte/store';
import { PUBLIC_SPOTIFY_CALLBACK_URI, PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { randomString } from '$lib/utils/random/randomstring';
import type { PrivateUser } from 'spotify-types';

export const spotifyUser = writable<PrivateUser | undefined>();
export const spotifyPlayerId = writable('');
export const spotifyAccessToken = writable('');
export const spotifyRefreshToken = writable('');

const SCOPES = [
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

export function redirectToSpotifyAuth() {
	// TODO: refresh token if there is one saved inside local storage
	const rndString = randomString(16);
	const AUTH_PARAMS = {
		response_type: 'code',
		client_id: PUBLIC_SPOTIFY_CLIENT_ID,
		redirect_uri: PUBLIC_SPOTIFY_CALLBACK_URI,
		scope: SCOPES.join(' '),
		show_dialog: true,
		state: rndString
	};

	const SPOTIFY_AUTH_URI = `https://accounts.spotify.com/authorize?response_type=${AUTH_PARAMS.response_type}&client_id=${AUTH_PARAMS.client_id}&redirect_uri=${AUTH_PARAMS.redirect_uri}&scope=${AUTH_PARAMS.scope}&show_dialog=${AUTH_PARAMS.show_dialog}&state=${AUTH_PARAMS.state}`;
	return SPOTIFY_AUTH_URI;
}

export function getBearerToken(access_token: string) {
	return `Bearer ${access_token}`;
}
