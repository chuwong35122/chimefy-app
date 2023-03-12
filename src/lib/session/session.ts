import type { MusicSession } from '$lib/interfaces/session.interface';
import { toastValue } from '$lib/notification/toast';
import { pb } from '$lib/pocketbase/pb';
import type { ClientResponseError, Record } from 'pocketbase';
import { writable } from 'svelte/store';

export const currentSession = writable<Record & MusicSession>();

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
