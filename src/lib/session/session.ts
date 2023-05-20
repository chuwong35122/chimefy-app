import type { SessionMember } from '$lib/interfaces/session/member.interface';
import type { MusicSessionQueue } from '$lib/interfaces/session/queue.interface';
import type {
	MusicSession,
	MusicSessionRole,
	SessionPlayingInfo
} from '$lib/interfaces/session/session.interface';
import { writable } from 'svelte/store';

export const currentSession = writable<MusicSession>();
export const currentSessionQueue = writable<MusicSessionQueue | null>(null);
export const currentSessionMember = writable<SessionMember[]>([]);

export const currentSessionPassword = writable('');
export const spotifyPlayerDeviceId = writable('');
export const socketId = writable('');
export const hasConfirmedBroadcast = writable(false);
export const currentSessionRole = writable<MusicSessionRole>('member');

export const playingInfo = writable<SessionPlayingInfo>();
