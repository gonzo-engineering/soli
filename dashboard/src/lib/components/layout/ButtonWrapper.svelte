<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		label,
		onClickFunction,
		children
	}: { label: string; onClickFunction: () => void; children: Snippet } = $props();
</script>

<span
	aria-label={label}
	class="button-wrapper"
	onclick={() => onClickFunction()}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onClickFunction();
		}
	}}
	role="button"
	tabindex="0"
>
	{@render children()}
</span>

<style>
	.button-wrapper:hover {
		cursor: pointer;
		opacity: 0.8;
	}
</style>
