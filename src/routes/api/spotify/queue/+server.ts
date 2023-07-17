import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$spotify/user';

/**
 * Add queue to Spotify queue (body: access_token, uri, device_id)
 */
export const POST: RequestHandler = async ({ fetch, request }) => {
	const { access_token, uri, device_id } = await request.json();

	const addQueueRes = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/queue`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		body: JSON.stringify({
			uri,
			device_id
		})
	});
	return json(await addQueueRes.json());
};
