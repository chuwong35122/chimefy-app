import type { MusicSession } from '$lib/interfaces/session/session.interface';
import { pb } from '$lib/pocketbase/pb';
import type { Record } from 'pocketbase';
import { writable } from 'svelte/store';

export interface SessionSearchResult {
	results: (MusicSession & Record)[];
	loading: boolean;
}

export const sessionSearchResult = writable<SessionSearchResult>({
	results: [],
	loading: false
});

// TODO: must have current playing track & multiple listeners
export async function getSessionList(name: string, type: string, page: number) {
	let searchedItems: (MusicSession & Record)[] = [];
	sessionSearchResult.set({
		results: [],
		loading: true
	});
	const searchTerms = ['isPrivate = false'];

	if (name) {
		searchTerms.push(`sessionName = ${name}`);
	}

	if (type) {
		searchTerms.push(`musicType = ${type}`);
	}

	try {
		const lists = await pb
			.collection('sessions')
			.getList<MusicSession & Record>((page - 1) * 20, page * 20, {
				filter: searchTerms.join(' && ')
			});
		searchedItems = lists.items;
		sessionSearchResult.set({
			results: lists.items,
			loading: true
		});
	} catch (e) {
	} finally {
		sessionSearchResult.set({
			results: searchedItems,
			loading: false
		});
	}
}