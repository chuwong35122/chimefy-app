<script lang="ts">
	let props = {
		class: [$$restProps.class]
	};
</script>

<div
	{...props}
	class={`w-full text-lg border border-white px-4 py-2 rounded-full hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] duration-200 ${props.class}`}
>
	<slot />
</div>
