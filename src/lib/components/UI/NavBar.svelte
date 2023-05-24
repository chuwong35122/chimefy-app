<script lang="ts">
	import { Dropdown, DropdownItem, Spinner } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { SPOTIFY_AUTH_SCOPES } from '$lib/spotify/spotify';
	import { supabase } from '$lib/supabase/supabase';
	import { logout, userStore } from '$lib/supabase/user';
	import NavLink from './NavLink.svelte';

	let isLoading = false;

	async function signInWithSpotify() {
		isLoading = true;
		await supabase.auth.signInWithOAuth({
			provider: 'spotify',
			options: {
				scopes: SPOTIFY_AUTH_SCOPES.join(' ')
			}
		});
		isLoading = false;
	}

	async function handleLogout() {
		isLoading = true;
		await logout();
		isLoading = false
	}
</script>

<div class="w-full px-4 py-4 flex flex-row items-center justify-between">
	<a href="/" class="w-12 h-12 grid place-items-center">
		<div class="flex items-center">
			<img src="/logo/chimefy/logo_dark.svg" alt="Chimefy Logo" class="w-8 h-8" />
			<div class="ml-4 text-lg font-semibold">Chimefy</div>
		</div>
	</a>
	<div class={`w-56 md:w-96 flex flex-row items-center justify-between`}>
		<NavLink
			icon="material-symbols:meeting-room-rounded"
			route="/session"
			routeName="Session"
			isActive={$userStore?.id != null}
		/>
		<NavLink
			icon="material-symbols:radio"
			route="/radio"
			routeName="Radio"
			isActive={$userStore?.id != null}
		/>
		<NavLink icon="mdi:email" route="/contact" routeName="Contact" />
	</div>

	<div>
		{#if $userStore?.id}
			<div class="w-12 h-12">
				{#if $userStore?.user_metadata?.avatar_url}
					<div
						class="relative cursor-pointer bg-dark-300/60 w-12 h-12 rounded-full p-1 hover:bg-dark-300/30 duration-200"
					>
						<img
							id="profile-img"
							src={$userStore?.user_metadata?.avatar_url}
							width="300"
							height="300"
							alt="Spotify Profile"
							class="rounded-full"
							draggable="false"
						/>
						<div class="absolute bottom-0 right-2" />
					</div>
					<Dropdown>
						<div slot="header" class="px-4 py-2">
							<span class="block text-sm text-gray-900 dark:text-white">
								{$userStore?.user_metadata?.name}
							</span>
						</div>
						<DropdownItem>Profile</DropdownItem>
						<DropdownItem>Settings</DropdownItem>
						<DropdownItem on:click={handleLogout}>Logout</DropdownItem>
					</Dropdown>
				{/if}
			</div>
		{:else if isLoading}
			<div class="grid place-items-center">
				<Spinner color="green" />
			</div>
		{:else}
			<button on:click={signInWithSpotify} class="p-2 px-3 hover:scale-105 duration-200">
				<div class="flex flex-row items-center">
					<Icon icon="logos:spotify-icon" width={24} height={24} />
					<p
						class="text-lg font-semibold h-full ml-2 text-gray-200 hover:text-white hidden md:block"
					>
						Login to Spotify
					</p>
					<p class="text-lg font-semibold h-full ml-2 text-gray-200 hover:text-white md:hidden">
						Login
					</p>
				</div>
			</button>
		{/if}
	</div>
</div>
