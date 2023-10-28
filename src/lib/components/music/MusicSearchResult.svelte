<script lang="ts">
	import { millisecondToMinuteSeconds } from '$utils/common/time';
	import Icon from '@iconify/svelte';
	import type { Track } from 'spotify-types';
	import { toastValue } from '$stores/notification/toast';
	import { joinArtists } from '$utils/track';
	import { userStore } from '$stores/auth/user';
	import type { MusicQueue } from '$lib/types/session/queue.interface';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore, spaceRoleStore } from '$stores/space';

	export let supabase: SupabaseClient;
	export let track: Track;
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

async function handleAddQueue() {
		const userId = $userStore?.id;
		const sessionId = $spaceStore?.id;

		if (!userId || !sessionId) return;

		if ($spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue) {
			toastValue.set({
				message: "Session's admin does not allow member to queue tracks.",
				type: 'info'
			});
			return;
		}

		const queuePayload: MusicQueue = {
			track_id: track.id,
			track_uri: track.uri,
			track_name: track.name, 
			artist: joinArtists(track),
			duration_ms: track.duration_ms,
			track_image_url: track?.album?.images[0]?.url,
			added_by: userId,
			added_since: new Date()
		};

		console.log(queuePayload);

		try {
			const queues: MusicQueue[] = $spaceStore?.queues;
			await supabase
				.from('session')
				.update({
					queues: [...queues, queuePayload]
				})
				.eq('id', $spaceStore?.id);
		} catch (err) {
			toastValue.set({ message: `Cannot add track`, type: 'error' });
		}
	}
</script>

<button
	on:click={handleAddQueue}
	class="w-full p-1 my-1 hover:bg-gradient-to-r hover:from-black to-white/40 duration-200 cursor-pointer group/track"
>
	<div class="flex flex-row items-center">
		<div class="grid place-items-center mr-4 relative overflow-hidden w-20 h-20">
			<!-- Icon -->
			<div
				class="absolute invisible group/track group-hover/track:visible text-white bg-black/40 rounded-full hover:scale-110"
			>
				<Icon icon="ic:round-add" width="26" height="26" />
			</div>
			<!-- Icon -->
			<img
				bind:this={imgRef}
				src={track.album.images[0].url}
				on:error={handleImageError}
				alt={`${track.name} cover image`}
				aria-label={`Track image of ${track.name}`}
				class="object-cover"
			/>
		</div>
		<div class="w-full md:pr-4 text-left">
			<p class="font-medium text-sm text-clip line-clamp-2">{track.name}</p>
			<p class="font-light text-xs text-dark-300 line-clamp-1">
				{joinArtists(track)}
			</p>
			<p class="text-xs text-dark-300">{millisecondToMinuteSeconds(track?.duration_ms ?? 0)}</p>
		</div>
	</div>
</button>
