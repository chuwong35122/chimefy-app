import { superValidate } from 'sveltekit-superforms/server';
import { CreateSessionSchema } from '$lib/schemas/session.schema';
import { fail, redirect } from '@sveltejs/kit';
import type { CreateMusicSession } from '$lib/types/session/session.interface.js';

export const load = async () => {
	const form = await superValidate(CreateSessionSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, CreateSessionSchema);
		const session = await event.locals.getSession();

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!session || !session?.user) {
			return fail(401, {
				session
			});
		}

		const payload: CreateMusicSession = {
			...form.data,
			name: form.data.name,
			is_private: form.data.is_private,
			type: form.data.type,
			created_by: session?.user?.id,
			queues: []
		};

		const { data } = await event.locals.supabase.from('session').insert(payload).select().single();

		if (data && data?.id && data?.uuid != null) {
			await event.locals.supabase
				.from('session_member')
				.insert({ members: [], session_uuid: data?.uuid, session_id: data?.id })
				.select();

			throw redirect(302, `/session/${data.uuid}`);
		}

		return { form };
	}
};
