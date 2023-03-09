<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from 'flowbite-svelte';
	import PrimaryButton from '../../component/buttons/PrimaryButton.svelte';
	import { toastValue } from '$lib/notification/toast';
	import type { ActionData } from './$types';

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
		<Input
			name="password"
			required
			bind:value={data.password}
			placeholder="password"
			color="green"
			class="mb-2"
			type={showLoginPassword ? 'text' : 'password'}
		/>
		<PrimaryButton class="my-2">Login</PrimaryButton>
		<a href="/auth/register" class="underline text-gray-300 text-sm">Create an account</a>
	</form>
</div>
