<script lang="ts">
	import { userStore } from '$stores/auth/user';
	import { Button, Spinner } from 'flowbite-svelte';
	import { spotifyUserProfile } from '$stores/spotify/user';
</script>

{#if $userStore}
	<div class="w-full text-white">
		<h1 class="text-xl font-semibold mb-4">Hold Up!</h1>
		<h2 class="text-sm">
			Chimefy only works with <span class="font-semibold text-primary-500"
				>Premium Spotify Account</span
			>!
		</h2>
		<p class="text-sm">
			Your current Spotify plan is: <span class="capitalize underline"
				>{$spotifyUserProfile?.product}</span
			>
		</p>
		<div class="w-full h-4" />
		<p class="text-sm">Please logout and login with a Premium Spotify account.</p>
		<form method="POST" action="/signout?/signout">
			<Button color="alternative" pill>Logout</Button>
		</form>
		<a
			target="_blank"
			rel="noreferrer"
			href="https://www.spotify.com/us/premium/"
			class="text-xs underline underline-offset-1">More about Spotify Premium</a
		>
	</div>
{:else}
	<div class="w-40 h-20 grid place-items-center"><Spinner color="green" /></div>
{/if}
