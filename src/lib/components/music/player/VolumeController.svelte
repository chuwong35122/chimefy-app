<script lang="ts">
	import { PUBLIC_NODE_ENV } from '$env/static/public';
	import DebugBgWrapper from '$lib/components/UI/DebugBgWrapper.svelte';
	import { toastValue } from '$lib/notification/toast';
	import Icon from '@iconify/svelte';

	export let SpotifyPlayer: Spotify.Player;

	let volume = 50;

	async function setSpotifyPlayerVolume() {
		try {
			await SpotifyPlayer.setVolume(volume / 100);
		} catch (e) {
			console.log(e);
		} finally {
			toastValue.set({ message: 'Volume set ✅', type: 'info' });
		}
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
			on:mouseup={setSpotifyPlayerVolume}
			type="range"
			id="volume-sider"
			class="accent-white w-16 md:w-24"
		/>
	</div>
</div>
{#if PUBLIC_NODE_ENV === 'development'}
	<DebugBgWrapper>
		<p>Volume: {volume}</p>
	</DebugBgWrapper>
{/if}
