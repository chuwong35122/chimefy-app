import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { supabase } from './supabase';
import { goto } from '$app/navigation';
import { SPOTIFY_AUTH_SCOPES } from '$lib/spotify/spotify';

export const userStore = writable<User | null>(null);

export async function reloginAfterTokenRefreshed(redirectTo: URL) {
	const { data } = await supabase.auth.signInWithOAuth({
		provider: 'spotify',
		options: {
			scopes: SPOTIFY_AUTH_SCOPES.join(' '),
			redirectTo: redirectTo.href
		}
	});

	if (data && data?.url) {
		goto(data.url);
	}
}