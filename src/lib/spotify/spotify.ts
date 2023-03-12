import { writable } from 'svelte/store';
import type { SpotifyTokenResponse, SpotifyUserProfile } from '$lib/interfaces/spotify.interface';
import { PUBLIC_SPOTIFY_CALLBACK_URI, PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { randomString } from '$lib/utils/random/randomstring';

export const spotifyToken = writable<SpotifyTokenResponse>();
export const spotifyUser = writable<SpotifyUserProfile>();

export function redirectToSpotifyAuth() {
	const rndString = randomString(16);
	const AUTH_PARAMS = {
		response_type: 'code',
		client_id: PUBLIC_SPOTIFY_CLIENT_ID,
		redirect_uri: PUBLIC_SPOTIFY_CALLBACK_URI,
		scope:
			'ugc-image-upload user-read-playback-state user-modify-playback-state user-read-private user-follow-modify user-follow-read user-library-modify user-library-read streaming user-read-playback-position playlist-modify-private playlist-read-collaborative app-remote-control user-read-email playlist-read-private user-top-read playlist-modify-public user-read-currently-playing user-read-recently-played',
		show_dialog: true,
		state: rndString
	};

	const SPOTIFY_AUTH_URI = `https://accounts.spotify.com/authorize?response_type=${AUTH_PARAMS.response_type}&client_id=${AUTH_PARAMS.client_id}&redirect_uri=${AUTH_PARAMS.redirect_uri}&scope=${AUTH_PARAMS.scope}&show_dialog=${AUTH_PARAMS.show_dialog}&state=${AUTH_PARAMS.state}`;
	return SPOTIFY_AUTH_URI;
}
