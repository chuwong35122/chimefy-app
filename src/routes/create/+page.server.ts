import { superValidate } from 'sveltekit-superforms/server';
import { CreateSpaceSchema } from '$lib/schemas/session.schema';
import { fail, redirect } from '@sveltejs/kit';

export const load = async () => {
	const form = await superValidate(CreateSpaceSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, CreateSpaceSchema);
		const session = await event.locals.getSession();

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!session || !session?.user) {
			return fail(401, {
				session
			});
		}

		const payload = {
			...form.data,
			name: form.data.name,
			is_private: form.data.is_private,
			type: form.data.type,
			created_by: session?.user?.id,
			queues: [],
			allow_member_queue: form.data.allow_member_queue
		};

		const { data } = await event.locals.supabase.from('space').insert(payload).select().single();

		if (data && data?.id && data?.uuid != null) {
			await event.locals.supabase
				.from('space_member')
				.insert({ members: [], space_uuid: data?.uuid, space_id: data?.id })
				.select();

			throw redirect(302, `/space/${data.uuid}`);
		}

		return { form };
	}
};
