<script lang="ts">
	import { makeImageLink } from '$lib/utils';
	import ReleaseCard from './ReleaseCard.svelte';
	import type { Release } from '../../../../shared/types/core';
	import type { ReleaseHydrated } from '../../../../shared/types/hydrated';

	let {
		releases,
		showArtistName = false
	}: {
		releases: (Release | ReleaseHydrated)[];
		showArtistName?: boolean;
	} = $props();

	const isHydrated = (release: Release | ReleaseHydrated): release is ReleaseHydrated => {
		return (release as ReleaseHydrated).artist !== undefined;
	};
</script>

<div class="releases-grid">
	{#each releases as release}
		<ReleaseCard
			link={`/releases/${release.id}`}
			name={release.title}
			artist={isHydrated(release) && showArtistName ? release.artist.name : undefined}
			coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
		/>
	{/each}
</div>

<style>
	.releases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 20px;
	}
</style>
