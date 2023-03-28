import type { MusicSession } from '$lib/interfaces/session/session.interface';
import type { Record } from 'pocketbase';
import { writable } from 'svelte/store';

export interface SessionSearchResult {
	results: (MusicSession & Record)[];
	loading: boolean;
}

export const sessionSearchResult = writable<SessionSearchResult>({
	results: [],
	loading: false
});
