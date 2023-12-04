<script>
	import {
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterLink,
		FooterBrand,
		FooterIcon
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
</script>

<Footer footerType="socialmedia" class="bg-transparent mt-20 w-full">
	<div class="md:flex md:justify-between">
		<div class="mb-6 md:mb-0 flex flex-row items-center gap-4">
			<FooterBrand src="/logo/chimefy/logo_light.svg" alt="Chimefy Logo" name="Chimefy" />
			<p class="text-xl font-bold">Chimefy</p>
		</div>
		<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase">Resources</h2>
				<FooterLinkGroup ulClass="space-y-2">
					<FooterLink href="/" liClass='text-dark-300'>Home</FooterLink>
					<FooterLink href="/profile" liClass='text-dark-300'>Profile</FooterLink>
					<FooterLink href="/contact" liClass='text-dark-300'>Contact</FooterLink>
				</FooterLinkGroup>
			</div>
			<div>
				<h2 class="mb-6 text-sm font-semibold uppercase">Space</h2>
				<FooterLinkGroup ulClass="space-y-2">
					<FooterLink href="/space" liClass='text-dark-300'>Join a Space</FooterLink>
					<FooterLink href="/create" liClass='text-dark-300'>Create a Space</FooterLink>
				</FooterLinkGroup>
			</div>
		</div>
	</div>
	<div class="sm:flex sm:items-center sm:justify-between mt-4">
		<FooterCopyright href="/" by="Chimefy" />
		<div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
			<FooterIcon href="https://github.com/chuwong35122/chimefy-app" aClass='flex flex-row gap-2 items-center'>
        <span class='text-dark-300 text-sm'>Please contribute to</span>
				<Icon icon="mdi:github" width={30} height={30} class="text-white" />
			</FooterIcon>
		</div>
	</div>
</Footer>
