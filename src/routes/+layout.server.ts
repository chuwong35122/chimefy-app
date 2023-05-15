import type { AuthTokens } from '$lib/interfaces/spotify/auth.interface';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, fetch, url }) => {
	// const code = url.searchParams.get('code');
	// if (code) {
	// 	const authRes = await fetch(`/api/spotify/auth/token?code=${code ?? ''}`);
	// 	const authTokens = (await authRes.json()) as AuthTokens;

	// 	return {
	// 		user: locals?.user,
	// 		access_token: authTokens.access_token,
	// 		refresh_token: authTokens.refresh_token
	// 	};
	// }

	return {
		// user: locals?.user,
		session: await locals.getSession()
	};
};
