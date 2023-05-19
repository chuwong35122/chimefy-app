import type { MusicSession } from '$lib/interfaces/session/session.interface';
import { supabase } from '$lib/supabase/supabase';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	if (params?.sessionId == null) {
		throw error(404, {
			message: 'Session ID not provided'
		});
	}
	try {
		const { data } = await supabase.from('session').select('*').eq('uuid', params.sessionId);
		return {
			session: (data as any)[0]
		};
	} catch (e) {
		throw error(404, {
			message: 'Session not found'
		});
	}
};
