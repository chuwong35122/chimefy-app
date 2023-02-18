<script lang="ts">
  import {Input} from 'flowbite-svelte'
</script>

<div
	class="w-96 md:w-[600px] lg:w[1000px] p-8 rounded-2xl bg-dark-800 flex flex-col items-center"
>
	<h1 class="text-2xl font-semibold">Join a Session</h1>
	<div class="my-4" />
	<Input
  color='green'
		placeholder="Session ID"
		class="w-full p-4 !rounded-full text-xl border-[3px] border-primary-500 focus:border-primary-400 placeholder-gray-400 duration-200"
    />
    <button class='w-full bg-primary-600 hover:bg-primary-500 duration-200 p-2 rounded-full mt-4 text-lg uppercase'>search</button>
    <div class="w-full grid place-items-end">
      <a href='/session/create' class='text-sm text-dark-200 font-light hover:text-white duration-200'>Create new music session</a>
    </div>
</div>
