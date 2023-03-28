<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase/pb';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import Chip from '../UI/Chip.svelte';
	import Icon from '@iconify/svelte';
	import { Spinner, Tooltip } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Record } from 'pocketbase';
	import TextField from '../UI/TextField.svelte';
	import PrimaryButton from '../buttons/PrimaryButton.svelte';

	let queryInput = {
		sessionName: '',
		musicType: ''
	};

	let sessions: (MusicSession & Record)[] = [];

	async function getSessionList() {
		sessions = [];
		const searchTerms = ['isPrivate = false']

		if(queryInput.sessionName) {
			searchTerms.push(`sessionName = ${queryInput.sessionName}`)
		}

		if(queryInput.musicType) {
			searchTerms.push(`musicType = ${queryInput.musicType}`)
		}

		try {
			const lists = await pb.collection('sessions').getList<MusicSession & Record>(1, 20, {
			filter: searchTerms.join(' && ')
		});

		sessions = lists.items;
		}catch(e) {

		}
	}

	function handleSessionNavigate(session: MusicSession & Record) {
		goto(`/session/${session.id}`);
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

<div class="grid place-items-center mb-4 w-96">
	<h2 class="text-2xl font-semibold">Search for Session</h2>
</div>

<div class="rounded-xl w-full bg-dark-500 p-4 hover:bg-white/10 duration-200 mt-2 mb-8">
	<div class="flex sm:flex-col lg:flex-row justify-between items-center gap-4 w-full">
		<TextField
			bind:value={queryInput.sessionName}
			label="Session Name"
			placeholder="Session Name"
			required
			labelPosition="center"
			class="w-80 lg:w-64"
			labelClass="text-white"
		/>
		<TextField
			bind:value={queryInput.musicType}
			label="Music Type"
			placeholder="Ex. Chill/ Hiphop/ LoFi/ Work"
			required
			labelPosition="center"
			class="placeholder:text-sm w-80 lg:w-56"
			labelClass="text-white"
		/>
		<button
			on:click={handleRefreshSessionList}
			id="search-btn"
			class="hidden lg:grid place-items-center bg-primary hover:bg-primary-600 duration-200 rounded-lg p-1 mb-[-20px] active:scale-105"
		>
			<Icon icon="material-symbols:search" class="w-8 h-8" />
		</button>

		<PrimaryButton on:click={getSessionList} class="!w-80 lg:hidden active:scale-105 mr-2"
			>Search</PrimaryButton
		>
		<PrimaryButton
			class="!w-80 lg:hidden active:scale-105 mr-2 border border-dark-200 bg-transparent hover:bg-white/10"
		>
			<div on:mousedown={handleRefreshSessionList} class="flex flex-row items-center justify-center">
				<Icon icon="material-symbols:refresh-rounded" class="w-6 h-6" />
				<span>Refresh</span>
			</div>
		</PrimaryButton>
		<button
			on:click={handleRefreshSessionList}
			id="refresh-btn"
			class="hidden lg:grid place-items-center bg-primary hover:bg-primary-600 duration-200 rounded-lg p-1 mb-[-20px] active:scale-105"
		>
			<Icon icon="material-symbols:refresh-rounded" class="w-8 h-8" />
		</button>
	</div>
	<div class="w-full grid place-items-center my-2">
		<p class="text-xs text-dark-200 underline underline-offset-1">
			Note: Private session will not show here
		</p>
		<Tooltip triggeredBy="[id=search-btn]" placement="bottom">Search</Tooltip>
		<Tooltip triggeredBy="[id=refresh-btn]" placement="bottom">Refresh this list</Tooltip>
	</div>
</div>

<div class="h-[400px] overflow-y-auto">
	{#if sessions.length > 0}
		<!-- Session Item -->
		{#each sessions as session}
			<div
				on:mouseup={() => handleSessionNavigate(session)}
				class="w-[300px] lg:w-[600px] h-28 p-4 rounded-xl bg-dark-500 hover:bg-dark-400/20 duration-150 my-2 relative hover:cursor-pointer"
			>
				<div class="flex items-center">
					<p class="mr-2">{session?.name}</p>
					<Chip label={session?.type} />
				</div>
				{#if session?.queues && session?.queues[0]}
					<div class="mt-6">
						<p class="font-light text-xs text-dark-200">Now Listening</p>
						<p class="font-light text-xs w-80 text-ellipsis">
							{session?.queues[0]?.trackName} - {session?.queues[0]?.artist}
						</p>
					</div>
				{/if}

				<div class="absolute bottom-2 right-0 z-10">
					<div class="flex h-10">
						<!-- Participant List -->
						{#each session.participants as participant, i}
							<img
								src={participant?.profileImg}
								draggable="false"
								alt={`Participant photo ${i + 1}`}
								class={`w-8 h-8 rounded-full ${i > 0 ? 'ml-[-20px] z-[i+1]' : 'ml-0 z-0'}`}
							/>
						{/each}
					</div>
					<Icon icon="material-symbols:chevron-right-rounded" class="w-12 h-12 text-dark-400" />
				</div>
			</div>
		{/each}
		<!-- Session Item -->
	{:else}
			<div class="w-full rounded-xl p-4 bg-dark-500 grid place-items-center">
				<p class="text-xl text-medium">Sorry! No session found!</p>
				<Icon icon='ri:emotion-sad-line' class='w-16 h-16 my-2' />
				<p class='text-sm text-dark-200'>Tips: Try searching for other things!</p>
			</div>
	{/if}
</div>
