import type { MusicQueue } from '$lib/types/session/queue.interface';
import { writable } from 'svelte/store';

export const playingInfo = writable<MusicQueue | null>(null);

export const playingTrackId = writable('');
export const isPlayingStatus = writable(false);
export const playingDurationMs = writable(0);
