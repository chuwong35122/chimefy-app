import type { Database } from '$lib/types/database/supabase.types';
import type { MusicQueue } from '$lib/types/session/queue.interface';
import type { MusicSpace } from '$lib/types/session/session.interface';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function queryUserSpace(
	supabase: SupabaseClient<Database>,
	id: string
): Promise<MusicSpace[]> {
	if (!id) return [];

	const { data } = await supabase
		.from('session')
		.select('*')
		.eq('created_by', id)
		.order('created_at', { ascending: false });

	return ((data as any) ?? []) as MusicSpace[];
}

export async function queryPublicSpaces(supabase: SupabaseClient<Database>, name: string, type: string) {
	const query = supabase.from('session').select('*');

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

	return ((data as any) ?? []) as MusicSpace[];
}

export async function querySpaceById(supabase: SupabaseClient<Database>, id: string) {
	const { data } = await supabase.from('session').select('*').eq('uuid', id).single();

	return data as any as MusicSpace;
}

export async function querySpaceQueueById(
	supabase: SupabaseClient<Database>,
	id: string
): Promise<MusicQueue | null> {
	const { data } = await supabase.from('session_queue').select().eq('session_uuid', id).single();

	return data as any as MusicQueue;
}
