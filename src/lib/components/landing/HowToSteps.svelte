<script lang="ts">
	import Icon from '@iconify/svelte';

	export let mousePosX = 0;
	export let mousePosY = 0;

	let front1: HTMLDivElement;
	let back1: HTMLDivElement;
	let front2: HTMLDivElement;
	let back2: HTMLDivElement;
	let front3: HTMLDivElement;
	let back3: HTMLDivElement;

	$: if (front1?.style && back1?.style) {
		const frontX = (mousePosX * -1) / 30;
		const frontY = (mousePosY * -1) / 30;
		const backX = (mousePosX * -1) / 20;
		const backY = (mousePosY * -1) / 20;

    const frontY2 = (mousePosY * -1) / 50;
    const backX2 = (mousePosX * -1) / 40;
    const backY2 = (mousePosY * -1) / 50;

		front1.style.transform = `translateX(${frontX}px) translateY(${frontY}px)`;
		back1.style.transform = `translateX(${backX}px) translateY(${backY}px)`;

		front2.style.transform = `translateX(${frontX}px) translateY(${frontY2}px)`;
		back2.style.transform = `translateX(${backX2}px) translateY(${backY2}px)`;

		front3.style.transform = `translateX(${frontX}px) translateY(${frontY2}px)`;
		back3.style.transform = `translateX(${backX2}px) translateY(${backY2}px)`;
	}
</script>

<!-- 1 -->
<div class="w-full p-8 flex flex-col lg:flex-row justify-around bg-purple-600/60 h-[180px]">
  <div class='relative z-50'>
    <p class="text-xl font-bold">Step 1.</p>
    <p class="text-5xl lg:text-6xl font-extrabold">Login to Spotify</p>
    <div class='mt-2'>
      <p>This app is only for Spotify premium user only!</p>
    </div>
  </div>
	<div class="relative">
		<div bind:this={front1} class="front1-style">
			<Icon icon="fa-brands:spotify" class="w-[90px] h-[90px] md:w-[160px] md:h-[160px] text-primary" />
		</div>
		<div bind:this={back1} class="back1-style">
			<Icon icon="fa-brands:spotify" class="w-[90px] h-[90px] md:w-[160px] md:h-[160px] text-black" />
		</div>
	</div>
</div>
<!-- 2 -->
<div class="w-full p-8 flex flex-col lg:flex-row-reverse justify-around bg-pink-600/70 h-[200px]">
  <div class='relative z-50'>
    <p class="text-xl font-bold">Step 2.</p>
    <p class="text-4xl lg:text-5xl font-extrabold">Create & Join Session</p>
    <div class='mt-2'>
      <p>Simply create your music room for anyone to join, customize it, and invite your friends!</p>
    </div>
  </div>
	<div class="relative">
    <div bind:this={front2} class="front2-style">
      <Icon icon="ion:enter" class="w-[90px] h-[90px] md:w-[160px] md:h-[160px] text-primary" />
    </div> 
    <div bind:this={back2} class="back2-style">
      <Icon icon="ion:enter" class="w-[90px] h-[90px] md:w-[160px] md:h-[160px] text-black" />
    </div> 
  </div>
</div>
<!-- 3 -->
<div class="w-full p-8 flex flex-col lg:flex-row justify-around bg-blue-600/70 h-[160px]">
  <div class='relative z-50'>
    <p class="text-xl font-bold">Step 3.</p>
    <p class="text-4xl lg:text-5xl font-extrabold">Control them yourselves</p>
    <div class='mt-2'>
      <p>Queue, Play, Pause, Go Previous, Go Next at your finger tip!</p>
    </div>
  </div>
	<div class="relative">
		<div bind:this={front3} class="front1-style">
			<Icon icon="ant-design:control-filled" class="w-[90px] h-[90px] md:w-[160px] md:h-[160px] text-primary" />
		</div>
		<div bind:this={back3} class="back1-style">
			<Icon icon="ant-design:control-filled" class="w-[90px] h-[90px] md:w-[160px] md:h-[160px] text-black" />
		</div>
	</div>
</div>

<style>
	.front1-style {
		transform: translateX(0px) translateY(0px);
		z-index: 5;
		position: absolute;
    right: 0;
	}
  
	.back1-style {
    transform: translateX(0px) translateY(0px);
		z-index: 0;
		position: absolute;
    right: 0;
	}

	.front2-style {
		transform: translateX(0px) translateY(0px);
		z-index: 5;
		position: absolute;
    left: 0rem;
	}
  
	.back2-style {
    transform: translateX(0px) translateY(0px);
		z-index: 0;
		position: absolute;
    left: 2px;
	}
</style>
