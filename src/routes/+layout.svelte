<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import moment from 'moment';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$lib/components/modals/SpotifyPremiumInfoModal.svelte';
	import { reloginAfterTokenRefreshed, userStore } from '$lib/supabase/user';
	import {
		setTokenStore,
		spotifyUserProfile,
		spotifyAccessToken,
		refreshSpotifyToken,
		hasRefreshedToken
	} from '$lib/spotify/spotify';
	import type { PrivateUser } from 'spotify-types';
	import { page } from '$app/stores';
	import PageTransition from '$lib/components/transition/PageTransition.svelte';
	import { PUBLIC_NODE_ENV } from '$env/static/public';

	export let data;
	let { supabase, session, pathName } = data;
	$: ({ supabase, session, pathName } = data);

	let timer: NodeJS.Timer;
	let isSpotifyPremiumModalOpen = false;

	spotifyUserProfile.subscribe((user) => {
		if (user && user?.product !== 'premium' && $spotifyAccessToken?.access_token) {
			isSpotifyPremiumModalOpen = true;
		}
	});

	// Refresh token once the token is about to expire (10 seconds left).
	spotifyAccessToken.subscribe(async ({ access_token, refresh_token, since }) => {
		clearInterval(timer);
		if (!access_token || !since) return;

		const now = moment();
		const sinceMs = moment(since).valueOf();

		const remainingTokenTime = 3_600_000 - (sinceMs - now.valueOf());

		// Ask the user to re-login
		if ($hasRefreshedToken && remainingTokenTime <= 0) {
			await reloginAfterTokenRefreshed($page?.url);
			return;
		} else if ($hasRefreshedToken && remainingTokenTime <= 0) {
			await handleRefreshSession();
		}
	});

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
				const profileRes = await fetch('/api/spotify/profile', {
					method: 'POST',
					body: JSON.stringify({
						access_token: data?.session?.provider_token
					})
				});

				const profile = (await profileRes.json()) as PrivateUser;
				if (PUBLIC_NODE_ENV === 'development') {
					console.log(profile);
				}
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

	// Note: It seems like Spotify only allow refresh token to be used once.
	// That means that if the user already refreshed the token, the user must login again.
	async function handleRefreshSession() {
		if (!$spotifyAccessToken.refresh_token) return;

		const token = await refreshSpotifyToken($spotifyAccessToken.refresh_token);
		setTokenStore(token.access_token, '');
		hasRefreshedToken.set(true);
	}
</script>

<Modal open={isSpotifyPremiumModalOpen} permanent size="lg" class="modal-glass">
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
