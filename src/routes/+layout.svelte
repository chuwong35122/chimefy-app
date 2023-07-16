<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$lib/components/modals/SpotifyPremiumInfoModal.svelte';
	import { userStore } from '$lib/supabase/user';
	import {
		setTokenStore,
		spotifyUserProfile,
		spotifyAccessToken,
		getSpotifyProfile
	} from '$lib/spotify/spotify';
	import PageTransition from '$lib/components/transition/PageTransition.svelte';
	import AuthExpireListener from '$lib/components/auth/AuthExpireListener.svelte';
	import { page } from '$app/stores';
	import { onSessionDestroyed } from '$lib/session/session';

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
