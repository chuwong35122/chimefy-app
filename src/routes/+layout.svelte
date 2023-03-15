<script lang="ts">
	import '../styles/global.css';
	import NavBar from '../component/UI/NavBar.svelte';
	import Toast from '../component/notification/Toast.svelte';
	import { user as userStore } from '$lib/pocketbase/pb';
	import type { Record } from 'pocketbase';
	import { spotifyAccessToken, spotifyRefreshToken, spotifyUser } from '$lib/spotify/spotify';
	import { toastValue } from '$lib/notification/toast';
	import type { PrivateUser } from 'spotify-types';
	import { onMount } from 'svelte';
	import type { AuthTokens } from '$lib/interfaces/spotify/auth.interface';
	import { goto } from '$app/navigation';

	export let data: {
		user: Record;
		access_token: string | undefined;
		refresh_token: string | undefined;
	};
	$: if (data) {
		if (data.access_token) spotifyAccessToken.set(data.access_token);
		if (data.refresh_token) spotifyRefreshToken.set(data.refresh_token);
		if (data.user) userStore.set(data.user);
	}

	$: if ($userStore?.id && $spotifyUser?.id) {
		toastValue.set({ message: "You're all set. Appname is ready!", type: 'info' });
	}

	onMount(async () => {
		if (!data.user) {
			goto('/auth');
			toastValue.set({ message: 'Please login to AppName', type: 'info' });
		}
		// Refresh Token
		if ($spotifyRefreshToken) {
			window.localStorage.setItem('refresh_token', $spotifyRefreshToken);
		} else {
			const storedRefreshToken = window.localStorage.getItem('refresh_token');
			const refreshRes = await fetch('/api/spotify/auth/refresh', {
				method: 'POST',
				body: JSON.stringify({ refresh_token: storedRefreshToken ?? '' })
			});
			const authTokens = (await refreshRes.json()) as AuthTokens;
			spotifyAccessToken.set(authTokens.access_token);
			spotifyRefreshToken.set(authTokens.refresh_token);
			if (authTokens.refresh_token) {
				window.localStorage.setItem('refresh_token', authTokens.refresh_token);
			}
		}

		// Retrieve Spotify user profile
		try{
			const profileRes = await fetch('/api/spotify/profile', {
			method: 'POST',
			body: JSON.stringify({ access_token: $spotifyAccessToken })
		});
		const profile = (await profileRes.json()) as PrivateUser;
		spotifyUser.set(profile);
		}catch(e){
			toastValue.set({message: 'Cannot retrieve your Spotify profile', type: 'error'})
		}
	});
</script>

<div class="w-screen h-screen overflow-hidden bg-dark-900">
	<NavBar />
	<div class="w-full grid place-items-center pt-12">
		<slot />
		<div class="w-80 absolute bottom-10">
			<Toast />
		</div>
	</div>
</div>
