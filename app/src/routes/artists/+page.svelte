<script lang="ts">
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import type { ArtistHydrated, ArtistManifest } from '$lib/types';

	let { data }: { data: { artistsWithLinks: ArtistManifest[] } } = $props();
</script>

<svelte:head>
	<title>Artists · Soli</title>
	<meta name="description" content="Browse musical artists on Soli." />
</svelte:head>

<h2>Artists</h2>

<div class="artists-container">
	{#each data.artistsWithLinks as { artist }}
		<ArtistCard link={`/artists/${artist.id}`} name={artist.name} image={artist.imageLink} />
	{/each}
</div>

<style>
	.artists-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
