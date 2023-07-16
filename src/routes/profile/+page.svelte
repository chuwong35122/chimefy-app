<script lang="ts">
	import { userStore } from '$lib/supabase/user';
	import Icon from '@iconify/svelte';
	import { PUBLIC_SUPPORT_URL } from '$env/static/public';

	let loggedout = false;
	let createdSince = '';

	userStore.subscribe((user) => {
		if (user) {
			createdSince = new Date(user.created_at).toDateString();
		}
	});
</script>

<svelte:head>
	<title>My Profile</title>
	<meta charset="UTF-8" />
	<meta name="description" content="View my Chimefy profile" />
	<meta name="keywords" content="chimefy, spotify, listen together, sync spotify, view profile" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Welcome to Chimefy</title>
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
				<p class="text-dark-200">Join sinced: {createdSince}</p>

				<form method="POST" action="/signout?/signout">
					<button
						class="text-lg bg-white rounded-full p-1.5 w-full text-black flex flex-row items-center justify-center hover:scale-105 duration-150 mt-8"
					>
						<Icon icon="ion:exit" class="w-6 h-6 mr-2" />
						<p>Logout</p>
					</button>
				</form>

				<button
					class="text-lg text-black bg-primary-500 rounded-full p-1.5 w-full flex flex-row items-center justify-center hover:scale-105 duration-150 mt-4 shadow-md shadow-primary-600/50"
				>
					<Icon icon="mdi:gift" class="w-6 h-6 mr-2" />
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={PUBLIC_SUPPORT_URL}
						aria-label="Support Chimefy">Support Chimefy!</a
					>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div />
{/if}
