<script lang="ts">
	import { Input } from 'flowbite-svelte';
	// import ThemedButton from '../../../component/UI/ThemedButton.svelte';

	function handleSubmit() {
    console.log('e')
  }
</script>

<form on:submit={handleSubmit}>
<div class="w-96 md:w-[600px] lg:w[1000px] p-8 rounded-2xl bg-dark-800 flex flex-col items-center">
	<h1 class="text-2xl font-semibold">Create New Sssion</h1>
	<div class="my-4" />
  
  <div class='flex flex-col items-start w-full'>
    <label for='sessionName' class='text-white font-light text-sm'>Session Name</label>
    <Input color="green" placeholder="Session name" class="w-full !rounded-full" />
  </div>
    <!-- <ThemedButton type='input' label="search" /> -->
    <div class="w-full grid place-items-end">
      <a href="/session/create" class="text-sm text-dark-200 font-light hover:text-white duration-200"
			>Create music session</a
      >
    </div>
  </div>
</form>
