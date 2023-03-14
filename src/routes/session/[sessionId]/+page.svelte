<script lang="ts">
	import { page } from '$app/stores';
	import type { MusicSession } from '$lib/interfaces/session.interface';
	import { toastValue } from '$lib/notification/toast';
	import { pb } from '$lib/pocketbase/pb';
	import Icon from '@iconify/svelte';
	import { Button, Search, Select, Tooltip } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import { compute_rest_props } from 'svelte/internal';
	import TrackSearchTab from '../../../component/music/TrackSearchTab.svelte';

	// TODO: Store session password and check before entering
	export let data: { session: MusicSession & Record };
	let sessionId = data.session.id;
	let session: MusicSession;

	function onCopySessionId() {
		toastValue.set({ message: "Session's ID copied!", type: 'info' });
		navigator.clipboard.writeText(sessionId);
	}

	onMount(async () => {
		session = data.session;
		pb.collection('sessions').subscribe(data.session.sessionId, async (e) => {
			const _session = await pb.collection('sessions').getOne<MusicSession>(sessionId);
			session = _session;
		});
		// pb.collection('sessions').subscribe(data.sessionId, async(e) => {
		//   console.log(e)
		//   const sessionData = await pb.collection('sessions').getOne(data.sessionId)
		//   console.log(sessionData)
		//   // sessionData = e.record
		// });
	});

	onDestroy(() => {
		console.log('destroying');
		pb.collection('sessions').unsubscribe(sessionId);
	});
</script>

<div class="w-[1000px] h-[600px] p-8 bg-[rgba(255,255,255,0.05)] rounded-xl">
	<Tooltip triggeredBy="[id=copy-id-btn]">Copy Session's ID</Tooltip>
	<div class="flex flex-row justify-between items-emd w-full">
		<Tooltip triggeredBy="[id='isPrivate-icon']"
			>{session?.isPrivate
				? 'This session is a private session'
				: 'This session is a public session'}</Tooltip
		>
<div>
	<div class="flex flex-row items-center">
		<div id="isPrivate-icon" class='cursor-pointer'>
			{#if session?.isPrivate}
				<Icon icon="material-symbols:lock" width="20" height="20" class="text-dark-400 hover:text-dark-300 duration-200" />
			{:else}
				<Icon
					icon="material-symbols:lock-open-rounded"
					width="20"
					height="20"
					class="text-dark-400 hover:text-dark-300 duration-200"
				/>
			{/if}
		</div>
		<h1 class="text-2xl font-medium ml-2 mr-2">{session?.name}</h1>
		<div class="mt-2 bg-dark-300/60 rounded-full hover:bg-dark-300 duration-200 w-12 grid place-items-center cursor-default">
			<span class="font-medium text-xs text-black">{session?.type}</span>
		</div>
	</div>
</div>
		<button id="copy-id-btn" on:click={onCopySessionId} class="hover:scale-[1.1] duration-200">
			<Icon
				icon="material-symbols:content-copy"
				width={30}
				height={30}
				class="text-gray-500 hover:text-gray-300 duration-200"
			/>
		</button>
	</div>
	<div>{JSON.stringify(session)}</div>
	<div class="flex flex-row w-full">
		<TrackSearchTab />
	</div>
</div>
