<script lang="ts">
	import { logout, pb, user } from '../../lib/pocketbase/pb';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { spotifyRedirect } from '$lib/spotify';

	const avatarSeed = Math.random() * 10000;
</script>

<div class="w-full px-4 py-4 flex flex-row items-center justify-between">
	<a href='/' class="w-12 h-12 grid place-items-center">
		<div>Logo</div>
	</a>

	<div class="w-60 flex flex-row items-center justify-between">
		<a href="/session">Session</a>
		<a href="/radio">Radio</a>
		<a href="/contact">Contact Us</a>
	</div>

	<div>
		{#if $user}
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

			<a href='/auth' class='bg-primary-600 p-2 rounded-lg font-semibold text-dark duration-200 hover:bg-primary-500'>Login</a>
		{/if}
	</div>
</div>
