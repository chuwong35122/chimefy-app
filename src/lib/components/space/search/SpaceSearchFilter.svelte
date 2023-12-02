<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Search, Tooltip } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { SPACE_MUSIC_TYPES } from '$lib/constants/types';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { queryPublicSpaces } from '$utils/space/search';

	export let supabase: SupabaseClient;

	const dispatch = createEventDispatcher();

	export let input = {
		name: '',
		musicType: ''
	};

	async function query() {
		const { name, musicType } = input;

		const spaces = await queryPublicSpaces(supabase, name, musicType);
		dispatch('query', { spaces });
	}

	async function resetFilter() {
		input = {
			name: '',
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
		bind:value={input.name}
		size="md"
		class="flex gap-2 items-center"
		placeholder="Search Session Name"
		defaultClass="w-full focus:border-primary-500 !rounded-full !bg-white/10 !text-white"
	/>
	<button
		id="filter-search-btn"
		on:click={query}
		aria-label="Search"
		class="hover:scale-110 duration-150 place-items-center"
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
<div class="flex flex-row items-center gap-2 w-full flex-wrap justify-center my-4">
	{#each SPACE_MUSIC_TYPES as type}
		<button
			on:click={() => handleChangeMusicType(type)}
			class={`duration-150 hover:scale-105 text-sm bg-glass p-2 px-4 rounded-full ${
				input.musicType === type ? 'text-primary-500 bg-white/20 font-semimedium' : 'text-white'
			}`}
		>
			{type}
		</button>
	{/each}
</div>
