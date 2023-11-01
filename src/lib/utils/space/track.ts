import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import { getBearerToken } from '$spotify/user';
import qs from 'querystring';
import type { PlaylistTrack, SimplifiedPlaylist, Track } from 'spotify-types';

export async function searchTrack(q: string, access_token: string) {
	const payload = {
		q: q,
		limit: 20,
		type: 'track'
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

export async function searchPlaylist(q: string, access_token: string) {
	const payload = {
		q: q,
		limit: 20,
		type: 'playlist'
	};

	const res = await fetch(`${PUBLIC_SPOTIFY_BASE_URL}/search?${qs.encode(payload)}`, {
		headers: {
			Authorization: getBearerToken(access_token),
			'Content-Type': 'application/json'
		}
	});

	const data = await res.json();
	return data.playlists.items as SimplifiedPlaylist[];
}

export async function getPlaylistTracks(playlist_id: string, length: number, access_token: string) {
	const LIMIT = 30;
	const payload = {
		playlist_id: playlist_id,
		limit: LIMIT,
		offset: 0
	};

	if (length > LIMIT) {
		payload.offset = Math.floor(Math.random() * (length - LIMIT));
	}

	const res = await fetch(
		`${PUBLIC_SPOTIFY_BASE_URL}/playlists/${playlist_id}/tracks?${qs.encode(payload)}`,
		{
			headers: {
				Authorization: getBearerToken(access_token),
				'Content-Type': 'application/json'
			}
		}
	);

	const data = await res.json();
	return data.items as PlaylistTrack[];
}
