<script lang="ts">
	import { logout, pb, user } from '$lib/pocketbase/pb';
	import { Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { redirectToSpotifyAuth, spotifyUser } from '$lib/spotify/spotify';
</script>

<div class="w-full px-4 py-4 flex flex-row items-center justify-between">
	<a href="/" class="w-12 h-12 grid place-items-center">
		<div>Logo</div>
	</a>
	<div class="w-56 md:w-96 flex flex-row items-center justify-between">
		<a
			href="/session"
			class={`flex flex-row items-center p-2 px-3 duration-200 hover:text-white ${
				$page.route.id === '/session'
					? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
					: 'text-gray-400'
			}`}
		>
			<Icon icon="material-symbols:meeting-room-rounded" width={24} height={24} class="mb-1" />
			<p class="text-lg font-semibold h-full duration-200 ml-2 hover:text-white hidden md:block">
				Session
			</p>
		</a>
		<a
			href="/radio"
			class={`flex flex-row items-center p-2 px-3 duration-200 hover:text-white ${
				$page.route.id === '/radio'
					? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
					: 'text-gray-400'
			}`}
		>
			<Icon icon="material-symbols:radio" width={24} height={24} class="mb-1" />
			<p class="text-lg font-semibold h-full duration-200 ml-2 hidden md:block">Radio</p>
		</a>
		<a
			href="/contact"
			class={`flex flex-row items-center p-2 px-3 duration-200 hover:text-white ${
				$page.route.id === '/contact'
					? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
					: 'text-gray-400'
			}`}
		>
			<Icon icon="mdi:email" width={24} height={24} class="mb-1" />
			<p class={`text-lg font-semibold ml-2 hidden md:block`}>Contact</p>
		</a>
	</div>

	<div>
		{#if $spotifyUser?.id}
			<div class="w-12 h-12">
				{#if $spotifyUser && $spotifyUser?.images && $spotifyUser?.images[0]}
					<div
						class="relative cursor-pointer bg-dark-400/60 w-12 h-12 rounded-full p-1 hover:bg-dark-400/30 duration-200"
					>
						<img
							id="profile-img"
							src={$spotifyUser.images[0].url}
							width="300"
							height="300"
							alt="Spotify Profile"
							class="rounded-full"
							draggable="false"
						/>
						<div class="absolute bottom-0 right-2">
							{#if $user?.id}
								<div class="bg-green-500 w-2 h-2 rounded-full" />
							{:else}
								<div class="bg-red-500 w-2 h-2 rounded-full" />
							{/if}
						</div>
					</div>
					<Dropdown>
						<div slot="header" class="px-4 py-2">
							<span class="block text-sm text-gray-900 dark:text-white">
								{$spotifyUser.display_name}
							</span>
						</div>
						<DropdownItem>Profile</DropdownItem>
						<DropdownItem>Settings</DropdownItem>
						<DropdownItem on:click={logout}>Logout</DropdownItem>
					</Dropdown>
				{/if}
			</div>
			<Tooltip placement="left" triggeredBy="[id='profile-img']"
				>{$user?.id ? 'You have log-in to AppName' : 'You have not log-in to Appname'}</Tooltip
			>
		{:else}
			<a href={redirectToSpotifyAuth()} class="p-2 px-3 hover:scale-105 duration-200">
				<div class="flex flex-row items-center">
					<Icon icon="logos:spotify-icon" width={24} height={24} />
					<p class="text-lg font-semibold h-full ml-2 text-gray-200 hover:text-white hidden md:block">
						Login to Spotify
					</p>
					<p class="text-lg font-semibold h-full ml-2 text-gray-200 hover:text-white md:hidden">
						Login
					</p>
				</div>
			</a>
		{/if}
	</div>
</div>
