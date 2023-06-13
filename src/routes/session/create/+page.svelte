<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Label, Input, Button, Toggle, ButtonGroup, Select } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '$lib/components/buttons/PrimaryButtonWrapper.svelte';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import ErrorMessage from '$lib/components/forms/ErrorMessage.svelte';

	export let data: PageData;
	const { form, errors } = superForm(data.form);

	let showPassword = false;

	const musicSessionTypes = SESSION_MUSIC_TYPES.map((type) => ({
		name: type.name,
		value: type.name
	}));
</script>

<div class="w-full">
	<SuperDebug data={$form} />
</div>
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
	</Label>
	<Label>
		<span class="text-white">Music Type</span>
		<Select
			underline
			bind:value={$form.type}
			placeholder="Select music type"
			items={musicSessionTypes}
			class="!text-white"
		/>
	</Label>
	<Toggle color="green" bind:checked={$form.is_private} class="text-white"
		>Set this session private?</Toggle
	>
	{#if $form.is_private}
		<Label class="space-y-2">
			<label for="password" class="text-white">Set Session Password</label>
			<ButtonGroup class="mb-2 w-full">
				<Input
					name="password"
					required
					bind:value={$form.password}
					placeholder="Password"
					color="green"
					type={showPassword ? 'text' : 'password'}
					defaultClass="placeholder:text-dark-300 w-full"
				/>
				<Button size="xs" on:click={() => (showPassword = !showPassword)}>
					<Icon
						icon={showPassword ? 'material-symbols:visibility' : 'material-symbols:visibility-off'}
						width={20}
						height={20}
						class="text-black"
					/>
				</Button>
			</ButtonGroup>
		</Label>
	{/if}
	{#if $errors?.name && $errors.name[0]}
		<ErrorMessage message={$errors?.name[0]} />
	{/if}
	{#if $errors?.type}
		<ErrorMessage message={$errors?.type[0]} />
	{/if}
	{#if $errors?.password}
		<ErrorMessage message={$errors?.password[0]} />
	{/if}
	<button>
		<PrimaryButtonWrapper>Create Session!</PrimaryButtonWrapper>
	</button>
</form>
