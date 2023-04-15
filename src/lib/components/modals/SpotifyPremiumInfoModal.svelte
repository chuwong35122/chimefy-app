<script lang="ts">
	import { spotifyUser } from '$lib/spotify/spotify';
	import { createEventDispatcher } from 'svelte';
	import SecondaryButtonWrapper from '$lib/components/buttons/SecondaryButtonWrapper.svelte';

	const dispatcher = createEventDispatcher();
	function handleLogout() {
		dispatcher('logout');
	}
</script>

<div class="w-full text-white">
	<h1 class="text-xl font-semibold mb-4">Hold Up!</h1>
	<h2 class="text-sm">
		Chimefy only works with <span class="font-semibold text-primary-500"
			>Premium Spotify Account</span
		>!
	</h2>
	<p class="text-sm">
		Your current Spotify plan is: <span class="capitalize font-bold">{$spotifyUser?.product}</span>
	</p>
  <div class='w-full h-4' />
	<p class="text-sm">Please logout and login with a Premium Spotify account.</p>
	<button class='w-full my-4'>
		<SecondaryButtonWrapper>Logout</SecondaryButtonWrapper>
	</button>
		<a href="https://www.spotify.com/us/premium/" class="text-xs underline underline-offset-1"
			>More about Spotify Premium</a
		>
</div>
