<script lang="ts">
	import { Button, ButtonGroup, Input, InputAddon, TabItem, Tabs, Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import seo from '$constants/seo';
	import MusicSpace from '$components/session/MusicSpace.svelte';
	import SessionSearchFilter from '$components/session/SessionSearchFilter.svelte';
	import type { MusicSessionInfo } from '$interfaces/session/session.interface.js';
	import { onMount } from 'svelte';
	import EmptySearchResultIndicator from '$components/session/EmptySearchResultIndicator.svelte';

	export let data;
	$: ({ supabase, userSpace } = data);

	let input = '';
	let publicSpaces: MusicSessionInfo[] = [];

	onMount(() => {
		publicSpaces = data.publicSpaces;
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Join a Blend Space" />
	<meta
		name="keywords"
		content="chimefy, spotify, listen together, join blend space, create blend space, public blend space, private blend space"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={seo.session.title} />
	<meta
		property="og:description"
		content="Create your own session with unlimited number of members and sync all your Spotify music in real-time"
	/>
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.appUrl} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.session.title} />
	<meta name="twitter:description" content={seo.session.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />

	<title>Join a Space</title>
</svelte:head>

<div in:fly={{ y: 10, duration: 200 }} class="rounded-2xl grid place-items-center mt-20">
	<h1 class="text-4xl text-primary-500 font-semibold">Join a Blend Space</h1>
	<div class="my-4" />

	<form method="POST">
		<ButtonGroup size="lg" class="w-full focus:shadow-lg focus:shadow-white">
			<InputAddon class="bg-dark !border-2 !border-r-0 !rounded-l-full border-white">
				<Icon icon="material-symbols:meeting-room-rounded" width={32} height={32} />
			</InputAddon>
			<Input
				bind:value={input}
				placeholder="Session ID"
				defaultClass="w-[180px] md:w-[400px] lg:w-[460px] text-sm md:text-lg lg:text-xl !text-white !border-white border-2 !bg-dark !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] text-white"
			/>
			<Button
				type="submit"
				color="none"
				aria-label="Enter Session"
				id="search-btn"
				class="bg-dark border-white px-4 border-2 border-l-0 !rounded-r-full duration-200"
			>
				<Icon icon="mdi:location-enter" width={32} height={32} />
			</Button>
			<Tooltip triggeredBy="[id=search-btn]" placement="right">Search</Tooltip>
		</ButtonGroup>
	</form>
	<div class="h-6" />
	<div class="w-full grid place-items-center">
		<button
			on:click={() => goto('/create')}
			class="text-sm text-dark-200 font-light hover:text-white duration-200 underline underline-offset-2"
			>Create new blend space</button
		>
	</div>
	<div class="h-60" />
	<div class="w-full">
		<Tabs style="pill" contentClass="bg-transparent p-4 mb-8">
			<TabItem open title="Public Blend Spaces">
				<SessionSearchFilter {supabase} on:query={(e) => (publicSpaces = e.detail.spaces)} />
				{#if publicSpaces.length > 0}
					<div
						class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto"
					>
						{#each publicSpaces as space, i}
							<MusicSpace {space} index={i} isPrivate={space?.is_private} />
						{/each}
					</div>
				{:else}
				<EmptySearchResultIndicator />
				{/if}
			</TabItem>
			{#if userSpace?.length > 0}
				<TabItem title="My Blend Spaces">
					<div
						class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto"
					>
						{#each userSpace as space, i}
							<MusicSpace {space} index={i} isPrivate={space?.is_private} />
						{/each}
					</div>
				</TabItem>
			{:else}
				<EmptySearchResultIndicator />
			{/if}
		</Tabs>
	</div>
</div>
