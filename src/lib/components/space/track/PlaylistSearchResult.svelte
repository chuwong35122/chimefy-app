<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { SimplifiedPlaylist } from 'spotify-types';
	import { toastValue } from '$stores/notification/toast';
	import { userStore } from '$stores/auth/user';
	import type { MusicQueue } from '$lib/types/space/queue.interface';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore } from '$stores/space';
	import { getPlaylistTracks } from '$utils/space/track';
	import { appTokenStore } from '$stores/spotify/user';
	import { mapTrackToQueuePayload, randomPlaylistTracks } from '$utils/spotify/playlist';

	export let supabase: SupabaseClient;
	export let playlist: SimplifiedPlaylist;
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	async function handleAddPlaylist() {
		toastValue.set({
			message: 'Adding playlist...',
			type: 'info'
		});
		const userId = $userStore?.id;
		const spaceId = $spaceStore?.id;

		if (!userId || !spaceId) return;

		const tracks = await getPlaylistTracks(
			playlist.id,
			playlist.tracks.total,
			$appTokenStore?.spotify_access_token
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

<div
	role="contentinfo"
	class="w-full hover:bg-gradient-to-r hover:from-black/40 to-white/40 duration-200 cursor-pointer group relative rounded flex flex-row items-center justify-between"
>
	<button on:click={handleAddPlaylist} class="flex flex-row items-center space-x-2">
		<div
			class="group/track text-primary rounded-full hover:scale-110 invisible group-hover:visible ml-1"
		>
			<Icon icon="ic:round-add" width="26" height="26" />
		</div>
		<!-- Icon -->
		<div class="flex flex-row overflow-hidden w-28">
			<img
				bind:this={imgRef}
				src={playlist.images[0].url}
				on:error={handleImageError}
				alt={`${playlist.name} cover image`}
				aria-label={`Track image of ${playlist.name}`}
				class="object-cover aspect-square"
			/>
			<!-- Icon -->
		</div>
		<div class="w-full md:pr-4 text-left">
			<p class="font-medium text-sm text-clip line-clamp-2">{playlist.name}</p>
			<p class="font-light text-xs text-dark-300 line-clamp-3">
				By {playlist.owner.display_name}
			</p>
			<p class="text-xs text-dark-300">{playlist.tracks.total} tracks</p>
		</div>
	</button>
</div>
