import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SPOTIFY_AUTH_SCOPES } from '$spotify/user';

export const actions: Actions = {
	default: async ({ locals: { supabase } }) => {
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

		throw redirect(301, oauth.data.url);
	}
};
