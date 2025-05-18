<script lang="ts">
	import type { ReleaseHydrated } from '$lib/types';
	import { makeImageLink } from '$lib/utils';
	import ReleaseCard from './ReleaseCard.svelte';

	let {
		releases,
		hideArtistName = false
	}: {
		releases: ReleaseHydrated[];
		hideArtistName?: boolean;
	} = $props();
</script>

<div class="releases-grid">
	{#each releases as release}
		<ReleaseCard
			link={`/releases/${release.id}`}
			name={release.title}
			artist={release.artist_name}
			coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
			hideArtist={hideArtistName}
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
