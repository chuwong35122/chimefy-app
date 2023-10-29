import type { MusicQueue } from '$lib/types/session/queue.interface';

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
	queue: MusicQueue,
	deviceId: string,
	playingDurationMs: number,
	access_token: string
) {
	const payload = {
		uris: [queue?.uri],
		device_id: deviceId,
		position_ms: playingDurationMs ?? 0,
		access_token: access_token
	};
	await fetch('/api/spotify/playback/play', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

export async function pauseTrack(device_id: string, access_token: string) {
	await fetch('/api/spotify/playback/pause', {
		method: 'POST',
		body: JSON.stringify({
			device_id,
			access_token
		})
	});
}
