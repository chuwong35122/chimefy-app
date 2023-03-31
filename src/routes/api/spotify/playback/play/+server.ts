import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';

// Play each Spotify track base on its position (ms)
// context_uri is in spotify:track format
export const POST: RequestHandler = async ({ fetch, request }) => {
	const { device_id, context_uri, position_ms, access_token } = await request.json();

	console.log(await request.json());
	const addQueueRes = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/play`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		body: JSON.stringify({
			context_uri,
			device_id,
			position_ms
		})
	});
	return json(await addQueueRes.json());
};
