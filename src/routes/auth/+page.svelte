<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '$lib/components/buttons/PrimaryButtonWrapper.svelte';
	import { toastValue } from '$lib/notification/toast';
	import type { ActionData } from './$types';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	let showLoginPassword = false;

	$: if (form?.status === 400) {
		toastValue.set({ message: form?.message, type: 'error' });
	} else if (form?.status === 200) {
		toastValue.set({ message: form?.message, type: 'info' });
	}

	let data = {
		email: '',
		password: ''
	};
</script>

<div class="w-[400px]">
	<form
		method="post"
		action="?/login"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<div class="w-full grid place-items-center">
			<h1 class="text-4xl font-semibold">Login to AppName</h1>
		</div>
		<label for="email">Email</label>
		<Input
			type="email"
			name="email"
			required
			bind:value={data.email}
			placeholder="email"
			color="green"
			class="mb-2"
		/>
		<label for="password">Password</label>
		<ButtonGroup class="mb-2 w-full">
			<Input
				name="password"
				required
				bind:value={data.password}
				placeholder="password"
				color="green"
				type={showLoginPassword ? 'text' : 'password'}
			/>
			<Button size="xs" color="dark" on:click={() => (showLoginPassword = !showLoginPassword)}>
				<Icon
					icon={showLoginPassword
						? 'material-symbols:visibility'
						: 'material-symbols:visibility-off'}
					width={20}
					height={20}
				/>
			</Button>
		</ButtonGroup>
		<button class="w-full">
			<PrimaryButtonWrapper class="my-2">Login</PrimaryButtonWrapper>
		</button>
		<a href="/auth/register" class="underline text-gray-300 text-sm">Create an account</a>
	</form>
</div>
