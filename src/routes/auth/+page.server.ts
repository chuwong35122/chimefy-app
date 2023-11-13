import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { updateUserConfig } from '$utils/user/config';
import { SPOTIFY_AUTH_SCOPES } from '$spotify/user';

export const actions: Actions = {
	refresh: async ({ request, locals }) => {
		const data = await request.formData();
		const redirectTo = data.get('redirect_to');
		const userID = data.get('user_id');
		const { supabase } = locals;

		if (!userID?.toString()) {
			throw error(400, 'No user ID provided');
		}

		await updateUserConfig(supabase, userID?.toString(), {
			session_refresh_redirect_url: redirectTo?.toString() ?? '/space'
		});

		// Same code as /auth/spotify/+page.server.ts
		await supabase.auth.signOut();
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
