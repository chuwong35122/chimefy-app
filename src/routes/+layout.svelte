<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import type { Record } from 'pocketbase';
	import { spotifyAccessToken, spotifyRefreshToken, spotifyUser } from '$lib/spotify/spotify';
	import { toastValue } from '$lib/notification/toast';
	import type { PrivateUser } from 'spotify-types';
	import { onMount } from 'svelte';
	import type { AuthTokens } from '$lib/interfaces/spotify/auth.interface';
	import { goto, invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$lib/components/modals/SpotifyPremiumInfoModal.svelte';
	import { logout, userStore } from '$lib/supabase/user';

	let isSpotifyPremiumModalOpen = false;

	function handleLogout() {
		isSpotifyPremiumModalOpen = false;
		logout();
	}

	onMount(() => {
		supabase.auth.onAuthStateChange((_, session) => {
			if (session?.user) userStore.set(session.user);
		});
	});

	// onMount(async () => {
	// 	if (!data.user) {
	// 		goto('/auth');
	// 		toastValue.set({ message: 'Please login to AppName', type: 'info' });
	// 	}
	// 	// Refresh Token
	// 	if ($spotifyRefreshToken) {
	// 		window.localStorage.setItem('refresh_token', $spotifyRefreshToken);
	// 	} else {
	// 		const storedRefreshToken = window.localStorage.getItem('refresh_token');
	// 		const refreshRes = await fetch('/api/spotify/auth/refresh', {
	// 			method: 'POST',
	// 			body: JSON.stringify({ refresh_token: storedRefreshToken ?? '' })
	// 		});
	// 		const authTokens = (await refreshRes.json()) as AuthTokens;
	// 		spotifyAccessToken.set(authTokens.access_token);
	// 		spotifyRefreshToken.set(authTokens.refresh_token);
	// 		if (authTokens.refresh_token) {
	// 			window.localStorage.setItem('refresh_token', authTokens.refresh_token);
	// 		}
	// 	}

	// 	// Retrieve Spotify user profile
	// 	try {
	// 		const profileRes = await fetch('/api/spotify/profile', {
	// 			method: 'POST',
	// 			body: JSON.stringify({ access_token: $spotifyAccessToken })
	// 		});
	// 		const profile = (await profileRes.json()) as PrivateUser;
	// 		spotifyUser.set(profile);
	// 	} catch (e) {
	// 		toastValue.set({ message: 'Cannot retrieve your Spotify profile', type: 'error' });
	// 	}
	// });

	export let data;
	$: ({ supabase, session } = data);
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
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
