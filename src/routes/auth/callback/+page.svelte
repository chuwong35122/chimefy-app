<script lang="ts">
  import {pb, user} from '../../../lib/pocketbase/pb'
  import {page} from '$app/stores'

  async function handleInitUser() {
		const authMethods = await pb.collection('users').listAuthMethods();
    const provider = authMethods.authProviders[0]
    const code = $page.url.searchParams.get('code') ?? ''
    
    console.log(code)
   try {
    const v = await pb.collection('users').authWithOAuth2(provider.name, code, provider.codeVerifier, 'http://localhost:5173/auth/callback', {
      name: 'uwu'
    })
    console.log(v)
   }catch(e) {
    console.log(e)
   }
  }

  handleInitUser()
</script>