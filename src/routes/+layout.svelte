<script lang="ts">
	import '$styles/global.css';
	import NavBar from '$components/UI/NavBar.svelte';
	import Toast from '$components/UI/Toast.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$components/modals/SpotifyPremiumInfoModal.svelte';
	import { userConfigStore } from '$stores/auth/user';
	import { appTokenStore, spotifyUserProfile } from '$stores/spotify/user';
	import {
		fetchSpotifyProfileOrLogout,
		readUserAppConfig,
		setAuthStores
	} from '$utils/user/auth/helper.js';
	import seo from '$constants/seo.js';
	import Footer from '$components/UI/Footer.svelte';

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
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (_session) {
				setAuthStores(_session);

				if (
					!$userConfigStore &&
					(event === 'INITIAL_SESSION' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')
				) {
					await readUserAppConfig(supabase, _session);
					await fetchSpotifyProfileOrLogout(session?.provider_token);
				}
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content={seo.appTitle} />
	<meta name="keywords" content="chimefy, spotify, listen together, sync spotify" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={seo.appTitle} />
	<meta property="og:description" content={seo.appDescription} />
	<meta property="og:url" content={seo.appUrl} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.appTitle} />
	<meta name="twitter:description" content={seo.appDescription} />
	<meta name="twitter:card" content={seo.twitterCard} />

	<title>Welcome to Chimefy</title>
</svelte:head>

<Modal open={isSpotifyPremiumModalOpen} size="lg" class="modal-glass z-50 relative">
	<SpotifyPremiumInfoModal />
</Modal>
<div
	class="min-h-screen bg-black overflow-auto bg-gradient-to-r from-primary-800/20 via-dark-600/50 to-primary-600/20 background-animate"
>
	<NavBar />
	<div class="w-full grid place-items-center">
		<slot />
		<div class="fixed overflow-hidden bottom-8 right-8 z-50">
			<Toast />
		</div>
	</div>
		<Footer />
</div>
