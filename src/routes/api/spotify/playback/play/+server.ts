import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';

// Play each Spotify track base on its position (ms)
// uwis is in [spotify:track, ...] format
export const POST: RequestHandler = async ({ fetch, request }) => {
	const req = request.clone();
	const _req = await req.json();
	const { access_token, device_id, uris, position_ms } = _req;

	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/play`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		method: 'PUT',
		body: JSON.stringify({
			uris: uris,
			device_id: device_id,
			position_ms: position_ms
		})
	});

	const response = await res.json();
	return json({
		status: response.status
	});
};
