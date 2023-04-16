<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '../buttons/PrimaryButtonWrapper.svelte';
	import TextField from '../UI/TextField.svelte';
	import { sessionSearchResult } from '$lib/session/search';
	import { pb } from '$lib/pocketbase/pb';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/session/type';

	export let queryInput = {
		sessionName: '',
		musicType: ''
	};

	async function getSessionList() {
		sessionSearchResult.set({
			results: [],
			loading: true
		});
		const searchTerms = ['isPrivate = false'];

		if (queryInput.sessionName) {
			searchTerms.push(`sessionName = ${queryInput.sessionName}`);
		}

		if (queryInput.musicType) {
			searchTerms.push(`musicType = ${queryInput.musicType}`);
		}

		try {
			const lists = await pb.collection('sessions').getList<MusicSession & Record>(1, 20, {
				filter: searchTerms.join(' && ')
			});

			sessionSearchResult.set({
				results: lists.items,
				loading: true
			});
		} catch (e) {
		} finally {
			sessionSearchResult.set({
				results: $sessionSearchResult.results,
				loading: false
			});
		}
	}

	async function handleSelectMusicType(type: string) {
		queryInput.musicType = type;

			await getSessionList();		
	}

	async function handleRefreshSessionList() {
		queryInput = {
			sessionName: '',
			musicType: ''
		};
		await getSessionList();
	}

	onMount(async () => {
		await getSessionList();
	});
</script>

<Tooltip triggeredBy="[id=search-btn]" placement="top">Search</Tooltip>
<Tooltip triggeredBy="[id=refresh-btn]" placement="top">Refresh List</Tooltip>
<div class="mt-2 mb-8 relative">
	<div class="flex flex-col">
		<div class="flex flex-row justify-between items-center gap-4 w-full">
			<TextField
				bind:value={queryInput.sessionName}
				placeholder="Public Session Name"
				required
				class="rounded-full w-48 md:w-[480px]"
				labelClass="text-white"
			/>
			<button
				on:click|preventDefault={getSessionList}
				id="search-btn"
				class="grid place-items-center hover:bg-white/20 duration-200 rounded-full p-1 border w-[38px] h-[38px]"
			>
				<Icon icon="material-symbols:search" class="w-6 h-6 text-white" />
			</button>

			<button
				on:click={handleRefreshSessionList}
				id="refresh-btn"
				class="grid place-items-center hover:bg-white/20 duration-200 rounded-full p-1 border w-[38px] h-[38px]"
			>
				<Icon icon="material-symbols:refresh-rounded" class="w-6 h-6 text-white" />
			</button>
		</div>
		<!-- Chips -->
		<div class="flex flex-row items-center mt-2 w-[300px] md:w-[588px] overflow-x-auto pb-2">
			{#each SESSION_MUSIC_TYPES as type}
				<button
					on:click={() => handleSelectMusicType(type)}
					class={`px-2 py-1 rounded-full mr-2 ${type === queryInput.musicType ? 'bg-white/50' : 'bg-white/20'} duration-200`}>{type}</button
				>
			{/each}
		</div>
	</div>
	<div class="w-full grid place-items-center my-2" />
</div>
