<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Search, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { searchSessionList, listSessions, sessionSearchResult } from '$lib/session/search';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import type { MusicSessionInfo } from '$lib/interfaces/session/session.interface';

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
		let data: MusicSessionInfo[] = [];
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
	// 	const { musicType, sessionName } = input;
	// 	if (type === musicType) {
	// 		input.musicType = '';
	// 	} else {
	// 		input.musicType = type;
	// 	}

	// 	const data = await searchSessionList(sessionName, musicType);
	// 	sessionSearchResult.set({
	// 		results: data,
	// 		loading: false
	// 	});
	// }

	// onMount(async () => {
	// 	const data = await listSessions();
	// 	sessionSearchResult.set({
	// 		results: data,
	// 		loading: false
	// 	});
	// });
	}
</script>

<Tooltip triggeredBy="[id=filter-refresh-btn]" placement="top">Reset Filters!</Tooltip>
<Tooltip triggeredBy="[id=filter-search-btn]" placement="top">Search!</Tooltip>
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
<div class="grid grid-cols-5 gap-2 my-4 w-full flex-wrap justify-center">
	{#each SESSION_MUSIC_TYPES as type}
	<div class='grid place-items-center bg-white/80 rounded-xl p-2'>
		<div class="w-12 h-12 mb-2">
			<img src={type.img} alt={type.name} />
		</div>
		<div class='font-semibold text-black'>{type.name}</div>
	</div>
	<!-- on:click={() => handleSelectMusicType(type.name)} -->
		<!-- <button
			class={`px-2 py-1 rounded-full ${
				type.name === input.musicType ? 'bg-white/50' : 'bg-white/20'
			} duration-200`}>{type.name}</button
		> -->
	{/each}
</div>