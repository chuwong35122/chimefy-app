<script lang="ts">
	import Icon from '@iconify/svelte';
	import SecondaryButtonWrapper from '$components/buttons/SecondaryButtonWrapper.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { SPOTIFY_AUTH_SCOPES } from '$spotify/user';
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';

	let url = '';
	let hasClicked = false;

	let formButton: HTMLButtonElement;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const { data } = await supabase.auth.signInWithOAuth({
			provider: 'spotify',
			options: {
				scopes: SPOTIFY_AUTH_SCOPES.join(' '),
				skipBrowserRedirect: true,
				redirectTo: $page.url.href
			}
		});

		if (data?.url) {
			url = data.url;
		}
	});

	$: if (formButton && url) {
		formButton.click();
		dispatch('finishReauthenticate');
	}
</script>

<div class="w-96 p-4 text-center">
	<form
		method="POST"
		action="/signout?/reauthenticate"
		use:enhance={({ formData, cancel }) => {
			hasClicked = true;
			if (!url) {
				hasClicked = false;
				cancel();
			}

			formData.append('url', url);

			return async ({ result }) => {
				hasClicked = false;
				applyAction(result);
			};
		}}
	>
		<div class="mb-4">
			<h1 class="text-2xl text-white font-semibold">
				Please re-login to <span class="text-primary">Spotify</span>
			</h1>
		</div>

		<p class="text-white font-semibold mb-2">Your Spotify credential is about to be expired!</p>
		<p class="text-dark-200 text-sm">
			Hang tight! Chimefy is trying to refresh Spotify authentication for you.
		</p>

		<button bind:this={formButton} type="submit" class="w-60 mt-4" aria-label="Signout & Login">
			<SecondaryButtonWrapper
				isLoading={hasClicked}
				class="flex flex-row items-center justify-center p-0 w-full"
			>
				<Icon icon="mdi:location-enter" class="w-8 h-8 text-white mr-2" />
				<p class="text-white">Reauthenticate</p>
			</SecondaryButtonWrapper>
		</button>
	</form>
</div>
