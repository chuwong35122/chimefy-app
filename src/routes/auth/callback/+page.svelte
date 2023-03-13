<script lang="ts">
	import { spotifyToken, spotifyUser } from '$lib/spotify/spotify';
	import type { SpotifyTokenResponse, SpotifyUserProfile } from '$lib/interfaces/spotify/spotify.interface';
	import PrimaryButton from '../../../component/buttons/PrimaryButton.svelte';
	import { goto } from '$app/navigation';
	import { browser } from "$app/environment"

	export let data: { tokens: SpotifyTokenResponse; userProfile: SpotifyUserProfile };

	$: if (data) {
		if(browser) {
			window.localStorage.setItem('tokens', JSON.stringify(data.tokens))
		}
		if (data.tokens) {
			spotifyToken.set(data.tokens);
		}
		if (data.userProfile) {
			spotifyUser.set(data.userProfile);
		}
	}
</script>

<div class="w-100vw grid place-items center">
	{#if $spotifyUser && $spotifyUser?.images[0]}
		<img
			src={$spotifyUser.images[0].url}
			width="300"
			height="300"
			alt="Spotify Profile"
			class="rounded-full"
      draggable="false"
		/>
	{/if}
	<PrimaryButton on:click={() => goto('/auth')} class='mt-4'>Login to AppName</PrimaryButton>
</div>
