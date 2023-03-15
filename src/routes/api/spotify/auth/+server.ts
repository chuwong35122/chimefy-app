import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import qs from 'querystring';
import { PUBLIC_SPOTIFY_CALLBACK_URI, PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { PRIVATE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';

// Refresh Spotify's Access Token
// Type: AccessToken
export const POST: RequestHandler = async ({ fetch, request }) => {
	const { code } = await request.json();
	const body = {
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: PUBLIC_SPOTIFY_CALLBACK_URI
	};

	const authRes = await fetch(`https://accounts.spotify.com/api/token`, {
		body: qs.stringify(body),
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization:
				'Basic ' +
				Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ':' + PRIVATE_SPOTIFY_CLIENT_SECRET).toString(
					'base64'
				)
		}
	});
	return json(await authRes.json());
};
