<script lang="ts">
	import { Dropdown, DropdownItem, Spinner, Toggle } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { SPOTIFY_AUTH_SCOPES } from '$spotify/user';
	import { supabase } from '$lib/supabase/supabase';
	import { userStore } from '$stores/auth/user';
	import NavLink from './NavLink.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { toastValue } from '$stores/notification/toast';
	import { PUBLIC_SUPPORT_URL } from '$env/static/public';
	import { devModeStore } from '$stores/settings';
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null = null
	let url = PUBLIC_SITE_URL;
	let isLoading = false;

	let devModeOn = false;

	function handleChangeDevMode() {
		devModeStore.set(devModeOn);
		localStorage.setItem('dev_mode', devModeOn ? 'true' : 'false');
	}

	onMount(async () => {
		devModeOn = localStorage.getItem('dev_mode') === 'true';

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'spotify',
			options: {
				scopes: SPOTIFY_AUTH_SCOPES.join(' '),
				skipBrowserRedirect: true,
				redirectTo: '/'
			}
		});

		if (data?.url) {
			url = data.url;
		}

		if (error) {
			toastValue.set({ message: error.message, type: 'error' });
		}
	});
</script>

<div class="w-full px-4 mt-1 flex flex-row items-center justify-between">
	<a href="/" aria-label="Chimefy Home" class="grid place-items-center">
		<div class="flex items-center">
			<img src="/logo/chimefy/logo_dark.svg" alt="Chimefy Logo" class="w-8 h-8 " />
			<div class="ml-4 text-lg font-semibold hidden md:block">Chimefy</div>
		</div>
	</a>
	<div class={`flex flex-row items-center justify-between`}>
		<NavLink
			icon="material-symbols:meeting-room-rounded"
			route="/session"
			routeName="Session"
			isActive={$userStore?.id != null}
		/>
		<NavLink icon="mdi:email" route="/contact" routeName="Contact" />
	</div>
	<div>
		{#if $userStore?.id && session}
			<div class="relative z-50">
				<!-- Large Profile -->
				<div class="md:w-[200px]">
					{#if $userStore?.user_metadata?.avatar_url}
						<div class="flex flex-row items-center group/profile cursor-pointer">
							<div
								class="relative z-10 rounded-full p-1 group-hover/profile:text-white bg-white/20 group-hover/profile:scale-105 group-hover/profile:bg-white/30 duration-150"
							>
								<img
									id="profile-img"
									src={$userStore?.user_metadata?.avatar_url}
									alt="Spotify Profile"
									draggable="false"
									class="rounded-full w-[40px] h-[40px]"
								/>
							</div>
							<div
								class="bg-white/20 h-12 rounded-full hidden md:flex flex-row items-center p-1 absolute left-0 group-hover/profile:scale-y-105"
							>
								<p class="font-semibold ml-[50px]">{$userStore?.user_metadata?.name}</p>
								<Icon
									icon="ion:chevron-down-outline"
									class="w-6 h-6 ml-2 text-dark-200 group-hover/profile:text-white group-hover/profile:scale-105 duration-150"
								/>
							</div>
						</div>
						<Dropdown>
							<DropdownItem on:click={() => goto('/profile')} class="hover:mouse-pointer">
								<div class="flex flex-row items-center">
									<Icon icon="material-symbols:person" class="h-4 w-4 mr-2" />
									<p class="text-sm font-medium">View Profile</p>
								</div>
							</DropdownItem>
							<DropdownItem class="hover:mouse-pointer">
								<div class="flex flex-row items-center">
									<Icon icon="ic:outline-code" class="w-6 h-6" />
									<p class="text-sm font-medium mx-1.5 w-[100px]">Dev Mode</p>
									<div class="scale-[0.8]">
										<Toggle
											bind:checked={devModeOn}
											on:change={handleChangeDevMode}
											color="green"
											class="!mx-[-4px]"
										/>
									</div>
								</div>
							</DropdownItem>
							<DropdownItem
								defaultClass="bg-primary-200 hover:bg-primary-400 duration-150 py-2 px-4 text-black"
							>
								<div class="flex flex-row items-center">
									<Icon icon="mdi:gift" class="h-4 w-4 mr-2" />
									<a
										aria-label="Support Chimefy"
										target="_blank"
										rel="noopener noreferrer"
										href={PUBLIC_SUPPORT_URL}
										class="text-sm font-medium">Support Chimefy</a
									>
								</div>
							</DropdownItem>
							<form method="POST" action="/signout?/signout">
								<DropdownItem defaultClass="py-2 px-4">
									<div class="flex flex-row items-center">
										<Icon icon="ion:exit" class="h-4 w-4 mr-2" />
										<p class="text-sm font-medium">Logout</p>
									</div>
								</DropdownItem>
							</form>
						</Dropdown>
					{/if}
				</div>
			</div>
		{:else if isLoading}
			<div class="grid place-items-center">
				<Spinner color="green" />
			</div>
		{:else}
			<!-- Login to Spotify -->
			<div class="hover:scale-105 duration-150">
				<a href={url} aria-label="Login with Spotify" class="px-3">
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
				</a>
			</div>
		{/if}
	</div>
</div>
