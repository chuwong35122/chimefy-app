<script lang="ts">
	import { Label, Input, Toggle, Select, Tooltip } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '$lib/components/buttons/PrimaryButtonWrapper.svelte';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import ErrorMessage from '$lib/components/forms/ErrorMessage.svelte';
	import SecondaryButtonWrapper from '$lib/components/buttons/SecondaryButtonWrapper.svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_NODE_ENV } from '$env/static/public';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	const { form, errors, delayed } = superForm(data.form);

	const musicSessionTypes = SESSION_MUSIC_TYPES.map((type) => ({
		name: type.name,
		value: type.name
	}));
</script>

<svelte:head>
	<title>Create a Session</title>
</svelte:head>

<div class="p-10 bg-white/5 rounded-2xl duration-150 hover:bg-white/10 w-[500px]">
	{#if PUBLIC_NODE_ENV === 'development'}
		<SuperDebug data={$form} />
	{/if}

	<Tooltip triggeredBy="[id=private-info]" placement="right">
		Private session will not be shown on the search section.
	</Tooltip>

	<form class="flex flex-col space-y-6" method="POST">
		<h3 class="text-4xl font-semibold text-white p-0">Create Your Session</h3>
		<Label class="space-y-2">
			<span class="text-white">Your session name</span>
			<Input
				bind:value={$form.name}
				name="name"
				type="text"
				placeholder="Session Name"
				required
				color="green"
				defaultClass="placeholder:text-dark-300 w-full"
			/>
			{#if $errors?.name && $errors.name[0]}
				<ErrorMessage message={$errors?.name[0]} showBorder={false} />
			{/if}
		</Label>
		<Label>
			<span class="text-white">Music Type</span>
			<Select
				name="type"
				underline
				bind:value={$form.type}
				placeholder="Select music type"
				items={musicSessionTypes}
				class="!text-white mb-2"
			/>
			{#if $errors?.type}
				<ErrorMessage message={$errors?.type[0]} showBorder={false} />
			{/if}
		</Label>
		<!-- Note: Ignore the value type error -->
		<div class="flex flex-row items-center">
			<Toggle
				name="is_private"
				color="green"
				bind:checked={$form.is_private}
				bind:value={$form.is_private}
				class="text-white">Set this session private?</Toggle
			>
			<Icon
				icon="material-symbols:info"
				id="private-info"
				class="text-gray-400 hover:text-gray-200 duration-150 ml-2"
			/>
		</div>
		<button>
			<PrimaryButtonWrapper isLoading={$delayed}>Create Session!</PrimaryButtonWrapper>
		</button>
	</form>
	<button on:click={() => goto('/session')} class="w-full my-4">
		<SecondaryButtonWrapper>Go Back</SecondaryButtonWrapper>
	</button>
</div>
