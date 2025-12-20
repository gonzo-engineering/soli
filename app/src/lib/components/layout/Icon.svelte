<script lang="ts">
	import { icons } from '$lib/utils/icon-paths';

	let {
		key,
		size = 22,
		color = 'currentColor',
		strokeMode = false
	}: {
		key: keyof typeof icons;
		size?: string | number;
		color?: string;
		strokeMode?: boolean;
	} = $props();

	const iconData = icons[key];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={size}
	width={size}
	viewBox={iconData.viewBox}
	fill={strokeMode ? 'none' : color}
	style={'display: inline-block;'}
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
