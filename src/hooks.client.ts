import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

Sentry.init({
  dsn: 'https://8fa8ec40d4894af2ae12dbd889430d31@o4505363295961088.ingest.sentry.io/4505363296944128',
  tracesSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  
  // If you don't want to use Session Replay, just remove the line below:
  integrations: [new Replay()],
});

const clientErrorHandler: HandleClientError = ({ error, event }) => {
	const errorPayload = {
		message: 'Error occurred on the server',
		error,
		event
	};
	Sentry.captureException(errorPayload);

	return errorPayload;
};

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry(clientErrorHandler);
