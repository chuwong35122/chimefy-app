<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
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
		supabase.auth.onAuthStateChange(async (_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (_session?.provider_token) {
				userStore.set(_session.user);
				spotifyAccessToken.set({
					access_token: _session?.provider_token ?? '',
					refresh_token: _session?.provider_refresh_token ?? ''
				});
			}else{
				// refresh token

				// if not, logout
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
