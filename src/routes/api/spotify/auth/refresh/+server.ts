import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../$types';
import qs from 'querystring';

// Refresh Spotify's Access Token
// Type: AccessToken
export const POST: RequestHandler = async ({ fetch }) => {
	const res = await fetch(`https://accounts.spotify.com/api/token`, {
		body: qs.stringify({ grant_type: 'refresh_token' }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
	return await res.json();
};
