import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { LoginValidationSchema } from '$lib/schema/auth.schema';
import type { ValidationError } from 'yup';

// Runs a server-side function with form actions
export const actions: Actions = {
	login: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		try {
			await LoginValidationSchema.validate(data, {
				strict: true
			});
		} catch (e) {
			const err = e as ValidationError;
			return fail(404, {
				message: err?.message,
				status: 404
			});
		}

		try {
			const res = await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			const err = e as ClientResponseError;
			return fail(err.status, { message: err.message, status: err.status });
		}
		throw redirect(303, '/session');
	}
};
