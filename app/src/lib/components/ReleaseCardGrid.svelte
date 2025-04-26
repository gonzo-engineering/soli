<script lang="ts">
	import type { ReleaseHydrated } from '$lib/types';
	import ReleaseCard from './ReleaseCard.svelte';

	let { releases }: { releases: ReleaseHydrated[] } = $props();
</script>

<div class="releases-grid">
	{#each releases as release}
		<ReleaseCard
			link={`/releases/${release.id}`}
			name={release.name}
			artist={release.artist.name}
			coverArt={release.coverLink}
		/>
	{/each}
</div>

<style>
	.releases-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
