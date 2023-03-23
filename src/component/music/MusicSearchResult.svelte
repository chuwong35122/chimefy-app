<script lang="ts">
	import { checkSessionRole, currentSession } from '$lib/session/session';
	import { pb, user } from '$lib/pocketbase/pb';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import type { Track } from 'spotify-types';
	import { socket } from '$lib/socket/client';
	import { toastValue } from '$lib/notification/toast';
	import { joinArtists } from '$lib/utils/track';
	import type { SessionTrackQueueRequest } from '$lib/interfaces/session/queue.interface';
	import { spotifyUser } from '$lib/spotify/spotify';
	import type { MusicSessionQueue } from '$lib/interfaces/session/session.interface';

	export let track: Track;
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	async function handleAddQueue() {
		const userId = $user?.id;
		const sessionId = $currentSession?.id;
		if (!userId || !sessionId) return;

		const userRole = checkSessionRole(userId, $currentSession);
		if (userRole === 'member') {
			toastValue.set({ message: "Only session's admin add music to the queue", type: 'info' });
			return;
		}

		const session = { ...$currentSession };
		const sessionQueues = [...$currentSession.queues];
		const newQueue: MusicSessionQueue = {
			trackId: track.id,
			trackName: track.name,
			artist: joinArtists(track),
			durationMs: track.duration_ms,
			trackImageUrl: track?.album?.images[0]?.url,
			addedSince: new Date()
		};
		sessionQueues.push(newQueue);
		session.queues = sessionQueues;
		try {
			await pb.collection('sessions').update(sessionId, session);
			socket.emit('addQueue', {
				sessionId: sessionId,
				userId: userId,
				socketId: socket.id,
				spotifyDisplayName: $spotifyUser?.display_name ?? '',
				track: newQueue
			} as SessionTrackQueueRequest);
			toastValue.set({ message: `${track?.name} added to queue`, type: 'info' });
		} catch (e) {
			toastValue.set({ message: `Cannot add track`, type: 'error' });
		}
	}
</script>

<div
	on:mousedown={handleAddQueue}
	class="w-80 p-1 my-1 hover:bg-gradient-to-r bg-black hover:from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.8)] duration-200 rounded-xl cursor-pointer group/track"
>
	<div class="flex flex-row items-center">
		<div
			class="bg-[rgba(255,255,255,0.3)] grid place-items-center mr-4 relative rounded-lg overflow-hidden"
		>
			<div
				class="absolute invisible group/track group-hover/track:visible text-primary-600 bg-[rgba(0,0,0,0.3)] rounded-full hover:scale-110"
			>
				<Icon icon="material-symbols:play-circle" width="40" height="40" />
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
