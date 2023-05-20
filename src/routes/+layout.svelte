<script lang="ts">
	import '../styles/global.css';
	import NavBar from '$lib/components/UI/NavBar.svelte';
	import Toast from '$lib/components/notification/Toast.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Modal } from 'flowbite-svelte';
	import SpotifyPremiumInfoModal from '$lib/components/modals/SpotifyPremiumInfoModal.svelte';
	import { logout, userStore } from '$lib/supabase/user';
	import { setTokenStore } from '$lib/spotify/spotify';

	export let data;
	$: ({ supabase, session } = data);

	let now = new Date();
	let timer: NodeJS.Timer;

	let isSpotifyPremiumModalOpen = false;

	function handleLogout() {
		isSpotifyPremiumModalOpen = false;
		logout();
	}

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
			setTokenStore(data?.session?.provider_token, data?.session?.provider_refresh_token);

			timer = setInterval(async () => {
				now = new Date();
				if (session && session.expires_at != null && now.getMilliseconds() >= session?.expires_at) {
					console.log('Refreshing Token!');
					const { data, error } = await supabase.auth.refreshSession();
					if (error) {
						await logout();
					}
					if (data.session) {
						setTokenStore(data?.session?.provider_token, data?.session?.provider_refresh_token);
						userStore.set(data?.user);
					}
				}
			}, 1000);
		});
	});

	onDestroy(() => {
		clearInterval(timer);
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
