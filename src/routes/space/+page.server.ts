import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const spaceId = formData.get('spaceId');
		const NOT_FOUND_ERROR = 'Space not found... please try again.';

		if (!spaceId) {
			throw error(404, NOT_FOUND_ERROR);
		}

		const { data } = await locals.supabase
			.from('space')
			.select('uuid')
			.eq('uuid', spaceId)
			.single();

		if (data) {
			throw redirect(302, `/space/${data.uuid}`);
		}

		throw error(404, NOT_FOUND_ERROR);
	}
};
