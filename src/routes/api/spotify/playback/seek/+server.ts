import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const req = request.clone();
	const _req = await req.json();
	const { access_token, device_id, position_ms } = _req;

	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/seek`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		method: 'PUT',
		body: JSON.stringify({
			device_id: device_id,
			position_ms: position_ms
		})
	});

	const response = await res.json();
	return json({
		status: response.status
	});
};
