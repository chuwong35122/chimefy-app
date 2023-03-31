import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';

// context_uri: [spotify:track]
export const POST: RequestHandler = async ({ fetch, request }) => {
	const { access_token, device_id } = await request.json();

	const addQueueRes = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/pause`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		body: JSON.stringify({
			device_id
		})
	});
	return json(await addQueueRes.json());
};
