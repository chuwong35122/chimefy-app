<script lang="ts">
		import Icon from '@iconify/svelte';
	import type { SimplifiedPlaylist } from 'spotify-types';
	import { toastValue } from '$stores/notification/toast';
	import { userStore } from '$stores/auth/user';
	import type { MusicQueue } from '$lib/types/space/queue.interface';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore } from '$stores/space';
	import { Tooltip } from 'flowbite-svelte';
	import { getPlaylistTracks } from '$utils/space/track';
	import { appTokenStore } from '$stores/spotify/user';
	import { mapTrackToQueuePayload, randomPlaylistTracks } from '$utils/spotify/playlist';

	export let supabase: SupabaseClient;
	export let playlist: SimplifiedPlaylist;
	let imgRef: HTMLImageElement;

	let isHovering = false;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	async function handleAddPlaylist() {
		const userId = $userStore?.id;
		const spaceId = $spaceStore?.id;

		if (!userId || !spaceId) return;

		const tracks = await getPlaylistTracks(
			playlist.id,
			playlist.tracks.total,
			$appTokenStore?.access_token
		);
		const randoms = randomPlaylistTracks(tracks);
		const payloads = randoms.map((r) => mapTrackToQueuePayload(r, userId, 'playlist', playlist.id));
		try {
			const queues: MusicQueue[] = $spaceStore?.queues;
			await supabase
				.from('space')
				.update({
					queues: [...queues, ...payloads]
				})
				.eq('id', $spaceStore?.id);
		} catch (err) {
			toastValue.set({ message: `Cannot add track`, type: 'error' });
		}
	}
</script>

<Tooltip
	triggeredBy={`[id=view-in-spotify-btn-${playlist.id}]`}
	placement="right"
	class="relative">View playlist in Spotify</Tooltip
>
<div
	role="contentinfo"
	on:mouseenter={() => (isHovering = true)}
	on:mouseleave={() => (isHovering = false)}
	class="w-full p-1 my-1 hover:bg-gradient-to-r hover:from-black to-white/40 duration-200 cursor-pointer group/track relative"
>
	<div class="flex flex-row items-center">
		<button
			on:click={handleAddPlaylist}
			class="grid place-items-center mr-4 relative overflow-hidden w-20 h-20"
		>
			<!-- Icon -->
			{#if isHovering}
				<div class="absolute group/track text-white bg-black/40 rounded-full hover:scale-110">
					<Icon icon="ic:round-add" width="26" height="26" />
				</div>
			{/if}
			<img
				bind:this={imgRef}
				src={playlist.images[0].url}
				on:error={handleImageError}
				alt={`${playlist.name} cover image`}
				aria-label={`Track image of ${playlist.name}`}
				class="object-cover aspect-square"
			/>
			<!-- Icon -->
		</button>
		<div class="w-full md:pr-4 text-left">
			<p class="font-medium text-sm text-clip line-clamp-2">{playlist.name}</p>
			<p class="font-light text-xs text-dark-300 line-clamp-3">
				By {playlist.owner.display_name}
			</p>
			<p class="text-xs text-dark-300">{playlist.tracks.total} tracks</p>
		</div>
			<a
				href={playlist.uri}
				id={`view-in-spotify-btn-${playlist.id}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View in Spotify"
				class="animate-in zoom-in slide-in-from-left-4 absolute right-4 top-7 hover:scale-110 duration-300"
			>
				<Icon
					icon="ic:baseline-chevron-right"
					class="w-8 h-8 text-white/40"
				/>
			</a>
	</div>
</div>
