<script lang="ts">
	const { breadcrumbs }: { breadcrumbs: { link: string; label: string }[] } = $props();
</script>

<div class="breadcrumbs-container">
	{#each breadcrumbs as { link, label }, index}
		<div class="section-link">
			&gt;
			<a href={link}>{label}</a>
		</div>
	{/each}
</div>

<style>
	.breadcrumbs-container {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}
	.section-link {
		margin-bottom: 1rem;
	}
</style>
