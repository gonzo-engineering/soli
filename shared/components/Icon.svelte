<script lang="ts">
	import { icons } from './icon-paths';

	export type IconKey = keyof typeof icons;

	let {
		key,
		size = 22,
		color = 'currentColor',
		strokeMode = false,
		rotation = 0
	}: {
		key: IconKey;
		size?: string | number;
		color?: string;
		strokeMode?: boolean;
		rotation?: number;
	} = $props();

	const iconData = icons[key];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={size}
	width={size}
	viewBox={iconData.viewBox}
	fill={strokeMode ? 'none' : color}
	style={`display: inline-block; transform: rotate(${rotation}deg);`}
	stroke-width={3}
>
	{#each iconData.ds as d}
		<path
			{d}
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke={strokeMode ? color : 'none'}
			stroke-width={3}
		/>
	{/each}
</svg>
