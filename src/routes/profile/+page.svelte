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
    }, 1500)
	}
</script>

<svelte:head>
	<title>My Profile</title>
</svelte:head>

{#if !loggedout}
	<div class="rounded-xl p-6 bg-white/10 flex flex-col items-center w-[500px]">
		{#if $userStore && $userStore?.user_metadata && $userStore?.user_metadata?.avatar_url}
			<img
				src={$userStore?.user_metadata?.avatar_url}
				alt="My Profile"
				class="w-[200px] h-[200px] rounded-full"
			/>
		{/if}

		<div class="my-2" />
		<p class="text-sm">Hello there,</p>
		<p class="text-3xl font-bold">{$userStore?.user_metadata?.name}</p>
		<p class="text-dark-200">What would you like to view?</p>

		<div class="my-4" />

		<div
			class="flex flex-row items-center justify-between w-full bg-black/40 p-2 px-4 my-2 rounded-full"
		>
			<div class="flex items-center">
				<Icon icon="mdi:email" class="w-6 h-6 mr-2" />
				<p class="font-semibold text-lg">Email</p>
			</div>
			<p>{$userStore?.email}</p>
		</div>

		<div
			class="flex flex-row items-center justify-between w-full bg-black/40 p-2 px-4 my-2 rounded-full"
		>
			<div class="flex items-center">
				<Icon icon="mdi:account-plus" class="w-6 h-6 mr-2" />
				<p class="font-semibold text-lg">Created Since</p>
			</div>
			<p>{createdSinsce}</p>
		</div>

    <button
    on:click={handleLogout}
    class="text-lg bg-white rounded-full p-2 w-56 text-black flex flex-row items-center justify-center hover:scale-105 duration-150 mt-8"
  >
    <Icon icon="ion:exit" class="w-6 h-6 mr-2" />
    <p>Logout</p>
  </button>

    <button
    on:click={() => console.log('Support Chimefy')}
    class="text-lg text-black bg-primary-500 rounded-full p-2 w-56 flex flex-row items-center justify-center hover:scale-105 duration-150 mt-4 shadow-md shadow-primary-600/50 ring-2 ring-white"
  >
    <Icon icon="mdi:gift" class="w-6 h-6 mr-2" />
    <p>Support Chimefy!</p>
  </button>


	</div>
{:else}
<div />
{/if}
