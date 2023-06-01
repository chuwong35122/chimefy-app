<script lang="ts">
	import { supabase } from "$lib/supabase/supabase";
	import { onMount } from "svelte";
  import {currentSession, playingInfo} from '$lib/session/session'
	import type { SessionPlayingInfo } from "$lib/interfaces/session/session.interface";

  onMount(() => {
    if ($currentSession?.id == null) return;

		const channel = supabase.channel(`session_player_listener_${$currentSession?.id}`);
    channel.on('broadcast', { event: 'playingInfo' }, (payload) => {
      if(payload?.payload) {
        playingInfo.set(payload.payload as SessionPlayingInfo)
      }
    }).subscribe()
  })
</script>