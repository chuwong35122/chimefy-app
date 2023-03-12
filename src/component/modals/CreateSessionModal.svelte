<script lang="ts">
	import { goto } from '$app/navigation';
	import { MUSIC_GENRE } from '$lib/constants/music/genres';
	import type { MusicSession } from '$lib/interfaces/session.interface';
	import { pb, user } from '$lib/pocketbase/pb';
	import { CreateSessionSchema } from '$lib/schema/session.schema';
	import Icon from '@iconify/svelte';
	import { Label, Input, Button, Toggle, ButtonGroup, Select, Toast } from 'flowbite-svelte';
	import type { ClientResponseError } from 'pocketbase';
	import type { ValidationError } from 'yup';
	import PrimaryButton from '../buttons/PrimaryButton.svelte';
	import sha1 from 'sha1'

	let showPassword = false;
	export let data = {
		name: '',
		password: '',
		isPrivate: false,
		type: '',
	};
  
  let errors = ''
  $: if(data) {
    errors = ''
  }

	let genres = MUSIC_GENRE.map((val) => {
		return {
			value: val,
			name: val
		};
	});

	async function onCreateSession() {
    if(!$user?.id) return;

		try {
			await CreateSessionSchema.validate(data, { strict: true });
		} catch (e) {
			const err = e as ValidationError;
      errors = err.message;
			return;
		}

    try{
      const payload: MusicSession = {
        ...data,
        participants: {
          admins: [$user.id],
          members: [$user.id]
        },
				password: sha1(data.password)
      }
      const record = await pb.collection('sessions').create(payload);
			if(record) {
				goto(`/session/${record.id}`)
			}
    }catch(e) {
      const err = e as ClientResponseError;
      errors = err.message;
    }
	}
</script>

<form class="flex flex-col space-y-6">
	<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create Your Session</h3>
	<Label class="space-y-2">
		<span>Your session name</span>
		<Input
			bind:value={data.name}
			name="name"
			type="text"
			placeholder="Session Name"
			required
			color="green"
		/>
	</Label>
	<Label class="space-y-2">
		<label for="password">Set Session Password</label>
		<ButtonGroup class="mb-2 w-full">
			<Input
				name="password"
				required
				bind:value={data.password}
				placeholder="Password"
				color="green"
				type={showPassword ? 'text' : 'password'}
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

	<Label
		>Select an option
		<Select underline color="green" class="mt-2" items={genres} bind:value={data.type} />
	</Label>
	<Toggle color="green" bind:checked={data.isPrivate}>Set this session private?</Toggle>
 {#if errors}
 <Toast color="red" divClass="p-2 w-full">
  <svelte:fragment slot="icon">
    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    <span class="sr-only">Error icon</span>
  </svelte:fragment>
  {errors}
</Toast>
 {/if}
    <!-- <Button type="submit" class="w-full1">Login to your account</Button> -->
	<PrimaryButton on:click={onCreateSession}>Create Session!</PrimaryButton>
</form>
