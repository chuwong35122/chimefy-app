import type { SessionMember } from '$lib/types/session/member.interface';
import type { MusicQueue, MusicSessionQueue } from '$lib/types/session/queue.interface';
import type { MusicSession, MusicSessionRole } from '$lib/types/session/session.interface';
import { writable } from 'svelte/store';

// old
export const currentSession = writable<MusicSession | null>(null);

export const currentSessionQueue = writable<MusicSessionQueue | null>(null);
export const currentSessionMember = writable<SessionMember[]>([]);

export const currentSessionRole = writable<MusicSessionRole>('member');

export const playingInfo = writable<MusicQueue | null>(null);

export const playingTrackId = writable('');
export const isPlayingStatus = writable(false);
export const playingDurationMs = writable(0);