import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../$types';
import qs from 'querystring';
import type { AuthTokens } from '$lib/interfaces/spotify/auth.interface';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { PRIVATE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';

// Refresh Spotify's Access Token
export const POST: RequestHandler = async ({ fetch, request }) => {
	const { refresh_token } = await request.json();
	const authHeader =
		'Basic ' +
		Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ':' + PRIVATE_SPOTIFY_CLIENT_SECRET).toString('base64');
	const res = await fetch(`https://accounts.spotify.com/api/token`, {
		body: qs.stringify({ grant_type: 'refresh_token', refresh_token: refresh_token }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: authHeader
		}
	});
	const authToken = (await res.json()) as AuthTokens;
	return json(authToken);
};
