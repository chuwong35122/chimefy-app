import type { MusicSessionInfo } from '$interfaces/session/session.interface';
import { supabase } from '$supabase/supabase';

export async function listSessions(): Promise<MusicSessionInfo[]> {
	const { data } = await supabase
		.from('session')
		.select(
			`
			id, 
			uuid, 
			created_at, 
			name,
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

export async function listUserSession(id: string): Promise<MusicSessionInfo[]> {
	if (!id) return [];

	const { data } = await supabase
		.from('session')
		.select(
			`
			id, 
			uuid, 
			created_at, 
			name,
			is_private, 
			type, 
			session_queue( id, updated_since, queues ), 
			created_by
		`
		)
		.eq('created_by', id)
		.order('created_at', { ascending: false });
	console.log(data);

	return ((data as any) ?? []) as MusicSessionInfo[];
}

export async function searchSessionList(name: string, type: string): Promise<MusicSessionInfo[]> {
	const query = supabase.from('session').select(
		`
			id, 
			uuid, 
			created_at, 
			name,
			is_private,
			type,
			session_queue( id, updated_since, queues ) 
		`
	);

	if (name) {
		query.textSearch('name', `'${name}'`);
	}

	if (type) {
		query.filter('type', 'eq', type);
	}

	const { data } = await query
		.limit(36)
		.filter('is_private', 'eq', false)
		.order('created_at', { ascending: false });

	return ((data as any) ?? []) as MusicSessionInfo[];
}
