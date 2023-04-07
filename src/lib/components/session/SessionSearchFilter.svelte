<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Search, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {getSessionList} from '$lib/session/search';

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

	$: if(queryInput.sessionName) {
		debounceQueryInput();
	}

	onMount(async () => {
		const { sessionName, musicType } = queryInput;
		await getSessionList(sessionName, musicType, 1);
	});
</script>

<Tooltip triggeredBy="[id=refresh-btn]" placement="top">Refresh this list</Tooltip>

	<form class="w-full flex gap-2">
		<Search bind:value={queryInput.sessionName} size='md' class="flex gap-2 items-center" placeholder="Search Session Name" defaultClass='w-full focus:border-primary-500 !rounded-full'>
			<button id='refresh-btn' type='button' on:click={refreshList} class='rounded-lg hover:scale-105 duration-150'>
				<Icon icon='material-symbols:refresh-rounded' class='w-8 h-8 text-black' />
			</button>
		</Search>
	</form>