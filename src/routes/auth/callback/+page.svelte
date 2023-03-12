<script lang="ts">
	import { spotifyToken, spotifyUser } from '$lib/spotify/spotify';
	import type { SpotifyTokenResponse, SpotifyUserProfile } from '$lib/interfaces/spotify.interface';

	export let data: { tokens: SpotifyTokenResponse; userProfile: SpotifyUserProfile };

	$: if (data) {
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
  <a href="/session" class='p-2 rounded-full bg-primary-500 mt-4 text-lg font-semibold text-center duration-200 hover:scale-105'>Return to Session</a>
</div>
