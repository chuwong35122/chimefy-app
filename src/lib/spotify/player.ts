import type {
	MusicSession,
	MusicSessionRole,
	OnChangePlayingInfoRequest,
	SessionPlayingInfo
} from '$lib/interfaces/session/session.interface';
import { playingInfo } from '$lib/session/session';
import type { Record } from 'pocketbase';

export function changeSessionPlayInfo(
	currentSession: MusicSession & Record,
	currentSessionRole: MusicSessionRole,
	playingInfo: SessionPlayingInfo
) {
	if (!currentSession || currentSessionRole !== 'admin') return;

	const changePlayingInfoRequest: OnChangePlayingInfoRequest = {
		playingInfo: playingInfo,
		sessionId: currentSession?.id
	};

	// socket.emit('onChangePlayingInfo', changePlayingInfoRequest);
}

export async function setActiveSpotifyPlayer(device_id: string, access_token: string) {
	await fetch('/api/spotify/playback/transfer', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			device_id,
			access_token,
			play: true
		})
	});
}

export async function playTrack(
	info: SessionPlayingInfo,
	deviceId: string,
	session: MusicSession,
	access_token: string
) {
	const payload = {
		uris: session?.queues?.map((q) => q?.trackUri),
		device_id: deviceId,
		position_ms: info?.currentDurationMs ?? 0,
		access_token: access_token
	};
	await fetch('/api/spotify/playback/play', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (session?.queues && session?.queues[0]) {
		playingInfo.set({
			...session.queues[0],
			status: 'playing',
			currentDurationMs: payload.position_ms
		});
	}
}

export async function fastForwardCurrentTrack(
	time: number,
	deviceId: string,
	access_token: string,
	sessionPlayingInfo: SessionPlayingInfo
) {
	try {
		await fetch('/api/spotify/playback/seek', {
			method: 'POST',
			body: JSON.stringify({
				position_ms: time,
				device_id: deviceId,
				access_token
			})
		});

		const _playingInfo = { ...sessionPlayingInfo };
		_playingInfo.currentDurationMs = time;
		playingInfo.set(_playingInfo);
	} catch (e) {
		console.log(e);
	}
}

export async function updatePlayInfo(
	info: SessionPlayingInfo,
	session: MusicSession & Record,
	role: MusicSessionRole
) {
	const _playingInfo = { ...info };
	_playingInfo.status = 'playing';
	playingInfo.set(_playingInfo);
	changeSessionPlayInfo(session, role, info);
}

export async function forwardTrack() {
	// go new track
	// remove pb queue[0]
}

export function detectSessionChange(role: MusicSessionRole) {
	// socket.on('handleChangePlayingInfo', (info: SessionPlayingInfo) => {
	// 	if (role === 'member') {
	// 		playingInfo.set(info);
	// 		if (info.status === 'playing') {
	// 			// togglePlay();
	// 			console.log('play');
	// 		} else {
	// 			// togglePause();
	// 			console.log('pause');
	// 		}
	// 	}
	// });
}
