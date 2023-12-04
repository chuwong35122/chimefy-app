<script lang="ts">
	import { playingInfo } from '$stores/player';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import type { MusicQueue } from '$lib/types/space/queue.interface';
	import { fade, fly } from 'svelte/transition';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore } from '$stores/space';
	import { Badge, Dropdown, DropdownItem } from 'flowbite-svelte';

	export let supabase: SupabaseClient;

	let imgRef: HTMLImageElement;
	let queues: MusicQueue[] = [];

	let showRemovalMenu = false;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	spaceStore.subscribe((space) => {
		if (space && space?.queues) {
			queues = space?.queues;
		}
	});

	async function removeSingleQueue(index: number) {
		if (!$spaceStore) return;

		const queues: MusicQueue[] = $spaceStore?.queues;
		if (queues.length > 0) {
			queues.splice(index, 1);
		}
		await supabase.from('space').update({ queues }).eq('id', $spaceStore?.id);

		showRemovalMenu = false;
	}

	async function removeEntirePlaylist(playlistId: string | null) {
		if (!$spaceStore) return;

		let queues: MusicQueue[] = $spaceStore?.queues;
		const playingTrack = queues[0];
		const filtered = queues.filter((queue) => queue.playlist_id !== playlistId);

		if(playingTrack?.playlist_id === playlistId) {
			filtered.unshift(playingTrack);
		}
		await supabase.from('space').update({ queues: filtered }).eq('id', $spaceStore?.id);

		showRemovalMenu = false;
	}

	function handleOpenDropdown() {
		showRemovalMenu = true;
	}
</script>

<!-- Each Queues -->
<div class="w-full h-[500px] overflow-y-auto overflow-x-hidden">
	{#each queues as queue, i}
		<div
			on:mouseleave={() => (showRemovalMenu = false)}
			in:fly={{ duration: 200, x: 200 }}
			out:fade={{ duration: 200 }}
			role="listitem"
			class={`mb-1 flex flex-row items-center w-full relative cursor-pointer h-20 hover:bg-white/20 duration-200 rounded-md group ${
				queue?.uri === $playingInfo?.uri ? 'bg-white/10' : null
			}`}
		>
			<p class="mx-2">{i + 1}</p>
			<div class="p-2 overflow-hidden font-normal flex flex-row items-center w-full">
				<img
					bind:this={imgRef}
					src={queue?.image_url}
					width="60"
					height="60"
					alt={`${queue?.name} cover`}
					on:error={handleImageError}
					class="object-cover mr-2"
				/>
				<div class="text-ellipsis w-[80%]">
					<div class="flex flex-row gap-2 mb-1">
						{#if queue.playlist_id}
							<Badge rounded color="green" class="text-xs py-0.5 px-1">Playlist</Badge>
						{/if}
						<p class="text-sm font-medium line-clamp-1">{queue.name}</p>
					</div>
					<p class="leading-tight text-dark-100 text-xs">
						{queue?.artist}
					</p>
					<p class="leading-tight text-dark-100 text-[11px] font-light">
						{millisecondToMinuteSeconds(queue.duration_ms)}
					</p>
				</div>
				{#if queue?.uri !== $playingInfo?.uri}
					<button
						on:mouseenter={() => (showRemovalMenu = queue?.playlist_id ? true : false)}
						on:click={() => (queue?.playlist_id ? handleOpenDropdown : removeSingleQueue(i))}
						aria-label="Remove this queue"
						class="absolute z-20 p-2 top-5 right-4 active:scale-125 duration-150 hidden group-hover:block"
					>
						<Icon
							icon="material-symbols:close"
							class="w-6 h-6 text-dark-200 hover:scale-110 hover:text-primary-700 duration-200"
						/>
					</button>
					{#if showRemovalMenu}
						<Dropdown class="w-48">
							<DropdownItem on:click={() => removeSingleQueue(i)}>Delete this queue</DropdownItem>
							<DropdownItem
								on:click={() => removeEntirePlaylist(queue.playlist_id)}
								class="text-red-500">Delete entire playlist</DropdownItem
							>
						</Dropdown>
					{/if}
				{/if}
			</div>
		</div>
	{/each}
</div>
<!-- Each Queues -->
