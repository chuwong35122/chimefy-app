import type { AuthTokens } from '$lib/interfaces/spotify/auth.interface';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, fetch, url }) => {
	const _access_token = cookies.get('access_token');
	if (!_access_token) {
		const code = url.searchParams.get('code') ?? '';
		const tokenRes = await fetch(`/api/spotify/auth/token?code=${code}`);
		const authTokens = (await tokenRes.json()) as AuthTokens;
		cookies.set('access_token', authTokens.access_token, { path: '/' });
		cookies.set('refresh_token', authTokens.refresh_token, { path: '/' });
	}
	const access_token = cookies.get('access_token');
	const userProfileRes = await fetch('/api/spotify/profile', {
		method: 'POST',
		body: JSON.stringify({ access_token })
	});
	const userProfile = await userProfileRes.json();
	return {
		userProfile: userProfile,
		user: locals?.user,
		authTokens: access_token
	};
};
