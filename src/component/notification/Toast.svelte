<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	import { toastValue, type ToastType } from '$lib/notification/toast';
	import Icon from '@iconify/svelte';

	const COUNTER_COUNTDOWN = 5;

	let show = false;
	let counter = COUNTER_COUNTDOWN;

	$: if($toastValue && $toastValue?.message && $toastValue?.type) {
		trigger()
	}

	function resetToastValue() {
		toastValue.set({ message: undefined, type: undefined });
	}

	function trigger() {
		show = true;
		counter = COUNTER_COUNTDOWN;
		timeout();
	}

	function timeout() {
		if (--counter > 0) {
			setTimeout(timeout, 1000);
		} else {
			resetToastValue();
			show = false;
		}
	}

	function getToastColor(type: ToastType | undefined) {
		if (type === 'warn') {
			return 'yellow';
		} else if (type === 'error') {
			return 'red';
		}else if(type === 'info') {
			return 'blue'
		}

		return 'green';
	}
</script>

<Toast
	color={getToastColor($toastValue?.type)}
	bind:open={show}
	transition={fly}
	params={{ y: 200 }}
	divClass="p-2 w-full"
>
	<svelte:fragment slot="icon">
	{#if $toastValue.type === 'error'}
	<Icon icon='material-symbols:error' width={30} height={30} class='text-red-400' />
	<span class="sr-only">Error icon</span>
	{:else if $toastValue.type === 'warn'}
	<Icon icon='material-symbols:error' width={30} height={30} class='text-amber-400' />
	<span class="sr-only">Warn icon</span>
	{:else if $toastValue.type === 'info'}
	<Icon icon='material-symbols:info' width={30} height={30} class='text-blue-500'  />
	<span class="sr-only">Info icon</span>
	{/if}
	</svelte:fragment>
	<div>{$toastValue?.message}</div>
</Toast>
