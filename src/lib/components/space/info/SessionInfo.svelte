<script lang="ts">
	import { toastValue } from '$stores/notification/toast';
	import { Badge, Button, Dropdown, DropdownItem, Modal, Tooltip } from 'flowbite-svelte';
	import { currentSession } from '$stores/session';
	import { spaceRoleStore, spaceStore } from '$stores/space/index';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher } from 'svelte';

	export let supabase: SupabaseClient;
	export let hidden: boolean;

	let showDeleteModel = false;
	let dropdownOpen = false

	const dispatch = createEventDispatcher();

	function onCopySpaceId() {
		toastValue.set({ message: "Space's ID copied!", type: 'info' });
		navigator.clipboard.writeText($spaceStore?.uuid);
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

<Modal bind:open={showDeleteModel} size="xs" autoclose class="modal-glass">
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

<Tooltip triggeredBy="#copy-id-btn" placement="top">Copy This Space's ID</Tooltip>

<div class="w-full flex flex-row justify-between items-end">
	<div>
		<div class="flex flex-row items-center">
			<div id="isPrivate-icon" class="cursor-pointer">
				{#if $spaceStore?.is_private}
					<Tooltip triggeredBy="[id=isPrivate-icon]" placement="bottom"
						>This is a private space</Tooltip
					>
					<Icon
						icon="material-symbols:lock"
						id="isPrivate-icon"
						width="22"
						height="22"
						class="text-primary-500"
					/>
				{:else}
					<Tooltip triggeredBy="[id=isPublic-icon]" placement="top">This is a public space</Tooltip>
					<Icon
						id="isPublic-icon"
						icon="material-symbols:lock-open-rounded"
						width="20"
						height="20"
						class="text-dark-300 hover:text-dark-300 duration-200"
					/>
				{/if}
			</div>
			<h1 class="text-lg font-medium mx-2">
				{$spaceStore?.name ? $spaceStore?.name : 'Loading...'}
			</h1>
			<Badge rounded color="dark">{$spaceStore?.type}</Badge>
		</div>
	</div>

	
	<Button size="xs"
		>Options<Icon icon="mdi:chevron-down" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button
	>
	<Dropdown bind:open={dropdownOpen} class='w-44'>
		<DropdownItem
			id="copy-id-btn"
			aria-label="Copy this space ID"
			on:click={onCopySpaceId}
			class="flex flex-row items-center text-sm font-medium gap-2"
		>
			<Icon icon="material-symbols:share" width={16} height={16} class="text-dark-400" /><span
				>Share to Friend</span
			>
		</DropdownItem>
		<DropdownItem
			on:click={() => {
			dropdownOpen = false
				dispatch('viewMember', {
					hidden: !hidden
				})
			}}
			class="flex flex-row items-center text-sm font-medium gap-2"
		>
			<Icon icon="mdi:account" width={16} height={16} class="text-dark-400" /><span
				>View members</span
			>
		</DropdownItem>
		{#if $spaceRoleStore === 'admin'}
			<DropdownItem class="flex flex-row items-center text-sm font-medium gap-2 text-red-600">
				<Icon icon="mdi:delete" width={16} height={16} /><span>Delete Space</span>
			</DropdownItem>
		{/if}
	</Dropdown>
</div>
