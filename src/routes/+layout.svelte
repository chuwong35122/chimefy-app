<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$lib/components/modals/SpotifyPremiumInfoModal.svelte';
	import { logout, userStore } from '$lib/supabase/user';
	import {
		setTokenStore,
		spotifyUserProfile,
		spotifyAccessToken,
		refreshSpotifyToken,
		hasRefreshTokenRefreshed
	} from '$lib/spotify/spotify';
	import type { PrivateUser } from 'spotify-types';

	export let data;
	$: ({ supabase, session } = data);

	let timer: NodeJS.Timer;

	let isSpotifyPremiumModalOpen = false;

	spotifyUserProfile.subscribe((user) => {
		if (user && user?.product !== 'premium' && $spotifyAccessToken?.access_token) {
			isSpotifyPremiumModalOpen = true;
		}
	});

	function handleLogout() {
		isSpotifyPremiumModalOpen = false;
		logout();
	}

	// Refresh token once the token is about to expire (10 seconds left).
	spotifyAccessToken.subscribe(async ({ access_token, refresh_token, since }) => {
		clearInterval(timer);
		if (!access_token || !since) return;

		const now = new Date();

		if (Math.abs(since.getTime() - now.getTime()) >= 3590 * 1000 && refresh_token) {
			console.log('Token refreshed!');
			await handleRefreshSession();
		}
	});

	onMount(() => {
		supabase.auth.onAuthStateChange(async (_, _session) => {
			if (!_session) {
				await logout();
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
				spotifyUserProfile.set(profile);
			}
		});

		supabase.auth.startAutoRefresh();
	});

	onDestroy(() => {
		clearInterval(timer);
	});

	// Note: It seems like Spotify only allow refresh token to be used once.
	// That means that if the user already refreshed the token, the user must login again.
	// TODO: create a popup modal to inform about their session is about to expire.
	async function handleRefreshSession() {
		if (!$spotifyAccessToken.refresh_token) return;

		const token = await refreshSpotifyToken($spotifyAccessToken.refresh_token);
		setTokenStore(token.access_token, '');
		hasRefreshTokenRefreshed.set(true);
	}
</script>

<Modal open={isSpotifyPremiumModalOpen} permanent size="lg" class="modal-glass">
	<SpotifyPremiumInfoModal on:logout={handleLogout} />
</Modal>
<div class="w-screen h-screen overflow-x-hidden bg-dark-900">
	<NavBar />
	<div class="w-full grid place-items-center pt-12">
		<slot />
		<div class="w-80 md:w-[460px] absolute bottom-10 z-50">
			<Toast />
		</div>
	</div>
</div>
