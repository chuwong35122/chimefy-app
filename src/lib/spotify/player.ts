import type {
	MusicSession,
	MusicSessionRole,
	OnChangePlayingInfoRequest,
	SessionPlayingInfo
} from '$lib/interfaces/session/session.interface';
import { toastValue } from '$lib/notification/toast';
import { playingInfo, spotifyPlayerDeviceId } from '$lib/session/session';
import { socket } from '$lib/socket/client';
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

	socket.emit('onChangePlayingInfo', changePlayingInfoRequest);
}

export async function playTrack(
	info: SessionPlayingInfo,
	deviceId: string,
	session: MusicSession,
	access_token: string
) {
	try {
		const payload = {
			uris: session?.queues?.map((q) => q?.trackUri),
			device_id: deviceId,
			position_ms: info?.currentDurationMs ?? 0,
			access_token: access_token
		};
		console.log(payload);
		const res = await fetch('/api/spotify/playback/play', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		const playback = await res.json();
		console.log({ playback });

		if (session?.queues && session?.queues[0]) {
			playingInfo.set({
				...session.queues[0],
				status: 'playing',
				currentDurationMs: 0
			});
		}
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
	socket.on('handleChangePlayingInfo', (info: SessionPlayingInfo) => {
		if (role === 'admin') return;
		playingInfo.set(info);
		if (role === 'member') {
			if (info.status === 'playing') {
				// togglePlay();
				console.log('play');
			} else {
				// togglePause();
				console.log('pause');
			}
		}
	});
}
