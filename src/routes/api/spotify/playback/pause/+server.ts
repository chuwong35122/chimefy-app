import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$spotify/user';

// context_uri: [spotify:track]
export const POST: RequestHandler = async ({ fetch, request }) => {
	const req = request.clone();
	const { access_token, device_id } = await req.json();

	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/pause`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: getBearerToken(access_token ?? '')
		},
		body: JSON.stringify({
			device_id
		})
	});

	return new Response(JSON.stringify({ status: res.status, statusText: res.statusText }));
};
