import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { querySpaceById } from '$utils/session/search';

export const load: PageLoad = async ({ parent, params, url }) => {
	const { supabase } = await parent();
	if (!params?.spaceId) {
		throw error(404, {
			message: 'Space ID not provided'
		});
	}

	const space = await querySpaceById(supabase, params.spaceId);

	return {
		space,
		url: url.href,
		supabase: supabase
	};
};
