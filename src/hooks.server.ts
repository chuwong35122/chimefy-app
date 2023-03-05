import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_API_URL } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

// Server hook runs every time the SvelteKit server recieves the requires
// It recieves event object and resolve it using resolve function
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_API_URL);

	// load the store data from the request cookie string
	// event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

	return response;
};
