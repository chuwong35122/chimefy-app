<script lang="ts">
	import '../styles/global.css';
	import NavBar from '../component/UI/NavBar.svelte';
	import Toast from '../component/notification/Toast.svelte';
	import { user as userStore } from '$lib/pocketbase/pb';
	import type { Record } from 'pocketbase';
	import { spotifyAccessToken, spotifyUser } from '$lib/spotify/spotify';
	import { toastValue } from '$lib/notification/toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PrivateUser } from 'spotify-types';

	export let data: { user: Record; access_token: string; userProfile: PrivateUser };
	$: if (data) {
		if (data.user) userStore.set(data.user);
		if (data.userProfile) spotifyUser.set(data.userProfile);
		if (data.access_token) spotifyAccessToken.set(data.access_token);
	}

	// $: if (!$userStore && ($spotifyUser || $spotifyAccessToken)) {
	// 	toastValue.set({ message: 'You must login to AppName', type: 'warn' });
	// 	goto('/auth');
	// }

	$: if ($userStore?.id && $spotifyUser?.id) {
		toastValue.set({ message: "You're all set. Appname is ready!", type: 'info' });
	}
</script>

<div class="w-screen h-screen overflow-hidden bg-dark-900">
	<NavBar />
	<div>{JSON.stringify(data)}</div>
	<div class="w-full grid place-items-center pt-12">
		<slot />
		<div class="w-80 absolute bottom-10">
			<Toast />
		</div>
	</div>
</div>
