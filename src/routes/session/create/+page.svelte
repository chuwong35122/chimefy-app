<script lang="ts">
	import { goto } from '$app/navigation';
	import type { CreateMusicSession } from '$lib/interfaces/session/session.interface';
	import Icon from '@iconify/svelte';
	import { Label, Input, Button, Toggle, ButtonGroup, Select, Toast } from 'flowbite-svelte';
	import type { ValidationError } from 'yup';
	import PrimaryButtonWrapper from '$lib/components/buttons/PrimaryButtonWrapper.svelte';
	import sha1 from 'sha1';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import { supabase } from '$lib/supabase/supabase';
	import { userStore } from '$lib/supabase/user';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { toastValue } from '$lib/notification/toast';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { SuperValidated } from 'sveltekit-superforms/index';
	import type { CreateSessionSchema } from '$lib/schema/session.schema';
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

	// 	const { form, enhance, constraints, validate } = superForm(input, {
	// 	validators: CreateSessionSchema,
	// 	validationMethod: 'submit-only',
	// 	defaultValidator: 'keep'
	// })

	async function onCreateSession() {
		if (!$userStore?.id) return;

		// const form = await superForm(CreateSessionSchema)
		// try {
		// 	// await superValidate(superValidate)
		// 	// await CreateSessionSchema.validate(input, { strict: true });
		// } catch (e) {
		// 	const err = e as ValidationError;
		// 	errors = err.message;
		// 	return;
		// }

		// try {
		// 	const payload: CreateMusicSession = {
		// 		...input,
		// 		name: input.name,
		// 		password: input.password ? sha1(input.password) : null,
		// 		is_private: input.is_private,
		// 		type: input.type,
		// 		created_by: $userStore?.id,
		// 		queues: null
		// 	};

		// 	const { data } = await supabase.from('session').insert(payload).select();

		// 	if (data && data[0] && data[0]?.id && data[0]?.uuid != null) {
		// 		const queueResponse = await supabase
		// 			.from('session_queue')
		// 			.insert({
		// 				queues: [],
		// 				session_id: data[0]?.id,
		// 				session_uuid: data[0]?.uuid
		// 			})
		// 			.select();

		// 		const _queueId = (queueResponse?.data as any)[0].id;
		// 		await supabase.from('session').update({ queues: _queueId }).eq('id', data[0]?.id);
		// 		await supabase
		// 			.from('session_member')
		// 			.insert({ members: [], session_uuid: data[0]?.uuid, session_id: data[0]?.id })
		// 			.select();
		// 		goto(`/session/${data[0].uuid}`);
		// 	}
		// } catch (e) {
		// 	console.log(e);
		// 	const err = e as PostgrestError;
		// 	toastValue.set({ message: err.message, type: 'error' });
		// }
	}
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
	{#if $errors?.name}
		<ErrorMessage message={$errors?.name[0]} />
	{/if}
	{#if $errors?.type}
		<ErrorMessage message={$errors?.type[0]} />
	{/if}
	{#if $errors?.password}
		<ErrorMessage message={$errors?.password[0]} />
	{/if}
	<button on:click={onCreateSession}>
		<PrimaryButtonWrapper>Create Session!</PrimaryButtonWrapper>
	</button>
</form>
