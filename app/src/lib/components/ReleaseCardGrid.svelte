<script lang="ts">
	import type { Release } from '$lib/types';
	import ReleaseCard from './ReleaseCard.svelte';

	let {
		releases,
		hideArtistName = false
	}: {
		releases: Release[];
		hideArtistName?: boolean;
	} = $props();
</script>

<div class="releases-grid">
	{#each releases as release}
		{#if release.coverLink && release.artistName}
			<ReleaseCard
				link={`/releases/${release.id}`}
				name={release.title}
				artist={release.artistName}
				coverArt={release.coverLink}
				hideArtist={hideArtistName}
			/>
		{/if}
	{/each}
</div>

<style>
	.releases-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
