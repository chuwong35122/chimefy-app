<script lang="ts">
  import {pb, user} from '../../../lib/pocketbase/pb'
  import {page} from '$app/stores'
	import { spotifyToken, spotifyUser } from '$lib/spotify/spotify';
	import type {SpotifyTokenResponse, SpotifyUserProfile} from '$lib/interfaces/spotify.interface'

  export let data: {tokens: SpotifyTokenResponse, userProfile: SpotifyUserProfile}

$: if(data) {
  if(data.tokens) {
    spotifyToken.set(data.tokens)
  }
  if(data.userProfile) {
    spotifyUser.set(data.userProfile)
  }
}
</script>

<div class="w-100vw grid place-items center">
  <img src={$spotifyUser.images[0].url} width='300' height='300' alt="Spotify Profile" class='rounded-full' />
</div>