import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import qs from 'querystring';
import type { AuthTokens } from '$lib/types/spotify/auth.interface';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { PRIVATE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';

// Refresh Spotify's Access Token
export const POST: RequestHandler = async ({ fetch, request }) => {
	const { refresh_token } = await request.json();

	const res = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token,
			client_id: PUBLIC_SPOTIFY_CLIENT_ID,
			client_secret: PRIVATE_SPOTIFY_CLIENT_SECRET
		})
	});

	const authToken = (await res.json()) as AuthTokens;
	return json(authToken);
};
