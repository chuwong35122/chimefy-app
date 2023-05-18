<script lang="ts">
	import { Button, ButtonGroup, Input, InputAddon, Modal, Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import CreateSessionModal from '$lib/components/modals/CreateSessionModal.svelte';
	import SessionPasswordModal from '$lib/components/modals/SessionPasswordModal.svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/supabase/user';
	import { toastValue } from '$lib/notification/toast';
	import SessionList from '$lib/components/session/SessionList.svelte';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { onMount } from 'svelte';
	import { sessionSearchResult } from '$lib/session/search';

	let openCreateSessionModal = false;
	let enterSessionPasswordModal = false;
	let input = '';

	async function onOpenPasswordModal() {
		// 	console.log($userStore?.id)
		// 	if (!$userStore?.id) {
		// 		toastValue.set({ message: 'Please login to Spotify', type: 'info' });
		// 		return;
		// 	}
		// 	const session = await getSessionData(input);
		// 	if (!session?.id) return;
		// 	if (session?.password) {
		// 		enterSessionPasswordModal = true;
		// 	} else {
		// 		goto(`session/${session.id}`);
		// 	}
	}

	function handleOpenCreateModal() {
		if (!$userStore?.id) {
			toastValue.set({ message: 'Please login to Spotify', type: 'info' });
			return;
		}

		openCreateSessionModal = true;
	}
</script>

<svelte:head>
	<title>Join a Session</title>
</svelte:head>

<Modal
	bind:open={openCreateSessionModal}
	size="xs"
	autoclose={false}
	class="w-full z-10 modal-glass"
>
	<CreateSessionModal />
</Modal>
<Modal
	bind:open={enterSessionPasswordModal}
	size="sm"
	autoclose={false}
	class="w-full z-10 modal-glass"
>
	<SessionPasswordModal />
</Modal>
<div class="w-96 md:w-[600px] lg:w[1000px] p-8 rounded-2xl flex flex-col items-center">
	<h1 class="text-4xl font-semibold">Join a Session</h1>
	<div class="my-4" />

	<form on:submit|preventDefault={onOpenPasswordModal}>
		<ButtonGroup size="lg" class="w-full focus:shadow-lg focus:shadow-white">
			<InputAddon
				class="!bg-[rgba(255,255,255,0.05)] !border-2 !border-r-0 !rounded-l-full border-white"
			>
				<Icon icon="material-symbols:meeting-room-rounded" width={32} height={32} />
			</InputAddon>
			<Input
				bind:value={input}
				placeholder="Session ID"
				defaultClass="border-white p-4 border-2 w-full !bg-[rgba(255,255,255,0.05)] !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] !text-xl text-white focus:border-white"
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
			on:click={handleOpenCreateModal}
			class="text-sm text-dark-200 font-light hover:text-white duration-200 underline underline-offset-2"
			>Create new music session</button
		>
	</div>
</div>
<div class="grid place-items-center mt-[400px] my-20">
	<SessionList />
</div>
