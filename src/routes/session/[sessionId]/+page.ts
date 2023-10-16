import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { querySpaceById } from '$utils/session/search';

export const load: PageLoad = async ({ parent, params, url }) => {
	const { supabase } = await parent();
	if (!params?.sessionId) {
		throw error(404, {
			message: 'Session ID not provided'
		});
	}

	const space = await querySpaceById(supabase, params.sessionId);

	return {
		space,
		url: url.href,
		supabase: supabase
	};
};
