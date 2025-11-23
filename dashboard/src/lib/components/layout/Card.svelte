<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="card">
	{@render children()}
</div>

<style>
	:root {
		--card-background: #f9f9f9;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--card-background: #313131;
		}
	}
	.card {
		color: var(--color-text);
		background-color: var(--card-background);
		line-height: 1.1;
		padding: 0.5rem;
		margin: 0 0 1rem 0;
		border-radius: 5px;
		box-shadow: var(--box-shadow);
	}
</style>
