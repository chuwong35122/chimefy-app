<script lang="ts">
	import { userStore } from '$stores/auth/user';
	import { PUBLIC_SUPPORT_URL } from '$env/static/public';
	import { Button, Card } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const date = new Date(data?.user?.email_confirmed_at ?? '');
</script>

<svelte:head>
	<title>View My Profile</title>
	<meta name="description" content="View my Chimefy profile" />
</svelte:head>

<div class="mt-40">
	<Card class="bg-glass space-y-4 animate-in slide-in-from-top-40 duration-1000">
		<h2 class="text-lg font-bold text-white">Profile Card</h2>
		<div class="flex flex-row gap-4 items-end">
			<div class="animate-in fade-in-0 delay-500 duration-700">
				<img
					alt="profile"
					src={$userStore?.user_metadata?.avatar_url}
					class="w-16 h-16 rounded-full"
				/>
			</div>
			<div>
				<span class="text-sm text-dark-200">Hello there,</span>
				<h5 class="text-lg font-medium text-white">{data.user?.user_metadata?.name}</h5>
			</div>
		</div>
		<div>
			<p class="text-white text-sm leading-tight">
				This is your Chimefy member card. You have been a member since <span
					class="font-medium text-primary">{date.toJSON().slice(0, 10)}</span
				>.
			</p>
		</div>
		<a href={PUBLIC_SUPPORT_URL} target="_blank">
			<Button class="w-fit">Support Chimefy!</Button>
		</a>
	</Card>
</div>
