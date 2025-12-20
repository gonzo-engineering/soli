<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children, onClickFunction }: { children: Snippet; onClickFunction: () => void } = $props();
</script>

<div
	class="button-wrapper"
	onclick={() => onClickFunction()}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onClickFunction;
		}
	}}
	role="button"
	tabindex="0"
>
	{@render children()}
</div>

<style>
	.button-wrapper:hover {
		cursor: pointer;
		opacity: 0.8;
	}
</style>
