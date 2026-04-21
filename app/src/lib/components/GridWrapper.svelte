<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		gridItemSize = '100px',
		gridGap = '10px'
	}: { children: Snippet; gridItemSize?: string; gridGap?: string } = $props();
</script>

<div class="grid-wrapper" style="--grid-item-size: {gridItemSize}; --grid-gap: {gridGap}">
	{@render children()}
</div>

<style>
	.grid-wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-size), 1fr));
		gap: var(--grid-gap);
	}
</style>
