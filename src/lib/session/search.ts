import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
import type { MusicSession, MusicSessionInfo } from '$lib/interfaces/session/session.interface';
import { supabase } from '$lib/supabase/supabase';
import { writable } from 'svelte/store';

export interface SessionSearchResult {
	results: MusicSessionInfo[];
	loading: boolean;
}

export const sessionSearchResult = writable<SessionSearchResult>({
	results: [],
	loading: false
});

export async function listSessions(): Promise<MusicSessionInfo[]> {
	const { data } = await supabase
		.from('session')
		.select(
			`
			id, 
			uuid, 
			created_at, 
			name,
			password,
			is_private, 
			type, 
			session_queue( id, updated_since, queues ), 
			created_by
		`
		)
		.eq('is_private', false)
		.order('created_at', { ascending: false })
		.limit(36);

	return ((data as any) ?? []) as MusicSessionInfo[];
}

// TODO: must have current playing track & multiple listeners
export async function searchSessionList(name: string, type: string): Promise<MusicSessionInfo[]> {
	let query = supabase.from('session').select(
		`
			id, 
			uuid, 
			created_at, 
			password,
			name,
			is_private,
			type,
			session_queue( id, updated_since, queues ), 
		`
	);

	if (name) {
		query.textSearch('name', name);
	}

	if (type) {
		query.filter('type', 'eq', type);
	}

	query.limit(36).filter('is_private', 'eq', false).order('created_at', { ascending: false });
	const { data } = await query;

	return ((data as any) ?? []) as MusicSessionInfo[];
}
