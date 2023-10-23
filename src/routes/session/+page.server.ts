import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const spaceId = formData.get('spaceId');
		const NOT_FOUND_ERROR = 'Session not found... please try again.';

		if (!spaceId) {
			throw error(404, NOT_FOUND_ERROR);
		}

		const { data } = await locals.supabase
			.from('session')
			.select('uuid')
			.eq('uuid', spaceId)
			.single();

		if (data) {
			throw redirect(302, `/session/${data.uuid}`);
		}

		throw error(404, NOT_FOUND_ERROR);
	}
};
