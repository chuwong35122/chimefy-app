<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	import { toastValue, type ToastType } from '$lib/notification/toast';

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
	<div>{$toastValue?.message}</div>
</Toast>
