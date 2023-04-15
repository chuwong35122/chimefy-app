<script lang="ts">
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '$lib/components/buttons/PrimaryButtonWrapper.svelte';
	import { toastValue } from '$lib/notification/toast';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';

	export let form: ActionData;
	$: if (form?.status === 400 || form?.status === 404) {
		toastValue.set({ message: form?.message, type: 'error' });
		isLoading = false;
	} else if (form?.status === 200) {
		toastValue.set({ message: form?.message, type: 'info' });
	}

	let showPassword = false;
	let showConfirmPassword = false;
	let isLoading = false;

	let signupData = {
		email: '',
		password: '',
		passwordConfirm: ''
	};
</script>

<div class="w-[400px]">
	<div class="grid place-items-center">
		<h1 class="text-4xl font-bold">Register to Chimefy</h1>
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
			<ButtonGroup class="mb-2 w-full">
				<Input
					required
					name="password"
					bind:value={signupData.password}
					placeholder="Password"
					color="green"
					type={showPassword ? 'text' : 'password'}
				/>
				<Button size="xs" color="dark" on:click={() => (showPassword = !showPassword)}>
					<Icon
						icon={showPassword ? 'material-symbols:visibility' : 'material-symbols:visibility-off'}
						width={20}
						height={20}
					/>
				</Button>
			</ButtonGroup>
			<label for="email">Confirm password</label>
			<ButtonGroup class="mb-2 w-full">
				<Input
					required
					name="passwordConfirm"
					bind:value={signupData.passwordConfirm}
					placeholder="Confirm Password"
					color="green"
					type={showConfirmPassword ? 'text' : 'password'}
				/>
				<Button
					size="xs"
					color="dark"
					on:click={() => (showConfirmPassword = !showConfirmPassword)}
				>
					<Icon
						icon={showConfirmPassword
							? 'material-symbols:visibility'
							: 'material-symbols:visibility-off'}
						width={20}
						height={20}
					/>
				</Button>
			</ButtonGroup>
			<PrimaryButtonWrapper {isLoading} class="my-2">Sign up</PrimaryButtonWrapper>
			<a href="/auth" class="underline text-gray-300 text-sm">Want to Login?</a>
		</div>
	</form>
</div>
