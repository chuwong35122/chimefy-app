<script lang="ts">
	import { Dropdown, DropdownItem, Spinner } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { SPOTIFY_AUTH_SCOPES } from '$lib/spotify/spotify';
	import { supabase } from '$lib/supabase/supabase';
	import { logout, userStore } from '$lib/supabase/user';
	import NavLink from './NavLink.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isLoading = false;

	async function signInWithSpotify() {
		isLoading = true;
		const { data } = await supabase.auth.signInWithOAuth({
			provider: 'spotify',
			options: {
				scopes: SPOTIFY_AUTH_SCOPES.join(' ')
			}
		});

		if (data) {
			isLoading = false;
		}
	}

	async function handleLogout() {
		isLoading = true;
		await logout();
		isLoading = false;
	}

	onMount(() => {});
</script>

<div class="w-full px-4 py-4 flex flex-row items-center justify-between">
	<a href="/" class="w-12 h-12 grid place-items-center">
		<div class="flex items-center">
			<img src="/logo/chimefy/logo_dark.svg" alt="Chimefy Logo" class="w-8 h-8" />
			<div class="ml-4 text-lg font-semibold hidden md:block">Chimefy</div>
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
			<div class="w-52 relative z-50">
				{#if $userStore?.user_metadata?.avatar_url}
					<div class="flex flex-row items-center group/profile cursor-pointer">
						<div
							class="relative z-10 w-12 rounded-full p-1 group-hover/profile:text-white bg-white/20 group-hover/profile:scale-105 group-hover/profile:bg-white/30 duration-150"
						>
							<img
								id="profile-img"
								src={$userStore?.user_metadata?.avatar_url}
								alt="Spotify Profile"
								draggable="false"
								class="rounded-full w-[40px] h-[40px]"
							/>
						</div>
						<div class="bg-white/20 rounded-full flex flex-row items-center p-1 absolute left-0 h-12">
							<p class="font-semibold ml-16">{$userStore?.user_metadata?.name}</p>
							<Icon
								icon="ion:chevron-down-outline"
								class="w-6 h-6 ml-2 text-dark-200 group-hover/profile:text-white group-hover/profile:scale-105 duration-150"
							/>
						</div>
					</div>
					<Dropdown>
						<DropdownItem on:click={() => goto('/profile')} class="hover:mouse-pointer">Profile</DropdownItem>
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
