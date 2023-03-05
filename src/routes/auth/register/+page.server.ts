import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

// Runs a server-side function with form actions
export const actions: Actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		try {
			await locals.pb.collection('users').create(data);
			// await locals.pb.collection('users').requestVerification(data.email);
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			const err = e as ClientResponseError;
			return fail(err.status, { message: err.message, status: err.status });
		}
		throw redirect(303, '/session');
	}
};
