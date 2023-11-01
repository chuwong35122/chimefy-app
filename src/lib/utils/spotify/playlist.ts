import type { MusicQueue } from '$lib/types/space/queue.interface';
import type { SearchType } from '$lib/types/spotify/track.interface';
import { joinArtists } from '$utils/track';
import type { PlaylistTrack, Track } from 'spotify-types';

export function randomPlaylistTracks(tracks: PlaylistTrack[]) {
	const playlists = [...tracks];
	const randomTracks: Track[] = [];

	while (playlists.length > 0) {
		const randomIndex = Math.floor(Math.random() * playlists.length);
		randomTracks.push(playlists[randomIndex].track as Track);
		playlists.splice(randomIndex, 1);
	}

	return randomTracks;
}

export function mapTrackToQueuePayload(
	track: Track,
	userID: string,
	type: SearchType,
	playlistID: string | null
) {
	const payload: MusicQueue = {
		playlist_id: null,
		added_since: new Date(),
		type: type,
		id: track.id,
		uri: track.uri,
		name: track.name,
		artist: joinArtists(track),
		duration_ms: track.duration_ms,
		added_by: userID
	};

	if (type === 'playlist') {
		payload.playlist_id = playlistID;
	}

	if (track.album.images[0].url) {
		payload.image_url = track.album.images[0].url;
	}

	return payload;
}
