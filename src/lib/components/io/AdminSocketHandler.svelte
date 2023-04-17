<script lang="ts">
	import type { MusicSession, SessionJoinRequest } from '$lib/interfaces/session/session.interface';
	import type { InitRoomRequest } from '$lib/interfaces/session/socket.interface';
	import { adminSessionInitProcess, currentSession, currentSessionRole } from '$lib/session/session';
	import { ioClient } from '$lib/socket/client';
	import { onDestroy, onMount } from 'svelte';
  import {spotifyUser} from '$lib/spotify/spotify'

  const socketConnection = ioClient.connect();
	onMount(() => {
    console.log($currentSession)
		console.log($spotifyUser)
		// create socket connection
		socketConnection.on('connect', () => {
      adminSessionInitProcess.update(val => ['session_init', ...val])
      // create room
      const roomPayload: InitRoomRequest = {
        sessionId: $currentSession.id,
        name: $currentSession.name,
        isPrivate: $currentSession.isPrivate,
        participants: $currentSession.participants,
        queues: $currentSession.queues,
        status: $currentSession.status,
      }
      socketConnection.emit('createSession', roomPayload)

			// intialize session socket to the server
			// broadcast session playing data to the server
			adminSessionInitProcess.update(val => ['socket_start_success', ...val])

		});
    
    socketConnection.on('onSessionCreated', (val) => {
      adminSessionInitProcess.update(val => ['session_init_success', ...val])
    })
    
    socketConnection.on('onNewComerJoin', (payload: SessionJoinRequest) => {
      console.log(`A wild ${payload?.spotifyDisplayName} has appeard`)
    })


		socketConnection.on('disconnect', () => {
			// close session socket and document in database
		});
	});

	onDestroy(() => {
    socketConnection.disconnect()
  });
</script>
