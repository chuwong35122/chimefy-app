import { supabase } from '$lib/supabase/supabase';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, url }) => {
	if (params?.sessionId == null) {
		throw error(404, {
			message: 'Session ID not provided'
		});
	}
	try {
		const { data } = await supabase.from('session').select().eq('uuid', params.sessionId);
		const queueRes = await supabase
			.from('session_queue')
			.select()
			.eq('session_uuid', params.sessionId);
		return {
			session: (data as any)[0],
			queues: (queueRes.data as any)[0],
			url
		};
	} catch (e) {
		throw error(404, {
			message: 'Session not found'
		});
	}
};
