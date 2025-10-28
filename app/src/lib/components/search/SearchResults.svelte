<script lang="ts">
	import { makeImageLink } from '$lib/utils';
	import type { SearchResult } from '../../../../../shared/types/core';
	import ArtistCard from '../ArtistCard.svelte';
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
		<h2>Search results for '{query}'</h2>
		{#if searchResultsArtists.length > 0}
			<div class="search-results-section">
				<h3>Artists</h3>
				{#each searchResultsArtists as artist}
					<ArtistCard
						name={artist.name}
						image={artist.image_cid ? makeImageLink(artist.image_cid, 200) : undefined}
						link={`/artists/${artist.id}`}
					/>
				{/each}
			</div>
		{/if}
		{#if searchResultsReleases.length > 0}
			<div class="search-results-section">
				<h3>Releases</h3>
				{#each searchResultsReleases as release}
					<ReleaseCard
						name={release.name}
						coverArt={release.image_cid ? makeImageLink(release.image_cid, 200) : ''}
						link={`/releases/${release.id}`}
					/>
				{/each}
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
		margin: 1rem;
	}
	.search-results-section {
		margin-bottom: 1.5rem;
	}
</style>
