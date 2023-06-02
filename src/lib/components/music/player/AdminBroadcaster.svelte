<script lang="ts">
	import { currentSession, currentSessionRole, playingInfo } from '$lib/session/session';
	import { supabase } from '$lib/supabase/supabase';
	import { onDestroy, onMount } from 'svelte';

	let timer: NodeJS.Timer;

	onMount(() => {
		if ($currentSession?.id == null || $currentSessionRole !== 'admin') return;

		const channel = supabase.channel(`session_player_listener_${$currentSession?.id}`);
		channel.subscribe((status) => {
			setInterval(() => {
				console.log($playingInfo)
				if (status === 'SUBSCRIBED') {
					channel.send({
						type: 'broadcast',
						event: 'playingInfo',
						payload: structuredClone($playingInfo)
					});
				}
			}, 3000);
		});
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>
