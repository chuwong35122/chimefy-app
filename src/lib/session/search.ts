import type { MusicSession } from '$lib/interfaces/session/session.interface';
import { pb } from '$lib/pocketbase/pb';
import { supabase } from '$lib/supabase/supabase';
import type { Record } from 'pocketbase';
import { writable } from 'svelte/store';

export interface SessionSearchResult {
	results: MusicSession[];
	loading: boolean;
}

export const sessionSearchResult = writable<SessionSearchResult>({
	results: [],
	loading: false
});

export async function listSessions(): Promise<MusicSession[]> {
	const { data } = await supabase.from('session').select().eq('isPrivate', false).limit(20);
	return data as MusicSession[];
}

// TODO: must have current playing track & multiple listeners
export async function getSessionList(name: string, type: string, page: number) {
	sessionSearchResult.set({
		results: [],
		loading: true
	});

	// TODO: add filter option
	try {
		const { data } = await supabase
			.from('session')
			.select('*')
			.textSearch('name', name)
			.eq('isPrivate', false)
			.limit(20);

		sessionSearchResult.set({
			results: data as MusicSession[],
			loading: false
		});
	} catch (e) {}
}
