<script lang="ts">
	import { currentSession, currentSessionQueue, currentSessionRole } from '$stores/session';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import type { Track } from 'spotify-types';
	import { toastValue } from '$stores/notification/toast';
	import { joinArtists } from '$lib/utils/track';
	import { userStore } from '$stores/auth/user';
	import { supabase } from '$lib/supabase/supabase';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';

	export let track: Track;
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	async function handleAddQueue() {
		const userId = $userStore?.id;
		const sessionId = $currentSession?.id;

		if (!userId || !sessionId) return;

		if ($currentSessionRole === 'member') {
			toastValue.set({ message: "Only session's admin add music to the queue", type: 'info' });
			return;
		}

		const queuePayload: MusicQueue = {
			track_id: track.id,
			track_uri: track.uri,
			track_name: track.name,
			artist: joinArtists(track),
			duration_ms: track.duration_ms,
			track_image_url: track?.album?.images[0]?.url,
			added_by: $userStore?.user_metadata?.uuid,
			added_since: new Date()
		};

		if (!currentSessionQueue || !$currentSessionQueue?.queues) return;
		try {
			await supabase
				.from('session_queue')
				.update({
					queues: [...$currentSessionQueue?.queues, queuePayload]
				})
				.eq('session_id', $currentSession?.id);
		} catch (err) {
			toastValue.set({ message: `Cannot add track`, type: 'error' });
		}
	}
</script>

<div
	on:mousedown={handleAddQueue}
	class="w-full p-1 my-1 hover:bg-gradient-to-r bg-black hover:from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.8)] duration-200 rounded-xl cursor-pointer group/track"
>
	<div class="flex flex-row items-center">
		<div
			class="bg-[rgba(255,255,255,0.3)] grid place-items-center mr-4 relative rounded-lg overflow-hidden"
		>
			<div
				class="absolute invisible group/track group-hover/track:visible text-white bg-[rgba(0,0,0,0.6)] rounded-full hover:scale-110"
			>
				<Icon icon="ic:round-add" width="40" height="40" />
			</div>
			<img
				bind:this={imgRef}
				src={track.album.images[0].url}
				on:error={handleImageError}
				alt={`${track.name} cover image`}
				width="80"
				height="80"
				aria-label={`Track image of ${track.name}`}
			/>
		</div>
		<div class="overflow-hidden">
			<p class="font-medium text-sm text-clip">{track.name}</p>
			<p class="font-light text-xs text-dark-300">
				{joinArtists(track)}
			</p>
			<p class="text-xs text-dark-300">{millisecondToMinuteSeconds(track?.duration_ms ?? 0)}</p>
		</div>
	</div>
</div>
