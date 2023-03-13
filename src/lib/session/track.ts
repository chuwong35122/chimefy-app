import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import type { SearchType } from '$lib/interfaces/spotify/track.interface';
import { getBearerToken } from '$lib/spotify/spotify';
import qs from 'querystring';

export async function searchTrack(q: string, type: SearchType, access_token: string) {
	const payload = {
		q: q,
		type: type,
		limit: 15
		// market: '',
	};
	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/search`, {
		body: qs.encode(payload),
		headers: {
			Authorization: getBearerToken(access_token),
			'Content-Type': 'application/json'
		}
	});

	// const tracks = (await res.json()) as Spot;
}
