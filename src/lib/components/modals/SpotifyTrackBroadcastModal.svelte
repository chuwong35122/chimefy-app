<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import PrimaryButton from '../buttons/PrimaryButton.svelte';
	import Icon from '@iconify/svelte';
	import { pb } from '$lib/pocketbase/pb';
	import { currentSession, hasConfirmedBroadcast } from '$lib/session/session';
	import { toastValue } from '$lib/notification/toast';
	import { createEventDispatcher } from 'svelte';
	import { setActiveSpotifyPlayer } from '$lib/spotify/player';
	import { spotifyAccessToken } from '$lib/spotify/spotify';
	import { spotifyPlayerDeviceId } from '$lib/session/session';

	export let open = false;
	const dispatch = createEventDispatcher();

	async function onSessionBroadcast() {
		if (!$currentSession?.id) return;

		try {
			const _currentSession = { ...$currentSession };
			_currentSession.status = 'broadcasting';
			hasConfirmedBroadcast.set(true);

			await setActiveSpotifyPlayer($spotifyPlayerDeviceId, $spotifyAccessToken);
			await pb.collection('sessions').update($currentSession.id, {
				..._currentSession
			});
			dispatch('broadcast');
		} catch (e) {
			toastValue.set({
				type: 'error',
				message: 'Failed to start session broadcast 😢'
			});
		}
	}
</script>

<Modal bind:open size="xs" autoclose class="bg-dark-600">
	<div class="text-center w-80 grid place-items-center">
		<Icon icon="mdi:broadcast" class="w-16 h-16 text-primary-500" />
		<h1 class="text-lg font-normal text-white">Start Session Broadcast?</h1>
		<div class="w-72 mb-4">
			<p class="text-xs text-dark-100 mt-2">
				By pressing this button, you will play the music and all of your music will be sync to every
				session members
			</p>
		</div>
		<button on:click={onSessionBroadcast}>
			<PrimaryButton>
				<div class="px-2">Start Broadcast</div>
			</PrimaryButton>
		</button>
	</div>
</Modal>
