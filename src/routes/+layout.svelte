<script lang="ts">
	import '$styles/global.css';
	import NavBar from '$components/UI/NavBar.svelte';
	import Toast from '$components/UI/Toast.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$components/modals/SpotifyPremiumInfoModal.svelte';
	import { userConfigStore, userStore } from '$stores/auth/user';
	import { setTokenStore, getSpotifyProfile } from '$spotify/user';
	import AuthExpireListener from '$components/listeners/AuthExpireListener.svelte';
	import { spotifyAccessToken, spotifyUserProfile } from '$stores/spotify/user';

	export let data;
	let { supabase, session, configs } = data;
	$: ({ supabase, session } = data);

	let isSpotifyPremiumModalOpen = false;

	// Check if user has Spotify premium
	spotifyUserProfile.subscribe((user) => {
		if (user && user?.product !== 'premium' && $spotifyAccessToken?.access_token) {
			isSpotifyPremiumModalOpen = true;
		}
	});

	// Listen to Supabase's auth state
	// Retrieve Spotify profile if it does not exist
	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (_session) {
				userStore.set(_session?.user);
				setTokenStore(_session?.provider_token, _session?.provider_refresh_token);
			}

			userConfigStore.set(configs);
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	$: async () => {
		if ($spotifyAccessToken) {
			const profile = await getSpotifyProfile($spotifyAccessToken?.access_token);
			spotifyUserProfile.set(profile);
		}
	};
	// page.subscribe((page) => {
	// 	if (page?.route?.id !== '/session/[sessionId]') {
	// 		onSessionDestroyed();
	// 		if ($devModeStore) {
	// 			console.log('On session destroyed has been called...');
	// 		}
	// 	}
	// });
</script>

<AuthExpireListener />
<Modal open={isSpotifyPremiumModalOpen} size="lg" class="modal-glass z-50 relative">
	<SpotifyPremiumInfoModal />
</Modal>
<div class="w-screen h-screen overflow-x-hidden bg-dark-900">
	<NavBar />
	<div class="w-full grid place-items-center">
		<slot />
		<div class="w-80 md:w-[460px] absolute bottom-10 z-50">
			<Toast />
		</div>
	</div>
</div>
