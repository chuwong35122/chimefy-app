<script lang="ts">
	export let label = '';
	export let required = false;
	export let labelPosition: 'start' | 'center' | 'end';
	export let value = ''
	export let labelClass = ''
	let props = {
		name: $$restProps.name,
		class: [$$restProps.class],
		placeholder: $$restProps.placeholder,
	};

	function getLabelPositionClass() {
		switch (labelPosition) {
			case 'start':
				return 'place-items-start';
			case 'center':
				return 'place-items-center';
			case 'end':
				return 'place-items-end';
		}
	}
</script>

<div class={`grid place-items-center ${getLabelPositionClass()}`}>
	<label for={props.name} class={`text-dark-200 text-xs mb-1 ${labelClass}`}>{label}</label>
	<input
		bind:value={value}
		name={props.name}
		type="text"
		placeholder={props.placeholder}
		{required}
		class={` bg-dark-500 rounded-full focus:border-white duration-200 ${props.class}`}
	/>
</div>
