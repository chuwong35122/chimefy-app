import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { PUBLIC_NODE_ENV } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { error, type Handle, type HandleServerError } from '@sveltejs/kit';

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	Sentry.init({
		dsn: 'https://8fa8ec40d4894af2ae12dbd889430d31@o4505363295961088.ingest.sentry.io/4505363296944128',
		tracesSampleRate: 1
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		return session;
	};

	if (event.url.pathname.startsWith('/session')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(303, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
});

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
