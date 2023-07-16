<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let icon: string = 'material-symbols:question-mark-rounded';
	export let route: `/${string}` = '/';
	export let routeName: string = '';
	export let isActive = true;
</script>

{#if isActive}
	<a
		aria-disabled="false"
		aria-label={`Go to ${routeName}`}
		href={route}
		class={`flex flex-row items-center p-2 px-3 mx-2 duration-200 hover:text-white ${
			$page.route.id === route
				? 'text-white bg-[rgba(255,255,255,0.08)] rounded-lg'
				: 'text-gray-400'
		}`}
	>
		<Icon {icon} width={24} height={24} class="mb-1" />
		<p class="text-lg font-semibold h-full duration-200 ml-2 hover:text-white hidden md:block">
			{routeName}
		</p>
	</a>
{:else}
	<button
		disabled
		aria-disabled="true"
		aria-label={`Go to ${routeName}`}
		class={`flex flex-row items-center p-2 px-3 text-dark-400 ${
			!isActive ? 'cursor-not-allowed' : null
		}`}
	>
		<Icon {icon} width={24} height={24} class="mb-1" />
		<p class="text-lg font-semibold h-full ml-2 hidden md:block">
			{routeName}
		</p>
	</button>
{/if}
