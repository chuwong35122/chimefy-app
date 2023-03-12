<script lang="ts">
	import '../styles/global.css';
	import NavBar from '../component/UI/NavBar.svelte';
	import Toast from '../component/notification/Toast.svelte';
	import { user as userStore } from '$lib/pocketbase/pb';
	import type { Record } from 'pocketbase';
	import { spotifyToken, spotifyUser } from '$lib/spotify/spotify';
	import { toastValue } from '$lib/notification/toast';
	import { goto } from '$app/navigation';
	import { browser } from "$app/environment"

	export let data: { user: Record };
	$: if (data && data.user) {
		userStore.set(data.user);
	}

	$: if (!$userStore && ($spotifyUser || $spotifyToken)) {
		toastValue.set({message: 'You must login to AppName', type: 'warn'})
		if(browser) {
			goto('/auth')
		}
	}

	$: if($userStore?.id && $spotifyUser?.id) {
		toastValue.set({message: "You're all set. Appname is ready!", type: 'info'})
	}
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
