import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { PRIVATE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_BASE_URL,
	PUBLIC_SPOTIFY_CALLBACK_URI
} from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';
import qs from 'querystring';
import type { AccessToken } from 'spotify-types';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const code = url.searchParams.get('code') ?? '';
	const authHeader =
		'Basic ' +
		Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ':' + PRIVATE_SPOTIFY_CLIENT_SECRET).toString('base64');

	const body = {
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: PUBLIC_SPOTIFY_CALLBACK_URI
	};
	try {
		const authRes = await fetch(`https://accounts.spotify.com/api/token`, {
			body: qs.stringify(body),
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: authHeader
			}
		});
		const authResponse = (await authRes.json()) as AccessToken;

		const userProfileRes = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: getBearerToken(authResponse.access_token)
			}
		});
		const userProfile = await userProfileRes.json();
		return {
			tokens: authResponse,
			userProfile: userProfile
		};
	} catch (e) {
		return fail(400, {
			message: 'Cannot authenticate to Spotify'
		});
	}
};
