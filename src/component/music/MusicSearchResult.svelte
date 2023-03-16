<script lang="ts">
	import { currentSession } from '$lib/session/session';
	import { pb, user } from '$lib/pocketbase/pb';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import type { Track } from 'spotify-types';

	export let track: Track;

	let trackImage = track.album.images[0].url;
	let { minutes, seconds } = millisecondToMinuteSeconds(track.duration_ms);
	function handleError() {
		trackImage = '/logo/disc.png';
	}

	async function handleAddQueue() {
		const id = $user?.id;
		const sessionAdmins = $currentSession?.participants.admins;
		const sessionId = $currentSession?.id;

		if (!id || !sessionId) return;
		if (!sessionAdmins.includes(id)) return;

		// await pb.collection(sessionId, {

		// })
		console.log(track.id);
	}
</script>

<div
	class="w-80 p-1 my-1 hover:bg-gradient-to-r bg-black hover:from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.8)] duration-200 rounded-xl cursor-pointer group/track"
>
	<div class="flex flex-row items-center">
		<div
			class="bg-[rgba(255,255,255,0.3)] grid place-items-center mr-4 relative rounded-lg overflow-hidden"
		>
			<button
				on:click={handleAddQueue}
				class="absolute invisible group/track group-hover/track:visible text-primary-600 bg-[rgba(0,0,0,0.3)] rounded-full hover:scale-110"
			>
				<Icon icon="material-symbols:play-circle" width="40" height="40" />
			</button>
			<img
				src={trackImage}
				on:error={handleError}
				alt={`${track.name} cover image`}
				width="80"
				height="80"
				aria-label={`Track image of ${track.name}`}
			/>
		</div>
		<div class="overflow-hidden">
			<p class="font-medium text-sm text-clip">{track.name}</p>
			<p class="font-light text-xs text-dark-300">
				{track.artists.map((artist) => artist.name).join(', ')}
			</p>
			<div class="h-2" />
			<p class="text-xs text-dark-300">{minutes}:{seconds}</p>
		</div>
	</div>
</div>
