import type { MusicSession } from '$lib/interfaces/session.interface';
import { pb } from '$lib/pocketbase/pb';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const data = await pb.collection('sessions').getOne(params.sessionId);

	return {
		session: data
	};
};
