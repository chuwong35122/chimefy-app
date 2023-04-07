<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import PrimaryButton from '../buttons/PrimaryButton.svelte';
	import TextField from '../UI/TextField.svelte';
	import { sessionSearchResult } from '$lib/session/search';
	import { pb } from '$lib/pocketbase/pb';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';

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

<Tooltip triggeredBy="[id=search-list-btn]" placement="bottom">Search</Tooltip>
<Tooltip triggeredBy="[id=refresh-btn]" placement="bottom">Refresh this list</Tooltip>
<div class="rounded-xl w-full bg-dark-500 p-4 hover:bg-white/10 duration-200 mt-2 mb-8 relative">
	<div class="flex flex-row justify-between items-center w-full">
		<h3 class="text-lg font-medium">Filter</h3>
		<Icon
			id="info-icon"
			icon="material-symbols:info-rounded"
			class="w-4 h-4 text-dark-100/75 hover:text-dark-50/50 duration-200 mb-1"
		/>
	</div>
	<Tooltip triggeredBy="[id=info-icon]">Private session will not show here</Tooltip>
	<div class="flex sm:flex-col lg:flex-row justify-between items-center gap-4 w-full">
		<TextField
			bind:value={queryInput.sessionName}
			placeholder="Session Name"
			required
			class="w-80 lg:w-64 rounded-md"
			labelClass="text-white"
		/>
		<TextField
			bind:value={queryInput.musicType}
			placeholder="Music Type (Chill/ Hiphop)"
			required
			class="placeholder:text-sm w-80 lg:w-56 rounded-md"
			labelClass="text-white"
		/>
		<button
			on:click|preventDefault={getSessionList}
			id="search-list-btn"
			class="hidden lg:grid place-items-center bg-white hover:bg-white/60 duration-200 rounded-lg p-1 active:scale-105"
		>
			<Icon icon="material-symbols:search" class="w-8 h-8 text-black" />
		</button>

		<PrimaryButton
			class="!w-80 lg:hidden active:scale-105 mr-2 bg-primary-600 hover:bg-primary-400 duration-200 p-2 rounded-full font-regular"
		>
			<button on:click|preventDefault={getSessionList} class='w-full items-center'>Search</button></PrimaryButton
		>
		<PrimaryButton
			class="!w-80 lg:hidden active:scale-105 mr-2 border border-dark-200 bg-transparent hover:bg-white/10"
		>
			<div
				on:mousedown={handleRefreshSessionList}
				class="flex flex-row items-center justify-center"
			>
				<Icon icon="material-symbols:refresh-rounded" class="w-6 h-6" />
				<span>Refresh</span>
			</div>
		</PrimaryButton>
		<button
			on:click={handleRefreshSessionList}
			id="refresh-btn"
			class="hidden lg:grid place-items-center bg-white hover:bg-white/60 duration-200 rounded-lg p-1 active:scale-105"
		>
			<Icon icon="material-symbols:refresh-rounded" class="w-8 h-8 text-black" />
		</button>
	</div>
	<div class="w-full grid place-items-center my-2" />
</div>
