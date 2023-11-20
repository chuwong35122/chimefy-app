import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PUBLIC_NODE_ENV } from '$env/static/public';

export const actions: Actions = {
	signout: async ({ fetch }) => {
		await fetch('/api/auth/signout', {
			method: 'POST'
		});
		throw redirect(303, '/');
	},
	reauthenticate: async ({ locals: { supabase }, request }) => {
		const data = await request.formData();
		const url = data.get('url');

		await supabase.auth.signOut();

		if (url) {
			if (PUBLIC_NODE_ENV === 'development') {
				console.log('Redirecting to reauthenticate');
			}
			throw redirect(303, url.toString());
		}
	}
};
