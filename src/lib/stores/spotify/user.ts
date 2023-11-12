import type { PrivateUser } from 'spotify-types';
import { writable } from 'svelte/store';

export const appTokenStore = writable<{
	access_token: string;
	refresh_token: string;
	since: Date | null;
}>({
	access_token: '',
	refresh_token: '',
	since: null
});
export const spotifyPlayerId = writable('');
export const spotifyUserProfile = writable<PrivateUser | null>(null);
