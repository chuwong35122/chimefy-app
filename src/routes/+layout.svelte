<script lang="ts">
	import '$styles/global.css';
	import NavBar from '$components/UI/NavBar.svelte';
	import Toast from '$components/UI/Toast.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$components/modals/SpotifyPremiumInfoModal.svelte';
	import { userConfigStore, userStore } from '$stores/auth/user';
	import { getSpotifyProfile } from '$spotify/user';
	import { appTokenStore, spotifyUserProfile } from '$stores/spotify/user';
	import { createAppConfig } from '$utils/configs/app.js';
	import AuthExpireListener from '$components/auth/AuthExpireListener.svelte';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let isSpotifyPremiumModalOpen = false;

	// Check if user has Spotify premium
	spotifyUserProfile.subscribe((user) => {
		if (user && user?.product !== 'premium' && $appTokenStore?.spotify_access_token) {
			isSpotifyPremiumModalOpen = true;
		}
	});

	// Listen to Supabase's auth state
	// Retrieve Spotify profile if it does not exist
	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (event, _session) => {
			console.log(event);
			console.log(_session);
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (_session) {
				userStore.set(_session?.user);
				appTokenStore.set({
					supabase_access_token: _session?.access_token,
					supabase_refresh_token: _session?.refresh_token,
					spotify_access_token: String(_session?.provider_token),
					spotify_refresh_token: String(_session?.provider_refresh_token),
					since: new Date()
				});

				const configs = await createAppConfig(supabase, _session?.user?.id);
				userConfigStore.set(configs);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	$: async () => {
		if ($appTokenStore) {
			const profile = await getSpotifyProfile($appTokenStore?.spotify_access_token);
			spotifyUserProfile.set(profile);
		}
	};
</script>

<Modal open={isSpotifyPremiumModalOpen} size="lg" class="modal-glass z-50 relative">
	<SpotifyPremiumInfoModal />
</Modal>
<AuthExpireListener {session} />
<div
	class="min-h-screen overflow-x-hidden bg-black bg-gradient-to-r from-primary-800/20 via-dark-600/50 to-primary-600/20 background-animate"
>
	<NavBar />
	<div class="w-full grid place-items-center">
		<slot />
		<div class="fixed overflow-hidden bottom-8 right-8 z-50">
			<Toast />
		</div>
	</div>
</div>
