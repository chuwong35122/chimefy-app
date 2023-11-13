import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import type { AuthTokens } from '$lib/types/spotify/auth.interface';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { PRIVATE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';

// Refresh Spotify's Access Token
export const POST: RequestHandler = async ({ fetch, request }) => {
	const data = await request.formData();
	const refreshToken = String(data.get('refresh_token'));

	const res = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: PUBLIC_SPOTIFY_CLIENT_ID,
			client_secret: PRIVATE_SPOTIFY_CLIENT_SECRET
		})
	});

	return json((await res.json()) as AuthTokens);
};
