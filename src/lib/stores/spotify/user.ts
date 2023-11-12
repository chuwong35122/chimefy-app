import type { PrivateUser } from 'spotify-types';
import { writable } from 'svelte/store';

interface AppTokenStore {
	supabase_access_token: string;
	supabase_refresh_token: string;
	spotify_access_token: string;
	spotify_refresh_token: string;
	since: Date | null;
}

export const appTokenStore = writable<AppTokenStore>({
	supabase_access_token: '',
	supabase_refresh_token: '',
	spotify_access_token: '',
	spotify_refresh_token: '',
	since: null
});
export const spotifyPlayerId = writable('');
export const spotifyUserProfile = writable<PrivateUser | null>(null);
