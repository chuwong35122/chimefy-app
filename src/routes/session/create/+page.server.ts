import { superValidate } from 'sveltekit-superforms/server';
import { CreateSessionSchema } from '$lib/schema/session.schema';
import { fail } from '@sveltejs/kit';

export const load = async (event) => {
	const form = await superValidate(event, CreateSessionSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, CreateSessionSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		return form;
	}
};
