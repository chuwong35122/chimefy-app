<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Search, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {getSessionList} from '$lib/session/search';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';

	let timer: NodeJS.Timeout;
	export let queryInput = {
		sessionName: '',
		musicType: ''
	};

	let debouncedQueryInput = {
		sessionName: '',
		musicType: ''
	}

	async function debounceQueryInput() {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			debouncedQueryInput = queryInput;
			const { sessionName, musicType } = debouncedQueryInput;
			await getSessionList(sessionName, musicType, 1);
		}, 500);
	}

	async function refreshList() {
		await getSessionList('', '', 1);
		queryInput = {
			sessionName: '',
			musicType: ''
		}
	}

	async function handleSelectMusicType(type: string) {
		if(type === queryInput.musicType) {
			queryInput.musicType = '';
		}else{
			queryInput.musicType = type;
		}

			await debounceQueryInput();		
	}

	$: if(queryInput.sessionName) {
		debounceQueryInput();
	}

	onMount(async () => {
		const { sessionName, musicType } = queryInput;
		await getSessionList(sessionName, musicType, 1);
	});
</script>

<Tooltip triggeredBy="[id=refresh-btn]" placement="top">Refresh this list</Tooltip>
<div class='w-[300px] md:w-[600px] lg:w-[800px]'>
	<form class="w-full flex gap-2">
		<Search bind:value={queryInput.sessionName} size='md' class="flex gap-2 items-center" placeholder="Search Session Name" defaultClass='w-full focus:border-primary-500 !rounded-full'>
			<button id='refresh-btn' type='button' on:click={refreshList} class='rounded-lg hover:scale-105 duration-150'>
				<Icon icon='material-symbols:refresh-rounded' class='w-8 h-8 text-black' />
			</button>
		</Search>
	</form>
	<!-- Chips -->
	<div class="flex flex-row items-center my-4 w-full flex-wrap gap-2 justify-center">
		{#each SESSION_MUSIC_TYPES as type}
			<button
				on:click={() => handleSelectMusicType(type)}
				class={`px-2 py-1 rounded-full ${type === queryInput.musicType ? 'bg-white/50' : 'bg-white/20'} duration-200`}>{type}</button
			>
		{/each}
	</div>
</div>