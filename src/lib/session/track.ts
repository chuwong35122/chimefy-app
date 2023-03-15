import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import type { SearchType } from '$lib/interfaces/spotify/track.interface';
import { getBearerToken } from '$lib/spotify/spotify';
import qs from 'querystring';
import type { Track } from 'spotify-types';

export async function searchTrack(q: string, type: SearchType, access_token: string) {
	const payload = {
		q: q,
		type: type,
		limit: 15
	};
	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/search?${qs.encode(payload)}`, {
		headers: {
			Authorization: getBearerToken(access_token),
			'Content-Type': 'application/json'
		}
	});

	const data = await res.json();
	return data.tracks.items as Track[];
}