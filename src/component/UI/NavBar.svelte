<script lang="ts">
	import { logout, user } from '../../lib/pocketbase/pb';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	const avatarSeed = Math.random() * 10000;
</script>

<div class="w-full px-4 py-4 flex flex-row items-center justify-between">
	<div class="w-12 h-12 grid place-items-center">
		<div>Logo</div>
	</div>

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
			<button>Login</button>
		{/if}
	</div>
</div>
