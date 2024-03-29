<script lang="ts">
	import { Dropdown, DropdownItem, Spinner } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { userStore } from '$stores/auth/user';
	import NavLink from './NavLink.svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_SUPPORT_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	let isLoading = false;

	let loginButton: HTMLButtonElement;

	// For auto-refresh Supabase & Spotify session by re-login and auto-redirect to the last page
	onMount(() => {
		if(!window) return
		const refreshed = window.localStorage.getItem('refresh_session');
		if (refreshed) {
			loginButton.click();
			window.localStorage.removeItem('refresh_session');
		}
	});
</script>

<div class="w-full px-4 pt-2 flex flex-row items-center justify-between">
	<a href="/" aria-label="Chimefy Home" class="grid place-items-center">
		<div class="flex items-center">
			<img src="/logo/chimefy/logo_light.svg" alt="Chimefy Logo" class="w-8 h-8" />
			<div class="ml-4 text-lg font-semibold hidden md:block">Chimefy</div>
		</div>
	</a>
	<div class={`flex flex-row items-center justify-between`}>
		<NavLink
			icon="material-symbols:meeting-room-rounded"
			route="/space"
			routeName="Space"
			isActive={$userStore?.id != null}
		/>
		<NavLink icon="mdi:email" route="/contact" routeName="Contact" />
	</div>
	<div>
		{#if $userStore?.id}
			<div class="relative">
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
									class="rounded-full w-10 h-10"
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
									<button class="flex flex-row items-center w-full">
										<Icon icon="ion:exit" class="h-4 w-4 mr-2" />
										<p class="text-sm font-medium">Logout</p>
									</button>
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
			<form method="POST" action="/auth/spotify" class="hover:scale-105 duration-150">
				<button bind:this={loginButton} type="submit" aria-label="Login with Spotify" class="px-3">
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
			</form>
		{/if}
	</div>
</div>
