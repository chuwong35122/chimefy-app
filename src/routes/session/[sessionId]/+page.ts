import type { MusicSession } from '$lib/interfaces/session/session.interface';
import { pb } from '$lib/pocketbase/pb';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	try {
		const data = await pb.collection('sessions').getOne<MusicSession>(params.sessionId);
		return {
			session: data
		};
	} catch (e) {
		throw error(404, {
			message: 'Session not found.'
		});
	}
};
