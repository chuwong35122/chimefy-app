import type { MusicSession } from '$lib/interfaces/session/session.interface';
import { listSessions } from '$lib/session/search';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const data = await listSessions();
	return {
		sessions: data as MusicSession[]
	};
};
