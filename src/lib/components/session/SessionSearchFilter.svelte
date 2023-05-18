<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Search, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { searchSessionList, listSessions, sessionSearchResult } from '$lib/session/search';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';

	export let input = {
		sessionName: '',
		musicType: ''
	};

	async function query() {
		sessionSearchResult.set({
			results: [],
			loading: true
		});

		const { sessionName, musicType } = input;
		let data: MusicSession[] = [];
		if (!sessionName && !musicType) {
			data = await listSessions();
		} else {
			data = await searchSessionList(sessionName, musicType);
		}
		sessionSearchResult.set({
			results: data,
			loading: false
		});
	}

	async function resetFilter() {
		input = {
			sessionName: '',
			musicType: ''
		};

		await query();
	}

	async function handleSelectMusicType(type: string) {
		const { musicType, sessionName } = input;
		if (type === musicType) {
			input.musicType = '';
		} else {
			input.musicType = type;
		}

		const data = await searchSessionList(sessionName, musicType);
		sessionSearchResult.set({
			results: data,
			loading: false
		});
	}

	onMount(async () => {
		const data = await listSessions();
		sessionSearchResult.set({
			results: data,
			loading: false
		});
	});
</script>

<Tooltip triggeredBy="[id=filter-refresh-btn]" placement="top">Reset Filters!</Tooltip>
<Tooltip triggeredBy="[id=filter-search-btn]" placement="top">Search!</Tooltip>
<div class="w-[300px] md:w-[600px] lg:w-[800px]">
	<form class="w-full flex gap-2">
		<Search
			bind:value={input.sessionName}
			size="md"
			class="flex gap-2 items-center"
			placeholder="Search Session Name"
			defaultClass="w-full focus:border-primary-500 !rounded-full"
		/>
		<button id="filter-search-btn" on:click={query} class="hover:scale-110 duration-150">
			<Icon icon="material-symbols:manage-search-rounded" class="w-8 h-8 text-white" />
		</button>
		<button
			id="filter-refresh-btn"
			type="button"
			on:click={resetFilter}
			class="rounded-lg hover:scale-105 duration-150"
		>
			<Icon icon="material-symbols:refresh-rounded" class="w-8 h-8 text-white" />
		</button>
	</form>
	<!-- Chips -->
	<div class="flex flex-row items-center my-4 w-full flex-wrap gap-2 justify-center">
		{#each SESSION_MUSIC_TYPES as type}
			<button
				on:click={() => handleSelectMusicType(type)}
				class={`px-2 py-1 rounded-full ${
					type === input.musicType ? 'bg-white/50' : 'bg-white/20'
				} duration-200`}>{type}</button
			>
		{/each}
	</div>
</div>
