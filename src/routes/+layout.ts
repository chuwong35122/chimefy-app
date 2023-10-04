import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';
import { SPOTIFY_AUTH_SCOPES } from '$spotify/user';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const oauth = await supabase.auth.signInWithOAuth({
		provider: 'spotify',
		options: {
			scopes: SPOTIFY_AUTH_SCOPES.join(' '),
			skipBrowserRedirect: true,
			redirectTo: '/'
		}
	});

	if (oauth.error) {
		throw error(404, oauth.error);
	}

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session, spotifyAuthUrl: oauth.data.url };
};
