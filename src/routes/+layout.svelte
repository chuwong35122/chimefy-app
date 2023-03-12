<script lang="ts">
	import '../styles/global.css';
	import NavBar from '../component/UI/NavBar.svelte';
	import Toast from '../component/notification/Toast.svelte';
	import { user as userStore } from '$lib/pocketbase/pb';
	import type { Record } from 'pocketbase';
	import { Modal } from 'flowbite-svelte';
	import { redirectToSpotifyAuth, spotifyToken, spotifyUser } from '$lib/spotify/spotify';

	export let data: { user: Record };
	let showSpotifyLoginModal = false;
	$: if (data) {
		userStore.set(data.user);
	}

	$: if ($userStore && (!$spotifyUser || !$spotifyToken)) {
		showSpotifyLoginModal = true;
	}
</script>

<Modal bind:open={showSpotifyLoginModal} size="md">
	<div class="w-96">
		<h3 class="text-xl font-semibold text-black">You must login to your Spotify!</h3>
		<p class="text-black">Click to login to Spotify</p>
		<div class="grid place-items-center mt-6">
			<a
				href={redirectToSpotifyAuth()}
				class="flex flex-row justify-center items-center hover:opacity-95 hover:scale-105 bg-dark-500 rounded-full duration-200 p-2 w-64"
			>
				<img src="/logo/spotify_green.png" width="200" height="200" alt="Spotify Logo" />
			</a>
		</div>
	</div>
</Modal>
<div class="w-screen h-screen bg-dark-900">
	<NavBar />
	<div class="w-full grid place-items-center pt-12">
		<slot />
		<div class="w-80 absolute bottom-10">
			<Toast />
		</div>
	</div>
</div>
