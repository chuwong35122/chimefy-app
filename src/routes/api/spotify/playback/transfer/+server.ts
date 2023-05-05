import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';
import { json } from '@sveltejs/kit';

// Transfer playback state to other device
export const POST: RequestHandler = async ({ fetch, request }) => {
	const req = request.clone();
	const _req = await req.json();
	const { device_id, access_token } = _req;

	const payload = {
		device_ids: [device_id],
		play: true
	};

	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		body: JSON.stringify(payload)
	});

	console.log('transfering');
	const response = await res.json();
	console.log(response);
	return json(response);
};
