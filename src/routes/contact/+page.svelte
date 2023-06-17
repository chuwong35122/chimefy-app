<script>
	import Icon from "@iconify/svelte";
	import EmailContact from "../../lib/components/forms/EmailContact.svelte";

</script>
<svelte:head>
	<title>Contact Chimefy</title>
</svelte:head>

<div class="mt-20 w-[600px] flex flex-col items-center">
	<h1 class='text-4xl font-bold mb-4'>Contact</h1>
	<EmailContact />
	<div class="flex flex-row items-center my-4">
		<a href='/contact/report-bug' target='_blank' rel="noopener noreferrer" class='underline'>Found a bug? Report it here</a>
	</div>
</div>