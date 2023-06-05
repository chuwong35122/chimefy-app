<script lang="ts">
	import Icon from '@iconify/svelte';

	export let volume = 50;
	export let debouncedVolume = 0;
	export let SpotifyPlayer: Spotify.Player;

	let debounceVolumeTimer: NodeJS.Timer;

	async function debounceSetVolume() {
		clearTimeout(debounceVolumeTimer);
		debounceVolumeTimer = setTimeout(async () => {
			debouncedVolume = volume / 100;
			await SpotifyPlayer.setVolume(debouncedVolume);
		}, 300);
	}
</script>

<div class="flex flex-row items-center">
	{#if volume === 0}
		<Icon icon="material-symbols:volume-mute-rounded" class="w-6 h-6" />
	{:else if volume > 0 && volume < 60}
		<Icon icon="material-symbols:volume-down-rounded" class="w-6 h-6" />
	{:else if volume >= 60}
		<Icon icon="material-symbols:volume-up-rounded" class="w-6 h-6" />
	{/if}
	<div class="flex flex-col items-center justify-around">
		<input
			bind:value={volume}
			on:keyup={debounceSetVolume}
			type="range"
			id="volume-sider"
			class="accent-white w-16 md:w-24"
		/>
	</div>
</div>
