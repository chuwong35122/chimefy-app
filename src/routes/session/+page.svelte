<script lang="ts">
	import { Button, ButtonGroup, Input, InputAddon, Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { toastValue } from '$lib/notification/toast';
	import SessionList from '$lib/components/session/SessionList.svelte';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { supabase } from '$lib/supabase/supabase';

	let input = '';

	async function enterSession() {
		try {
			const { data } = await supabase.from('session').select().eq('uuid', input);

			const session = (data as any)[0] as MusicSession;
			if (session.uuid) {
				goto(`/session/${session.uuid}`);
			}
		} catch (e) {
			toastValue.set({ message: 'Session not found', type: 'error' });
		}
	}
</script>

<svelte:head>
	<title>Join a Session</title>
</svelte:head>

<div class="rounded-2xl grid place-items-center mt-20">
	<h1 class="text-4xl font-semibold">Join a Session</h1>
	<div class="my-4" />

	<form on:submit|preventDefault={enterSession}>
		<ButtonGroup size="lg" class="w-full focus:shadow-lg focus:shadow-white">
			<InputAddon
				class="!bg-[rgba(255,255,255,0.05)] !border-2 !border-r-0 !rounded-l-full border-white"
			>
				<Icon icon="material-symbols:meeting-room-rounded" width={32} height={32} />
			</InputAddon>
			<Input
				bind:value={input}
				placeholder="Session ID"
				defaultClass="w-[320px] md:w-[400px] lg:w-[460px] text-sm md:text-lg lg:text-xl border-white p-4 border-2 !bg-[rgba(255,255,255,0.05)] !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] text-white focus:border-white"
			/>
			<Button
				type="submit"
				color="dark"
				id="search-btn"
				btnClass="border-white bg-[rgba(255,255,255,0.05)] px-4 border-2 border-l-0 rounded-r-full hover:text-primary-500 duration-200"
			>
				<Icon icon="mdi:location-enter" width={32} height={32} />
			</Button>
			<Tooltip triggeredBy="[id=search-btn]" placement="right">Search</Tooltip>
		</ButtonGroup>
	</form>
	<div class="h-6" />
	<div class="w-full grid place-items-center">
		<button
			on:click={() => goto('/session/create')}
			class="text-sm text-dark-200 font-light hover:text-white duration-200 underline underline-offset-2"
			>Create new music session</button
		>
	</div>
</div>
<div class="grid place-items-center mt-[400px] my-20">
	<SessionList />
</div>
