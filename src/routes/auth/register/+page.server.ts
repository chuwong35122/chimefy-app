import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { ValidationError } from 'yup';
import { SignupValidationSchema } from '$lib/schema/auth.schema';

// Runs a server-side function with form actions
export const actions: Actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);
		const user = SignupValidationSchema.cast(data);
		try {
			await SignupValidationSchema.validate(user, {
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
			await locals.pb.collection('users').create(data);
			// await locals.pb.collection('users').requestVerification(data.email);
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			const err = e as ClientResponseError;
			if (
				err.status === 400 &&
				err.data.message === 'Failed to create record.' &&
				err.data.data.email
			) {
				return fail(err.status, {
					message: err.data.data.email.message,
					status: err.status
				});
			} else {
				return fail(err.status, {
					message: err.data.message,
					status: err.status
				});
			}
		}
		throw redirect(303, '/session');
	}
};
