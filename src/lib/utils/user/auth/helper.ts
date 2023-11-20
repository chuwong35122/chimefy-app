import { goto } from '$app/navigation';
import { userConfigStore, userStore } from '$stores/auth/user';
import { appTokenStore, spotifyUserProfile } from '$stores/spotify/user';
import { createAppConfigIfNotExist } from '$utils/configs/app';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { updateUserConfig } from '../config';
import { getSpotifyProfile } from '$spotify/user';

export function setAuthStores(session: Session) {
	userStore.set(session.user);
	appTokenStore.set({
		supabase_access_token: session?.access_token,
		supabase_refresh_token: session?.refresh_token,
		spotify_access_token: String(session?.provider_token),
		spotify_refresh_token: String(session?.provider_refresh_token),
		since: new Date()
	});
}

export async function readUserAppConfig(supabase: SupabaseClient, session: Session) {
	const configs = await createAppConfigIfNotExist(supabase, session?.user?.id);

	if (configs.session_refresh_redirect_url) {
		goto(configs.session_refresh_redirect_url);
		await updateUserConfig(supabase, session?.user?.id, {
			session_refresh_redirect_url: null
		});
		configs.session_refresh_redirect_url = null;
	}

	userConfigStore.set(configs);
}

export async function fetchSpotifyProfileOrLogout(spotifyAccessToken: string | null | undefined) {
	try {
		const profile = await getSpotifyProfile(spotifyAccessToken);
		spotifyUserProfile.set(profile);
	} catch (e) {
		await fetch('/api/auth/signout', {
			method: 'POST'
		});
	}
}
