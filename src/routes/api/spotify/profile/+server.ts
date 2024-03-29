import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBearerToken } from '$spotify/user';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { access_token } = await request.json();
	const userProfileRes = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		}
	});
	const profile = await userProfileRes.json();
	return json(profile);
};
