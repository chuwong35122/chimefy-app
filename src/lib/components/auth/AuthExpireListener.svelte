<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { spotifyAccessToken } from '$stores/spotify/user';

	export let session: Session | null = null;

  let formRef: HTMLFormElement

	const SESSION_THRESHOLD = 0; // seconds
	let SESSION_EXPIRE_IN = session?.expires_in ?? 0;

	let timer: NodeJS.Timer;

	onMount(() => {
		if (!session) return;

		timer = setInterval(() => {
			SESSION_EXPIRE_IN -= 1;
      console.log(session?.expires_in, SESSION_EXPIRE_IN)
			if (SESSION_EXPIRE_IN < SESSION_THRESHOLD) {
        formRef.submit()
        clearInterval(timer)
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<form bind:this={formRef} method="POST" action="/auth?/refresh">
	<input type="hidden" name="redirect_to" bind:value={$page.url.pathname} />
	<input type="hidden" name="refresh_token" bind:value={$spotifyAccessToken.refresh_token} />
</form>
