<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let interval: NodeJS.Timeout;
	let timeMs = 0;
	let INTERVAL = 2500;

	onMount(() => {
		interval = setInterval(() => {
			timeMs += 500;
			if (timeMs >= INTERVAL * 4) {
				timeMs = 0;
			}
		}, 500);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

{#if timeMs >= 0 && timeMs <= INTERVAL}
	<div in:fly={{ duration: 600, y: -40 }}>
		<h2 class="ml-4 text-lg md:text-xl mt-4">
			A place where you can sync <a
				aria-label="Spotify music"
				target="_blank"
				rel="noreferrer"
				href="https://www.spotify.com/"
				class="text-primary underline underline-offset-1">Spotify music</a
			> with your friends!
		</h2>
	</div>
{:else if timeMs >= INTERVAL && timeMs <= INTERVAL * 2}
	<div in:fly={{ duration: 600, y: -40 }}>
		<h2 class="ml-4 text-lg md:text-xl mt-4">It's Simple! Just create a space or join one</h2>
	</div>
{:else if timeMs >= INTERVAL * 2 && timeMs <= INTERVAL * 3}
	<div in:fly={{ duration: 600, y: -40 }}>
		<h2 class="ml-4 text-lg md:text-xl mt-4">Add musics that fit the mood</h2>
	</div>
{:else if timeMs >= INTERVAL * 3 && timeMs <= INTERVAL * 4}
	<div in:fly={{ duration: 600, y: -40 }}>
		<h2 class="ml-4 text-lg md:text-xl mt-4">And let Chimefy sync them for you and your friends</h2>
	</div>
{/if}
