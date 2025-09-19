<script lang="ts">
	let { slugs, type }: { slugs: string[]; type: 'genres' | 'tags' } = $props();
</script>

<div class="badge-grid">
	{#each slugs as slug}
		<a href="/{type}/{slug}" class="badge">{slug}</a>
	{/each}
</div>

<style>
	.badge-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.badge {
		background-color: lightgray;
		color: #333;
		padding: 0 0.5rem;
		border-radius: 4px;
		width: fit-content;
		text-decoration: none;
		font-weight: 500;
	}
	.badge:hover {
		opacity: 0.8;
	}
</style>
