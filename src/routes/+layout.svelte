<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$components/UI/NavBar.svelte';
	import Toast from '$components/UI/Toast.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$components/modals/SpotifyPremiumInfoModal.svelte';
	import { userStore } from '$stores/auth/user';
	import {
		setTokenStore,
		getSpotifyProfile
	} from '$spotify/spotify';
	import PageTransition from '$components/transition/PageTransition.svelte';
	import AuthExpireListener from '$components/listeners/AuthExpireListener.svelte';
	import { page } from '$app/stores';
	import { onSessionDestroyed } from '$utils/session/session';
	import { PUBLIC_NODE_ENV } from '$env/static/public';
	import { spotifyAccessToken, spotifyUserProfile } from '$stores/spotify/user';

	export let data;
	let { supabase, session, pathName } = data;
	$: ({ supabase, session, pathName } = data);

	let timer: NodeJS.Timer;
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
		} = supabase.auth.onAuthStateChange(async (_, _session) => {
			if (!_session) {
				return;
			}

			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			userStore.set(_session.user);
			setTokenStore(_session?.provider_token, _session?.provider_refresh_token);

			if (!$spotifyUserProfile) {
				const profile = await getSpotifyProfile(data?.session?.provider_token);
				spotifyUserProfile.set(profile);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	onDestroy(() => {
		clearInterval(timer);
	});

	page.subscribe((page) => {
		if (page?.route?.id !== '/session/[sessionId]') {
			onSessionDestroyed();
			if (PUBLIC_NODE_ENV === 'developnent') {
				console.log('On session destroyed has been called...');
			}
		}
	});
</script>

<AuthExpireListener />
<Modal open={isSpotifyPremiumModalOpen} permanent size="lg" class="modal-glass z-50 relative">
	<SpotifyPremiumInfoModal />
</Modal>
<div class="w-screen h-screen overflow-x-hidden bg-dark-900">
	<NavBar />
	<div class="w-full grid place-items-center">
		<PageTransition url={pathName}>
			<slot />
		</PageTransition>
		<div class="w-80 md:w-[460px] absolute bottom-10 z-50">
			<Toast />
		</div>
	</div>
</div>
