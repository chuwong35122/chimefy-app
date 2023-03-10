<script lang="ts">
	import { logout, user } from '$lib/pocketbase/pb';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	const avatarSeed = 1;
</script>

<div class="w-full px-4 py-4 flex flex-row items-center justify-between">
	<a href="/" class="w-12 h-12 grid place-items-center">
		<div>Logo</div>
	</a>
	<div class="w-80 flex flex-row items-center justify-between">

		<a href='/session'
			class={`flex flex-row items-center p-2 px-3 duration-200 hover:text-white ${
				$page.route.id === '/session'
					? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
					: 'text-gray-400'
			}`}
		>
			<Icon icon="material-symbols:meeting-room-rounded" width={24} height={24} class="mb-1" />
			<p class="text-lg font-semibold h-full duration-200 ml-2 hover:text-white">Session</p>
		</a>
		<a href='/radio'
			class={`flex flex-row items-center p-2 px-3 duration-200 hover:text-white ${
				$page.route.id === '/radio'
					? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
					: 'text-gray-400'
			}`}
		>
			<Icon icon="material-symbols:radio" width={24} height={24} class="mb-1" />
			<p class="text-lg font-semibold h-full duration-200 ml-2">Radio</p>
		</a>
		<a href='/contact'
			class={`flex flex-row items-center p-2 px-3 duration-200 hover:text-white ${
				$page.route.id === '/contact'
					? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
					: 'text-gray-400'
			}`}
		>
			<Icon icon="mdi:email" width={24} height={24} class="mb-1" />
			<p class={`text-lg font-semibold ml-2`}>Contact</p>
		</a>
	</div>

	<div>
		{#if $user?.id}
			<div class="w-12 h-12">
				<img
					src={`https://api.dicebear.com/5.x/thumbs/svg?seed=${avatarSeed}`}
					width="60"
					height="60"
					alt="Current avatar"
					class="rounded-full object-contain cursor-pointer"
				/>
			</div>
			<Dropdown>
				<div slot="header" class="px-4 py-2">
					<span class="block text-sm text-gray-900 dark:text-white"> {$user?.displayedName} </span>
				</div>
				<DropdownItem>Profile</DropdownItem>
				<DropdownItem>Settings</DropdownItem>
				<DropdownItem on:click={logout}>Logout</DropdownItem>
			</Dropdown>
		{:else}
			<a
				href="/auth"
				class="bg-primary-600 p-2 rounded-lg font-semibold text-dark duration-200 hover:bg-primary-500"
				>Login</a
			>
		{/if}
	</div>
</div>
