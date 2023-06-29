<script lang="ts">
	import { logout, userStore } from '$lib/supabase/user';
	import Icon from '@iconify/svelte';
	import moment from 'moment';

	let loggedout = false;
	let createdSinsce = moment($userStore?.created_at).format('MMMM Do YYYY, h:mm:ss a');

	async function handleLogout() {
		loggedout = true;
		await logout();
		setTimeout(() => {
			loggedout = false;
		}, 1500);
	}
</script>

<svelte:head>
	<title>My Profile</title>
</svelte:head>

{#if !loggedout}
	<div class="w-[600px] mt-20">
		<div class="flex place-items-end">
			{#if $userStore && $userStore?.user_metadata && $userStore?.user_metadata?.avatar_url}
				<img
					src={$userStore?.user_metadata?.avatar_url}
					alt="My Profile"
					class="w-[260px] h-[260px] rounded-full"
				/>
			{/if}

			<div class="flex flex-col ml-8">
				<p class="text-xl">Hello there,</p>
				<p class="text-3xl font-bold">{$userStore?.user_metadata?.name ?? ''}</p>
				<p class="text-dark-200">Your email: {$userStore?.email ?? ''}</p>
				<p class="text-dark-200">Join sinced: {createdSinsce}</p>

				<button
					on:click={handleLogout}
					class="text-lg bg-white rounded-full p-1.5 w-full text-black flex flex-row items-center justify-center hover:scale-105 duration-150 mt-8"
				>
					<Icon icon="ion:exit" class="w-6 h-6 mr-2" />
					<p>Logout</p>
				</button>

				<button
					on:click={() => console.log('Support Chimefy')}
					class="text-lg text-black bg-primary-500 rounded-full p-1.5 w-full flex flex-row items-center justify-center hover:scale-105 duration-150 mt-4 shadow-md shadow-primary-600/50"
				>
					<Icon icon="mdi:gift" class="w-6 h-6 mr-2" />
					<p>Support Chimefy!</p>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div />
{/if}
