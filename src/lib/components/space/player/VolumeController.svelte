<script lang="ts">
	import type { UserConfigs } from '$lib/types/user/config.interface';
	import { userConfigStore, userStore } from '$stores/auth/user';
	import { toastValue } from '$stores/notification/toast';
	import { updateUserConfig } from '$utils/user/config';
	import Icon from '@iconify/svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let SpotifyPlayer: Spotify.Player;
	export let supabase: SupabaseClient;

	let volume = 50;
	userConfigStore.subscribe((configs: UserConfigs) => {
		if (configs) {
			volume = configs?.player_volume;
		}
	});

	async function setSpotifyPlayerVolume() {
		const userId = $userStore?.id;
		if (!userId) return;
		try {
			await SpotifyPlayer.setVolume(volume / 100);
			await updateUserConfig(supabase, userId, { player_volume: volume });
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
