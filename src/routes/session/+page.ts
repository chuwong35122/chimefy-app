import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { queryUserSpace, queryPublicSpaces } from '$utils/session/search';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent();
	const id = session?.user?.id;

	if (!session || !id) {
		throw error(401, 'Unauthorized');
	}

	const userSpace = await queryUserSpace(supabase, session?.user?.id);
	const publicSpaces = await queryPublicSpaces(supabase, '', '');

	return { supabase, userSpace, publicSpaces };
};