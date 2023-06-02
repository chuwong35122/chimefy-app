<script lang="ts">
	import {
		currentSessionQueue,
		currentSessionRole,
		playingInfo,
		spotifyPlayerDeviceId
	} from '$lib/session/session';
	import { playTrack } from '$lib/spotify/player';
	import { spotifyAccessToken } from '$lib/spotify/spotify';

	playingInfo.subscribe(async (info) => {
		console.log(info);
	});
</script>
