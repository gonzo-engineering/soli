<script lang="ts">
	import { makeImageLink } from '$lib/utils';
	import type { SearchResult } from '@soli/shared/types/core';
	import CircleCard from '../CircleCard.svelte';
	import GridWrapper from '../GridWrapper.svelte';
	import ReleaseCard from '../ReleaseCard.svelte';

	let { searchResults, query }: { searchResults: SearchResult[]; query: string } = $props();

	let searchResultsArtists: SearchResult[] = $derived(
		searchResults.filter((result) => result.type === 'artist')
	);
	let searchResultsReleases: SearchResult[] = $derived(
		searchResults.filter((result) => result.type === 'release')
	);
	// let searchResultsTracks: SearchResult[] = $derived(
	// 	searchResults.filter((result) => result.type === 'track')
	// );
</script>

<div class="search-results">
	{#if searchResults.length > 0}
		<div>Results for '{query}'</div>
		{#if searchResultsArtists.length > 0}
			<div class="search-results-section">
				<h3>Artists</h3>
				<GridWrapper>
					{#each searchResultsArtists as artist}
						<CircleCard
							name={artist.name}
							image={artist.image_cid ? makeImageLink(artist.image_cid, 200) : undefined}
							link={`/artists/${artist.id}`}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/if}
		{#if searchResultsReleases.length > 0}
			<div class="search-results-section">
				<h3>Releases</h3>
				<GridWrapper>
					{#each searchResultsReleases as release}
						<ReleaseCard
							name={release.name}
							coverArt={release.image_cid ? makeImageLink(release.image_cid, 200) : ''}
							link={`/releases/${release.id}`}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/if}
		<!-- {#if searchResultsTracks.length > 0}
			<div class="search-results-section">
				<h3>Tracks</h3>
				{#each searchResultsTracks as track}
					{track.name}
				{/each}
			</div>
		{/if} -->
	{/if}
</div>

<style>
	h3 {
		margin-bottom: 1rem;
	}
	.search-results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.search-results-section {
		margin-bottom: 1.5rem;
	}
</style>
