import type { MusicSession } from '$lib/interfaces/session/session.interface';
import { supabase } from '$lib/supabase/supabase';
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
	const { data } = await supabase.from('session').select().eq('is_private', false).limit(36);
	return data as MusicSession[];
}

// TODO: must have current playing track & multiple listeners
export async function searchSessionList(name: string, type: string): Promise<MusicSession[]> {
	let _data: MusicSession[] = [];

	let query = supabase.from('session').select();
	if (name) {
		query.textSearch('name', name);
	}

	if (type) {
		query.filter('type', 'eq', type);
	}

	query.limit(36).filter('is_private', 'eq', false);

	const { data } = await query;
	_data = data as MusicSession[];
	return _data as MusicSession[];
}
