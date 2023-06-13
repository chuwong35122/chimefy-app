import { superValidate } from 'sveltekit-superforms/server';
import { CreateSessionSchema } from '$lib/schema/session.schema';
import { fail, redirect } from '@sveltejs/kit';
import type { CreateMusicSession } from '$lib/interfaces/session/session.interface.js';
import sha1 from 'sha1';
import type { PostgrestError } from '@supabase/supabase-js';

export const load = async (event) => {
	const form = await superValidate(event, CreateSessionSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, CreateSessionSchema);
		const session = await event.locals.getSession();

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!session || !session?.user) {
			return fail(401, {
				session
			});
		}

		const payload: CreateMusicSession = {
			...form.data,
			name: form.data.name,
			password: form.data.password ? sha1(form.data.password) : null,
			is_private: form.data.is_private,
			type: form.data.type,
			created_by: session?.user?.id,
			queues: null
		};

		try {
			const { data } = await event.locals.supabase.from('session').insert(payload).select();

			if (data && data[0] && data[0]?.id && data[0]?.uuid != null) {
				const queueResponse = await event.locals.supabase
					.from('session_queue')
					.insert({
						queues: [],
						session_id: data[0]?.id,
						session_uuid: data[0]?.uuid
					})
					.select();

				const _queueId = (queueResponse?.data as any)[0].id;
				await event.locals.supabase
					.from('session')
					.update({ queues: _queueId })
					.eq('id', data[0]?.id);
				await event.locals.supabase
					.from('session_member')
					.insert({ members: [], session_uuid: data[0]?.uuid, session_id: data[0]?.id })
					.select();

				throw redirect(303, `/session/${data[0].uuid}`);
			}
		} catch (e) {
			const err = e as PostgrestError;
			return fail(400, {
				error: err
			});
		}
	}
};