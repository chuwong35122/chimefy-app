<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { toastValue } from '$stores/notification/toast';
	import { isPlayingStatus, playingDurationMs } from '$stores/player/index';
	import { spaceRoleStore } from '$stores/space/index';

	export let session: Session | null = null;

	let formRef: HTMLFormElement;

	const REFRESH_TIME_THRESHOLD = 30; // seconds
	let countdown = session?.expires_in ?? 30;

	let timer: NodeJS.Timer;

	onMount(() => {
		if (!session) return;

		timer = setInterval(() => {
			countdown--;
			if (countdown <= REFRESH_TIME_THRESHOLD) {
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
	<input type="hidden" name="is_admin" value={$spaceRoleStore} />
	<input type="hidden" name="is_playing" value={$isPlayingStatus} />
	<input type='hidden' name="position_ms" value={$playingDurationMs} />
</form>
