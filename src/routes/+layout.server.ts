import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const _session = await locals.getSession();

	return {
		session: _session
	};
};
