<script lang="ts">
	import { Button, ButtonGroup, Input, InputAddon, Modal, Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import CreateSessionModal from '../../component/modals/CreateSessionModal.svelte';

	let openModal = false;
</script>

<Modal bind:open={openModal} size="xs" autoclose={false} class="w-full z-10">
	<CreateSessionModal />
</Modal>
<div class="w-96 md:w-[600px] lg:w[1000px] p-8 rounded-2xl flex flex-col items-center">
	<h1 class="text-4xl font-semibold">Join a Session</h1>
	<div class="my-4" />

	<ButtonGroup size="lg" class="w-full focus:shadow-lg focus:shadow-white">
		<InputAddon
			class="bg-[rgba(255,255,255,0.05)] !border-2 !border-r-0 !rounded-l-full border-white"
		>
			<Icon icon="material-symbols:meeting-room-rounded" width={32} height={32} />
		</InputAddon>
		<Input
			placeholder="Session ID"
			defaultClass="border-white p-4 border-2 w-full bg-[rgba(255,255,255,0.05)] !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] text-xl text-white focus:border-white"
		/>
		<Button
			color="dark"
			id="search-btn"
			btnClass="border-white bg-[rgba(255,255,255,0.05)] px-4 border-2 border-l-0 rounded-r-full hover:text-primary-500 duration-200"
		>
			<Icon icon="mdi:location-enter" width={32} height={32} />
		</Button>
		<Tooltip triggeredBy="[id=search-btn]" placement="right">Search</Tooltip>
	</ButtonGroup>
	<div class="h-6" />
	<div class="w-full grid place-items-center">
		<button
			on:click={() => (openModal = true)}
			class="text-sm text-dark-200 font-light hover:text-white duration-200 underline underline-offset-2"
			>Create new music session</button
		>
	</div>
</div>
