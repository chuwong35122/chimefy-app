import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	refresh: async ({ request, locals }) => {
		const data = await request.formData();
		const refreshToken = String(data.get('refresh_token'));
		const redirectTo = data.get('redirectTo')?.toString();

		console.log(refreshToken, redirectTo);

		console.log(refreshToken, redirectTo);

		if (!refreshToken) {
			throw error(400, 'No refresh token provided');
		}

		// const result = await locals.supabase.auth.({ refresh_token: refreshToken });
		// if (result.error) {
		// console.log(result.error);
		// }
		throw redirect(301, redirectTo ?? '/space');
	}
};
