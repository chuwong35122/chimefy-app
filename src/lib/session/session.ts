import type {
	MusicSession,
	MusicSessionRole,
	SessionPlayingInfo
} from '$lib/interfaces/session/session.interface';
import { toastValue } from '$lib/notification/toast';
import { pb, user } from '$lib/pocketbase/pb';
import type { ClientResponseError, Record } from 'pocketbase';
import type { PrivateUser } from 'spotify-types';
import { writable } from 'svelte/store';

export const currentSession = writable<MusicSession & Record>();
export const currentSessionPassword = writable('');
export const spotifyPlayerDeviceId = writable('');
export const socketId = writable('');
export const hasConfirmedBroadcast = writable(false);
export const currentSessionRole = writable<MusicSessionRole>('member');

export const playingInfo = writable<SessionPlayingInfo>();

user.subscribe((val) => {
	currentSession.subscribe((session) => {
		if (session && val) {
			const role = checkSessionRole(val?.id, session);
			currentSessionRole.set(role);
		}
	});
});

export function checkSessionRole(
	userId: string | undefined,
	session: MusicSession | undefined
): MusicSessionRole {
	if (!userId || !session) return 'member';
	const member = session?.participants?.find((participant) => participant.userId === userId);
	return member?.role ?? 'member';
}

export async function getSessionData(id: string) {
	if (!id) return;

	try {
		const record = await pb.collection('sessions').getOne<Record & MusicSession>(id);
		if (record) {
			currentSession.set(record);
		}
		return record;
	} catch (e) {
		const err = e as ClientResponseError;
		if (err.status === 404) {
			toastValue.set({ message: 'Session not found.', type: 'error' });
		}
	}
}

export async function addSessionParticipant(
	session: MusicSession & Record,
	userId: string | undefined,
	spotifyUser: PrivateUser | undefined
) {
	if (!userId || !spotifyUser || !spotifyUser?.images) return;

	const _session = { ...session };
	const participant = _session.participants.find((participant) => participant.userId === userId);
	if (!participant) {
		_session.participants.push({
			userId: userId,
			spotifyDisplayedName: spotifyUser?.display_name ?? '',
			role: checkSessionRole(userId, session),
			profileImg: spotifyUser?.images[0]?.url
		});
		await pb.collection('sessions').update(session?.id, _session);
	}
}
