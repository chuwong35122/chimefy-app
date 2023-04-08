import type { RequestHandler } from '../$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';

// Transfer playback state to other device
export const POST: RequestHandler = async ({ fetch, request }) => {
	const req = await request.json();
	const { access_token, device_id, play } = req;

	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		method: 'PUT',
		body: JSON.stringify({
			device_ids: [device_id],
			play: play
		})
	});

	return await res.json();
};
