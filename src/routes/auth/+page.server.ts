import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { updateUserConfig } from '$utils/user/config';
import { SPOTIFY_AUTH_SCOPES } from '$spotify/user';
import qs from 'query-string';

export const actions: Actions = {
	refresh: async ({ request, locals }) => {
		const data = await request.formData();
		const redirectTo = data.get('redirect_to');
		const userID = data.get('user_id');
		const isAdmin = data.get('is_admin');
		const isPlaying = data.get('is_playing');
		const positionMs = data.get('position_ms');

		const { supabase } = locals;

		if (!userID?.toString()) {
			throw error(400, 'No user ID provided');
		}

		// Create a URL with query param
		const redirectBaseURL = `${redirectTo}?` ?? '/space';
		const queryString = qs.stringify({
			isAdmin,
			isPlaying,
			positionMs
		});

		await updateUserConfig(supabase, userID?.toString(), {
			session_refresh_redirect_url: redirectBaseURL + queryString
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
