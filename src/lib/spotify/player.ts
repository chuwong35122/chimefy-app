import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
import type {
	MusicSession,
	MusicSessionRole,
	// OnChangePlayingInfoRequest,
	SessionPlayingInfo
} from '$lib/interfaces/session/session.interface';
import { playingInfo } from '$lib/session/session';

export async function setActiveSpotifyPlayer(device_id: string, access_token: string) {
	await fetch('/api/spotify/playback/transfer', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			device_id: device_id,
			access_token: access_token
		})
	});
}

export async function playTrack(
	info: SessionPlayingInfo,
	deviceId: string,
	queues: MusicQueue[],
	access_token: string
) {
	const payload = {
		uris: queues?.map((q) => q?.track_uri),
		device_id: deviceId,
		position_ms: info?.currentDurationMs ?? 0,
		access_token: access_token
	};
	console.log(payload);
	await fetch('/api/spotify/playback/play', {
		method: 'POST',
		body: JSON.stringify(payload)
	});

	if (queues && queues[0]) {
		playingInfo.set({
			...queues[0],
			is_playing: true,
			currentDurationMs: payload.position_ms
		});
	}
}