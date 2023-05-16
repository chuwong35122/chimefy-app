<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$lib/components/modals/SpotifyPremiumInfoModal.svelte';
	import { logout, userStore } from '$lib/supabase/user';
	import { spotifyAccessToken } from '$lib/spotify/spotify';

	export let data;
	$: ({ supabase, session } = data);

	let isSpotifyPremiumModalOpen = false;

	function handleLogout() {
		isSpotifyPremiumModalOpen = false;
		logout();
	}

	onMount(() => {
		supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (session?.user) {
				userStore.set(session.user);
				spotifyAccessToken.set(session?.provider_token ?? '');
				// goto('/session');
			}
		});
	});
</script>

<Modal open={isSpotifyPremiumModalOpen} permanent size="lg" class="modal-glass">
	<SpotifyPremiumInfoModal on:logout={handleLogout} />
</Modal>
<div class="w-screen h-screen overflow-x-hidden bg-dark-900">
	<NavBar />
	<div class="w-full grid place-items-center pt-12">
		<slot />
		<div class="w-80 absolute bottom-10 z-50">
			<Toast />
		</div>
	</div>
</div>
