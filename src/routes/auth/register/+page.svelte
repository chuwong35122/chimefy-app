<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import PrimaryButton from '../../../component/buttons/PrimaryButton.svelte';
	import { toastValue } from '$lib/notification/toast';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	$: if (form?.status === 400 || form?.status === 404) {
		toastValue.set({ message: form?.message, type: 'error' });
		isLoading = false;
	} else if (form?.status === 200) {
		toastValue.set({ message: form?.message, type: 'info' });
	}

	let showSignupPassword = false;
	let isLoading = false;

	let signupData = {
		email: '',
		password: '',
		passwordConfirm: ''
	};
</script>

<div class="w-[400px]">
	<div class="grid place-items-center">
		<h1 class="text-4xl font-bold">Register to AppName</h1>
	</div>
	<form
		method="POST"
		action="?/register"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<div class="rounded-xl">
			<label for="email">Email</label>
			<Input
				required
				name="email"
				bind:value={signupData.email}
				placeholder="Email"
				color="green"
				class="mb-2"
			/>
			<label for="email">Password</label>
			<Input
				required
				name="password"
				bind:value={signupData.password}
				placeholder="Password"
				color="green"
				class="mb-2"
				type={showSignupPassword ? 'text' : 'password'}
			/>
			<label for="email">Confirm password</label>
			<Input
				required
				name="passwordConfirm"
				bind:value={signupData.passwordConfirm}
				placeholder="Confirm Password"
				color="green"
				class="mb-2"
				type={showSignupPassword ? 'text' : 'password'}
			/>
			<PrimaryButton {isLoading} class="my-2">Sign up</PrimaryButton>
			<a href="/auth" class="underline text-gray-300 text-sm">Want to Login?</a>
		</div>
	</form>
</div>
