<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { toastValue } from '$stores/notification/toast';

	export let session: Session | null = null;

	let formRef: HTMLFormElement;

	let count = 0;
	const REFRESH_TIME = 3_530; // seconds

	let timer: NodeJS.Timer;

	onMount(() => {
		if (!session) return;

		timer = setInterval(() => {
			count++;
			if (count >= REFRESH_TIME) {
				localStorage.setItem('refresh_session', 'true'); // read in NavBar
				toastValue.set({ type: 'warn', message: 'Refreshing session. Please wait 🔄' });
				formRef.submit();
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<form bind:this={formRef} method="POST" action="/auth?/refresh">
	<input type="hidden" name="redirect_to" value={$page.url.pathname} />
	<input type="hidden" name="user_id" value={session?.user?.id} />
</form>
