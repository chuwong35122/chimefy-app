import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_NODE_ENV } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';

const UNPROTECTED_ROUTES = [
	'/',
	'/contact',
	'/auth/spotify',
	'/auth/callback',
	'/auth/refresh',
	'/auth/auth-code-error'
];

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, options);
			},
			remove: (key, options) => {
				event.cookies.delete(key, options);
			}
		}
	});

	Sentry.init({
		dsn: 'https://8fa8ec40d4894af2ae12dbd889430d31@o4505363295961088.ingest.sentry.io/4505363296944128',
		tracesSampleRate: 1
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	const pathname = event.url.pathname;
	const session = await event.locals.getSession();

	if (!session?.user && !UNPROTECTED_ROUTES.includes(pathname)) {
		throw redirect(303, '/');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

const serverErrorHandler: HandleServerError = async ({ error, event }) => {
	const errorPayload = {
		error,
		event
	};

	if (PUBLIC_NODE_ENV === 'production') {
		Sentry.captureException(errorPayload);
	}
};

export const handleError = Sentry.handleErrorWithSentry(serverErrorHandler);
