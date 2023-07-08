<script lang="ts">
	import { toastValue } from '$lib/notification/toast';
	import { Button, Modal, Tooltip } from 'flowbite-svelte';
	import { currentSession, currentSessionRole } from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import Chip from '../UI/Chip.svelte';
	import { supabase } from '$lib/supabase/supabase';
	import { goto } from '$app/navigation';

	export let sessionId = '';

	let showDeleteModel = false;

	function onCopySessionId() {
		toastValue.set({ message: "Session's ID copied!", type: 'info' });
		navigator.clipboard.writeText(sessionId);
	}

	function handleOpenDeleteModal() {
		showDeleteModel = true;
	}

	async function handleDeleteSession() {
		if (!$currentSession?.id) return;
		const { error } = await supabase.from('session').delete().eq('id', $currentSession.id);
		goto('/session');
		if (error?.code) {
			toastValue.set({ message: 'Cannot delete session due to an error.', type: 'error' });
		}
	}
</script>

<Modal bind:open={showDeleteModel} size="xs" autoclose class="!bg-black">
	<div class="text-center">
		<div class="w-full grid place-items-center">
			<Icon icon="fluent-emoji:thinking-face" class="w-20 h-20" />
		</div>
		<h3 class="text-white my-6">Are you sure you want to delete this session?</h3>
		<Button
			on:click={handleDeleteSession}
			color="red"
			aria-label="Delete session"
			class="mr-2 hover:scale-105 duration-150 w-40">Delete it!</Button
		>
		<Button color="alternative" aria-label="Cancel" class="hover:scale-105 duration-150 w-40"
			>Nevermind</Button
		>
	</div>
</Modal>

<Tooltip triggeredBy="#copy-id-btn" placement="right">Copy Session's ID</Tooltip>
<div class="w-full flex flex-row justify-between items-end">
	<div>
		<div class="flex flex-row items-center">
			<div id="isPrivate-icon" class="cursor-pointer">
				{#if $currentSession?.is_private}
					<Tooltip triggeredBy="[id=isPrivate-icon]" placement="top"
						>This session is a private session</Tooltip
					>
					<Icon
						icon="material-symbols:lock"
						id="isPrivate-icon"
						width="20"
						height="20"
						class="text-dark-300 hover:text-dark-300 duration-200"
					/>
				{:else}
					<Tooltip triggeredBy="[id=isPublic-icon]" placement="top"
						>This session is a public session</Tooltip
					>
					<Icon
						id="isPublic-icon"
						icon="material-symbols:lock-open-rounded"
						width="20"
						height="20"
						class="text-dark-300 hover:text-dark-300 duration-200"
					/>
				{/if}
			</div>
			<h1 class="text-2xl font-medium ml-2 mr-2">
				{$currentSession?.name ? `${$currentSession?.name}` : 'Loading...'}
			</h1>
			<Chip label={$currentSession?.type} />
		</div>
	</div>
	<div class="flex flex-row items-center">
		{#if $currentSessionRole === 'admin'}
			<Tooltip triggeredBy="#delete-id-btn" placement="left">Delete Session</Tooltip>
			<button
				id="delete-id-btn"
				aria-label="Delete this session"
				on:click={handleOpenDeleteModal}
				class="hover:scale-[1.1] duration-200 mr-4"
			>
				<Icon
					icon="mdi:delete"
					width={30}
					height={30}
					class="text-red-800 hover:text-red-700 duration-200"
				/>
			</button>
		{/if}
		<button
			id="copy-id-btn"
			aria-label="Copy session ID"
			on:click={onCopySessionId}
			class="hover:scale-[1.1] duration-200"
		>
			<Icon
				icon="material-symbols:content-copy"
				width={30}
				height={30}
				class="text-gray-500 hover:text-gray-300 duration-200"
			/>
		</button>
	</div>
</div>
