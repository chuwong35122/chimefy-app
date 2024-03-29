<script lang="ts">
	import { Button, ButtonGroup, Input, InputAddon, TabItem, Tabs, Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import seo from '$constants/seo';
	import MusicSpace from '$components/space/search/MusicSpace.svelte';
	import SpaceSearchFilter from '$components/space/search/SpaceSearchFilter.svelte';
	import type { MusicSpace as MusicSpaceType } from '$lib/types/space/space.interface.js';
	import { onMount } from 'svelte';
	import { toastValue } from '$stores/notification/toast.js';

	export let data;
	$: ({ supabase, userSpace } = data);

	let input = '';
	let publicSpaces: MusicSpaceType[] = [];

	function handleSetQueryResults(e: CustomEvent<{publicSpaces: MusicSpaceType[]}>) {
		if(e.detail.publicSpaces?.length > 0) {
			publicSpaces = data.publicSpaces;
		}else{
			toastValue.set({type: 'info', message: 'No results found'})
		}
	}

	onMount(() => {
		publicSpaces = data.publicSpaces;
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Join a Space" />
	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.space.title} />
	<meta name="twitter:description" content={seo.space.description} />

	<title>Join a Space</title>
</svelte:head>

<div in:fly={{ y: 10, duration: 200 }} class="rounded-2xl grid place-items-center mt-20">
	<h1 class="text-4xl text-primary-500 font-semibold">Join a Space</h1>
	<div class="my-4" />

	<form method="POST">
		<ButtonGroup size="lg" class="w-full focus:shadow-lg focus:shadow-white">
			<InputAddon class="bg-dark !border-2 !border-r-0 !rounded-l-full border-white">
				<Icon icon="material-symbols:meeting-room-rounded" width={32} height={32} />
			</InputAddon>
			<Input
				name="spaceId"
				required
				bind:value={input}
				placeholder="Space ID"
				defaultClass="w-[180px] md:w-[400px] lg:w-[460px] text-sm md:text-lg lg:text-xl !text-white !border-white border-2 !bg-dark !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] text-white"
			/>
			<Button
				type="submit"
				color="none"
				aria-label="Enter This Space"
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
		<a
			href="create"
			class="text-sm text-dark-200 font-light hover:text-white duration-200 underline underline-offset-2"
			>Create a space</a
		>
	</div>
	<div class="h-60" />
	<div class="w-full animate-in fade-in">
		<Tabs style="underline" contentClass="bg-transparent pt-8">
			{#if publicSpaces.length > 0}
				<TabItem open title="Public Spaces">
						<SpaceSearchFilter {supabase} on:query={handleSetQueryResults} />
						<div
							class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[560px] overflow-y-auto pt-4 px-4"
						>
							{#each publicSpaces as space, i}
								<MusicSpace {space} index={i} isPrivate={space?.is_private} />
							{/each}
						</div>
				</TabItem>
			{/if}
			{#if userSpace?.length > 0}
				<TabItem title="My Spaces">
					<div
						class="grid grid-cols-1 place-items-center md:grid-cols-3 lg:grid-cols-4 gap-4 h-[560px] overflow-y-auto pt-4 px-4"
					>
						{#each userSpace as space, i}
							<MusicSpace {space} index={i} isPrivate={space?.is_private} />
						{/each}
					</div>
				</TabItem>
			{/if}
		</Tabs>
	</div>
</div>
