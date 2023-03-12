<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentSession } from '$lib/session/session';
	import { checkHash } from '$lib/utils/common/hash';
	import Icon from '@iconify/svelte';
	import { Button, ButtonGroup, InputAddon, Tooltip, Input, Toast } from 'flowbite-svelte';

	let password = '';
	let error = '';

	$: if (password) {
		error = '';
	}

	function enterSession() {
    if(!password) return;

		const result = checkHash(password, $currentSession.password);
		if (!result) {
			error = 'Password incorrect!';
      return
		}else{
      if($currentSession) {
        goto(`session/${$currentSession.id}`)
      }
    }
	}
</script>

<div class="w-full grid place-items-center p-6">
	<form class="grid place-items-center" on:submit|preventDefault={enterSession}>
		<h2 class="text-xl font-regular text-white mb-4">Session's Password</h2>
		<ButtonGroup size="lg" class="w-96 focus:shadow-lg focus:shadow-white mb-4">
			<InputAddon
				class="!bg-[rgba(255,255,255,0.05)] !border-2 !border-r-0 !rounded-l-full border-white"
			>
				<Icon icon="material-symbols:password-rounded" width={32} height={32} />
			</InputAddon>
			<Input
				name="sessionPassword"
				bind:value={password}
				placeholder="Password"
				type="password"
				defaultClass="border-white border-2 w-full !bg-[rgba(255,255,255,0.05)] !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] !text-xl text-white focus:border-white"
			/>
			<Button
				color="dark"
				id="enter-btn"
				btnClass="border-white bg-[rgba(255,255,255,0.05)] px-4 border-2 border-l-0 rounded-r-full hover:text-primary-500 duration-200"
			>
				<Icon icon="mdi:location-enter" width={32} height={32} />
			</Button>
			<Tooltip triggeredBy="[id=enter-btn]" placement="right">Enter Session</Tooltip>
		</ButtonGroup>
	</form>
	{#if error}
		<Toast color="red" divClass="p-2 w-96">
			<svelte:fragment slot="icon">
				<svg
					aria-hidden="true"
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/></svg
				>
				<span class="sr-only">Error icon</span>
			</svelte:fragment>
			{error}
		</Toast>
	{/if}
</div>
