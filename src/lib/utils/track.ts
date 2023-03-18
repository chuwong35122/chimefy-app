import type { Track } from 'spotify-types';

export function joinArtists(track: Track | undefined) {
	if (!track) return '';
	return track.artists.map((artist) => artist.name).join(', ');
}
