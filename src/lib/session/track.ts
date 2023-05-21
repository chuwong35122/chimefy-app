import { PUBLIC_SPOTIFY_BASE_URL } from '$env/static/public';
import type { SearchType } from '$lib/interfaces/spotify/track.interface';
import type { SessionBroadcastRequest } from '$lib/interfaces/session/socket.interface';
import { getBearerToken } from '$lib/spotify/spotify';
import qs from 'querystring';
import type { Track } from 'spotify-types';
import type { MusicSession } from '$lib/interfaces/session/session.interface';
import type { SessionPlayingInfo } from '$lib/interfaces/session/session.interface';

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

export function convertTrackMsToPercentage(
	currentMs: number | undefined,
	durationMs: number | undefined
) {
	if (!currentMs || !durationMs) return 0;

	return (currentMs / durationMs) * 100;
}

export function convertPercentageToTrackMs(
	percentage: number | undefined,
	durationMs: number | undefined
) {
	if (!percentage || !durationMs) return 0;
	return (percentage / 100) * durationMs;
}

export function createBroadcastPayload(session: MusicSession, playingInfo: SessionPlayingInfo) {
	const payload: SessionBroadcastRequest = {
		sessionId: session?.uuid,
		status: playingInfo?.status ?? 'playing',
		currentDurationMs: playingInfo?.currentDurationMs ?? 0,
		trackId: playingInfo?.trackId ?? session?.queues[0]?.trackId,
		trackUri: playingInfo?.trackUri ?? session?.queues[0]?.trackUri,
		trackName: playingInfo?.trackName ?? session?.queues[0]?.trackName,
		artist: playingInfo?.artist ?? session?.queues[0]?.artist,
		durationMs: playingInfo?.durationMs ?? session?.queues[0]?.durationMs,
		trackImageUrl: playingInfo?.trackImageUrl ?? session?.queues[0]?.trackImageUrl,
		addedSince: playingInfo?.addedSince ?? session?.queues[0]?.addedSince
	};

	return payload;
}
