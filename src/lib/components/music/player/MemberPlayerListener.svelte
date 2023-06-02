<script lang="ts">
	import { supabase } from "$lib/supabase/supabase";
	import { onMount } from "svelte";
  import {playingInfo} from '$lib/session/session'
	import type { SessionPlayingInfo } from "$lib/interfaces/session/session.interface";

  export let currentSessionId: number;

  onMount(() => {

		const channel = supabase.channel(`session_player_listener_${currentSessionId}`);
    channel.on('broadcast', { event: 'playingInfo' }, (payload) => {
      console.log(payload)
        playingInfo.set(payload.payload as SessionPlayingInfo)
    }).subscribe()
  })
</script>
