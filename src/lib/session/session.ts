import type { SessionMember } from '$lib/interfaces/session/member.interface';
import type { MusicQueue, MusicSessionQueue } from '$lib/interfaces/session/queue.interface';
import type { MusicSession, MusicSessionRole } from '$lib/interfaces/session/session.interface';
import { writable } from 'svelte/store';

export const currentSession = writable<MusicSession | null>(null);
export const currentSessionQueue = writable<MusicSessionQueue | null>(null);
export const currentSessionMember = writable<SessionMember[]>([]);

export const currentSessionRole = writable<MusicSessionRole>('member');

export const playingInfo = writable<MusicQueue | null>(null);

export const playingTrackId = writable('');
export const isPlayingStatus = writable(false);
export const playingDurationMs = writable(0);

export function onSessionDestroyed() {
	currentSession.set(null);
	currentSessionQueue.set(null);
	currentSessionMember.set([]);
	currentSessionRole.set('member');
	playingInfo.set(null);
	playingTrackId.set('');
	isPlayingStatus.set(false);
	playingDurationMs.set(0);
}