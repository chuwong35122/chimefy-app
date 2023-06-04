import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$lib/spotify/spotify';

// Play each Spotify track base on its position (ms)
// uris is in [spotify:track, ...] format
export const POST: RequestHandler = async ({ fetch, request }) => {
	const req = request.clone();
	const _req = await req.json();
	const { access_token, device_id, uris, position_ms } = _req;
	// console.log(getBearerToken(access_token));

		const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/me/player/play?device_id=${device_id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: getBearerToken(access_token ?? '')
			},
			method: 'PUT',
			body: JSON.stringify({
				uris: uris,
				position_ms: position_ms
			})
		});

		return new Response(JSON.stringify({ status: res.status, statusText: res.statusText }));
};
