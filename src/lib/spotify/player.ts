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
	try {
		const payload = {
			uris: session?.queues?.map((q) => q?.trackUri),
			device_id: deviceId,
			position_ms: info?.currentDurationMs ?? 0,
			access_token: access_token
		};
		const res = await fetch('/api/spotify/playback/play', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		await res.json();

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
