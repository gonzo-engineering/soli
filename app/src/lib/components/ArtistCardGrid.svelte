<script lang="ts">
	import type { ArtistRaw } from '$lib/types';
	import { makeImageLink } from '$lib/utils';
	import ArtistCard from './ArtistCard.svelte';

	let {
		artists
	}: {
		artists: ArtistRaw[];
	} = $props();
</script>

<div class="releases-grid">
	{#each artists as artist}
		<ArtistCard
			link={`/artists/${artist.id}`}
			name={artist.name}
			image={artist.image_ipfs_cid
				? makeImageLink(artist.image_ipfs_cid, 200)
				: '/person-placeholder.png'}
		/>
	{/each}
</div>

<style>
	.releases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 10px;
	}
</style>
