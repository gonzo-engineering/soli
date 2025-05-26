<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children, onClickFunction }: { children: Snippet; onClickFunction: () => void } = $props();
</script>

<div
	onclick={onClickFunction}
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
