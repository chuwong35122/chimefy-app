import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$spotify/user';

// Unfortunately, Spotify might stop supporting this function as it always return 403 Unauthorized
export const PUT: RequestHandler = async ({ fetch, request }) => {
	const req = request.clone();
	const _req = await req.json();
	const { device_id, volume_percent, access_token } = _req;

	const res = await fetch(
		`${PUBLIC_SPOTIFY_BASE_URL}/me/player/volume?volume_percent=${volume_percent}&device_id=${device_id}`,
		{
			method: 'PUT',
			headers: {
				Authorization: getBearerToken(access_token ?? ''),
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);

	return new Response(JSON.stringify({ status: res.status, statusText: res.statusText }));
};
