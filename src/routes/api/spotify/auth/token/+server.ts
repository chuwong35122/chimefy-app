import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import qs from 'querystring';
import { PUBLIC_SPOTIFY_CALLBACK_URI, PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { PRIVATE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import type { AuthTokens } from '$lib/interfaces/spotify/auth.interface';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const code = url.searchParams.get('code');
	const authHeader =
		'Basic ' +
		Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ':' + PRIVATE_SPOTIFY_CLIENT_SECRET).toString('base64');

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
			Authorization: authHeader
		}
	});

	const authResponse = (await authRes.json()) as AuthTokens;
	return json(authResponse);
};
