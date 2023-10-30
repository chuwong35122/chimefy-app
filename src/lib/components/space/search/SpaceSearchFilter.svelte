<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Search, Tooltip } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { queryPublicSpaces } from '$utils/session/search';

	export let supabase: SupabaseClient;

	const dispatch = createEventDispatcher();

	export let input = {
		sessionName: '',
		musicType: ''
	};

	async function query() {
		const { sessionName, musicType } = input;

		const spaces = await queryPublicSpaces(supabase, sessionName, musicType);
		dispatch('query', { spaces });
	}

	async function resetFilter() {
		input = {
			sessionName: '',
			musicType: ''
		};

		await query();
	}

	async function handleChangeMusicType(type: string) {
		{
			input.musicType = type;
			await query();
		}
	}
</script>

<Tooltip triggeredBy="[id=filter-refresh-btn]" placement="top">Reset Filters!</Tooltip>
<Tooltip triggeredBy="[id=filter-search-btn]" placement="top">Search!</Tooltip>
<form class="flex gap-2">
	<Search
		bind:value={input.sessionName}
		size="md"
		class="flex gap-2 items-center"
		placeholder="Search Session Name"
		defaultClass="w-full focus:border-primary-500 !rounded-full"
	/>
	<button
		id="filter-search-btn"
		on:click={query}
		aria-label="Search"
		class="hover:scale-110 duration-150"
	>
		<Icon icon="material-symbols:manage-search-rounded" class="w-8 h-8 text-white" />
	</button>
	<button
		id="filter-refresh-btn"
		aria-label="Reset Filters"
		type="button"
		on:click={resetFilter}
		class="rounded-lg hover:scale-105 duration-150"
	>
		<Icon icon="material-symbols:refresh-rounded" class="w-8 h-8 text-white" />
	</button>
</form>
<!-- Chips -->
<div class="flex flex-rows items-center gap-2 mt-4 ml-2">
	<p class="font-semibold text-md">Type</p>
	<div class="flex flex-row items-center gap-6 w-full flex-wrap justify-center">
		{#each SESSION_MUSIC_TYPES as type}
			<button
				on:click={() => handleChangeMusicType(type)}
				class={`cursor-pointer duration-150 hover:scale-105 text-sm underline underline-offset-2 ${
					input.musicType === type ? 'text-primary-500' : 'text-white'
				}`}
			>
				{type}
			</button>
		{/each}
	</div>
</div>
<div class='my-4 w-full bg-dark-400 h-[1px]' />
