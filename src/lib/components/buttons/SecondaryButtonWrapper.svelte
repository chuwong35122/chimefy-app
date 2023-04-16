<script lang="ts">
	let props = {
		class: [$$restProps.class]
	};
</script>

<div
	{...props}
	class={`w-full text-[16px] border border-white py-1.5 rounded-full hover:scale-105 bg-dark-500 px-2 hover:bg-[rgba(255,255,255,0.2)] duration-200 ${props.class}`}
>
	<slot />
</div>
