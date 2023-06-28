<script lang="ts">
	import { toastValue } from '$lib/notification/toast';
	import { Tooltip } from 'flowbite-svelte';
	import { currentSession } from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import Chip from '../UI/Chip.svelte';

	export let sessionId = '';

	function onCopySessionId() {
		toastValue.set({ message: "Session's ID copied!", type: 'info' });
		navigator.clipboard.writeText(sessionId);
	}
</script>

<Tooltip triggeredBy="[id=copy-id-btn]" placement='left'>Copy Session's ID</Tooltip>
{#if $currentSession?.is_private}
	<Tooltip triggeredBy="[id='isPrivate-icon']"
		>{$currentSession?.is_private
			? 'This session is a private session'
			: 'This session is a public session'}</Tooltip
	>
{/if}
<div class="w-full flex flex-row justify-between items-end">
	<div>
		<div class="flex flex-row items-center">
			<div id="isPrivate-icon" class="cursor-pointer">
				{#if $currentSession?.is_private}
					<Icon
						icon="material-symbols:lock"
						width="20"
						height="20"
						class="text-dark-300 hover:text-dark-300 duration-200"
					/>
				{:else}
					<Icon
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
	<button id="copy-id-btn" on:click={onCopySessionId} class="hover:scale-[1.1] duration-200">
		<Icon
			icon="material-symbols:content-copy"
			width={30}
			height={30}
			class="text-gray-500 hover:text-gray-300 duration-200"
		/>
	</button>
</div>
