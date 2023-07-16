<script lang="ts">
	import {
		spotifyAccessToken,
		hasRefreshedToken,
		refreshSpotifyToken,
		setTokenStore
	} from '$lib/spotify/spotify';
	import { onDestroy } from 'svelte';
	import ReauthenticatePromptModal from '../modals/ReauthenticatePromptModal.svelte';
	import { Modal } from 'flowbite-svelte';

	let timer: NodeJS.Timer;
	const TIMER_INTERVAL = 500;

	let remainingTokenTime = 0;

	let showReauthenticateModal = false;

	function closeModal() {
		showReauthenticateModal = false;
		hasRefreshedToken.set(false);
	}

	// Create a countdown timer to the moment token expires
	spotifyAccessToken.subscribe(async ({ access_token, since }) => {
		if (!access_token || !since) return;

		timer = setInterval(async () => {
			const now = new Date().getTime();
			const timeDiff = now - since.getTime();

			remainingTokenTime = 3_600_000 - timeDiff;

			if ($hasRefreshedToken) {
				// show modal asking to re-authenticate
				showReauthenticateModal = true;
			} else {
				// refresh token if remaining time <= 15 seconds
				if (remainingTokenTime <= 15_000) {
					const token = await refreshSpotifyToken($spotifyAccessToken.refresh_token);
					setTokenStore(token.access_token, '');
					hasRefreshedToken.set(true);
				}
			}
		}, TIMER_INTERVAL);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<Modal bind:open={showReauthenticateModal} permanent class="modal-glass z-50 relative">
	<ReauthenticatePromptModal on:finishReauthenticate={closeModal} />
</Modal>
