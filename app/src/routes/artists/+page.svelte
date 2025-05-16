<script lang="ts">
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import { makeImageLink } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Artists · Soli</title>
	<meta name="description" content="Browse musical artists on Soli." />
</svelte:head>

<h2>Artists</h2>

<div class="artists-container">
	{#each data.artists as artist}
		<ArtistCard
			link={`/artists/${artist.id}`}
			name={artist.name}
			image={artist.image_ipfs_cid
				? makeImageLink(artist.image_ipfs_cid)
				: '/person-placeholder.png'}
		/>
	{/each}
</div>

<style>
	.artists-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
