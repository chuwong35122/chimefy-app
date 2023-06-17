<script lang="ts">
	import { Input, Label, Textarea } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '../buttons/PrimaryButtonWrapper.svelte';
	import Icon from '@iconify/svelte';
</script>

<form>
	<div
		class="flex flex-row items-center rounded-2xl w-[400px] md:w-[900px] h-[600px] overflow-hidden"
	>
		<div
			class="h-full invisible md:visible w-0 md:w-[600px] overflow-hidden cover relative group/cover-img"
		>
			<img
				src="/images/contact/paper-plane.png"
				alt="Contact us"
				class="h-full object-cover hover:scale-110 duration-[2000ms] transform-o"
			/>
			<div
				class="invisible absolute right-[50%] bottom-6 bg-black/30 rounded-full p-2 group-hover/cover-img:visible"
			>
				Image by teravector
			</div>
		</div>
		<div class="flex flex-col gap-2 text-black bg-white p-8 w-full h-full">
			<div class="w-full grid place-items-start">
				<h2 class="text-2xl font-bold">Feel free to contact the developer!</h2>
				<p>Give feedbacks, request for a new feature, or just contact!</p>
			</div>
			<Label>Name</Label>
			<Input color="green" placeholder="Your name" />
			<Label>Your Email</Label>
			<Input color="green" placeholder="What's your email?" />
			<Label>Title</Label>
			<Input color="green" placeholder="State your inquiry (Title)" />
			<Label>Details</Label>
			<Textarea
				placeholder="Details (Please state who you are and your inquiry)"
				rows={5}
				class="bg-green-50 !border-green-500 !ring-0"
			/>
			<button>
				<PrimaryButtonWrapper>
					<div class="flex flex-row items-center justify-center">
            <span>Send</span>
						<Icon icon="material-symbols:send" class="text-white w-6 h-6 ml-2" />
					</div>
				</PrimaryButtonWrapper>
			</button>
		</div>
	</div>
</form>
