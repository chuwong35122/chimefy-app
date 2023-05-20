import type { MusicSessionQueue } from '$lib/interfaces/session/queue.interface';
import type {
	MusicSession,
	MusicSessionRole,
	SessionPlayingInfo
} from '$lib/interfaces/session/session.interface';
import { supabase } from '$lib/supabase/supabase';
import type { PrivateUser } from 'spotify-types';
import { writable } from 'svelte/store';

export const currentSession = writable<MusicSession>();
export const currentSessionQueue = writable<MusicSessionQueue | null>(null);

export const currentSessionPassword = writable('');
export const spotifyPlayerDeviceId = writable('');
export const socketId = writable('');
export const hasConfirmedBroadcast = writable(false);
export const currentSessionRole = writable<MusicSessionRole>('member');

export const playingInfo = writable<SessionPlayingInfo>();

export async function addSessionParticipant(
	session: MusicSession,
	userId: string | undefined,
	spotifyUser: PrivateUser | undefined
) {
	if (!userId || !spotifyUser || !spotifyUser?.images) return;

	// const _session = { ...session };
	// const participant = _session.participants.find((participant) => participant.userId === userId);
	// if (!participant) {
	// 	_session.participants.push({
	// 		userId: userId,
	// 		spotifyDisplayedName: spotifyUser?.display_name ?? '',
	// 		role: checkSessionRole(userId, session),
	// 		profileImg: spotifyUser?.images[0]?.url
	// 	});
	// 	await supabase
	// 		.from('session')
	// 		.update({ participants: _session.participants })
	// 		.eq('uuid', _session.uuid);
	// 	// await pb.collection('sessions').update(session?.id, _session);
	// }
}
