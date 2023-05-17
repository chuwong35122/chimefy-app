<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { CreateSessionSchema } from '$lib/schema/session.schema';
	import Icon from '@iconify/svelte';
	import { Label, Input, Button, Toggle, ButtonGroup, Select, Toast } from 'flowbite-svelte';
	import type { ValidationError } from 'yup';
	import PrimaryButtonWrapper from '../buttons/PrimaryButtonWrapper.svelte';
	import sha1 from 'sha1';
	import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
	import { supabase } from '$lib/supabase/supabase';
	import { userStore } from '$lib/supabase/user';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { toastValue } from '$lib/notification/toast';
	import { v4 as uuidv4 } from 'uuid';

	let showPassword = false;
	export let input = {
		name: '',
		password: '',
		isPrivate: false,
		type: ''
	};

	const muisicSessionTypes = SESSION_MUSIC_TYPES.map((type) => ({
		name: type,
		value: type
	}));

	let errors = '';
	$: if (input) {
		errors = '';
	}

	async function onCreateSession() {
		if (!$userStore?.id) return;

		try {
			await CreateSessionSchema.validate(input, { strict: true });
		} catch (e) {
			const err = e as ValidationError;
			errors = err.message;
			return;
		}

		try {
			const payload: MusicSession = {
				...input,
				uuid: uuidv4(),
				participants: [
					{
						userId: $userStore.id,
						role: 'admin',
						profileImg: $userStore?.user_metadata?.avatar_url ?? undefined,
						spotifyDisplayedName: $userStore?.user_metadata?.full_name ?? ''
					}
				],
				queues: [],
				password: sha1(input.password),
				status: 'waiting'
			};
			const { data } = await supabase.from('session').insert(payload).select();
			//@ts-ignore
			goto(`/session/${data[0].uuid}`);
			// goto(`/session/${res?.input?[0]?.id}`)
		} catch (e) {
			console.log(e);
			const err = e as PostgrestError;
			toastValue.set({ message: err.message, type: 'error' });
		}
	}
</script>

<form class="flex flex-col space-y-6">
	<h3 class="text-xl font-medium text-white p-0">Create Your Session</h3>
	<Label class="space-y-2">
		<span class="text-white">Your session name</span>
		<Input
			bind:value={input.name}
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
			bind:value={input.type}
			placeholder="Select music type"
			items={muisicSessionTypes}
			class="!text-white"
		/>
	</Label>
	<Toggle color="green" bind:checked={input.isPrivate} class="text-white"
		>Set this session private?</Toggle
	>
	{#if input.isPrivate}
		<Label class="space-y-2">
			<label for="password" class="text-white">Set Session Password</label>
			<ButtonGroup class="mb-2 w-full">
				<Input
					name="password"
					required
					bind:value={input.password}
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
	{#if errors}
		<Toast color="red" divClass="p-2 w-full">
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
			{errors}
		</Toast>
	{/if}
	<button on:click={onCreateSession}>
		<PrimaryButtonWrapper>Create Session!</PrimaryButtonWrapper>
	</button>
</form>
