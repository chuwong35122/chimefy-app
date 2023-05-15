import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { spotifyUser } from '$lib/spotify/spotify';
import { browser } from '$app/environment';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function logout() {
	await supabase.auth.signOut();
	spotifyUser.set(undefined);
	if (browser) {
		window.localStorage.clear();
	}
}
