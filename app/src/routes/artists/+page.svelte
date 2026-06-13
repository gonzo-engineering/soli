<script lang="ts">
	import CircleCard from '$lib/components/CircleCard.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import { makeImageLink } from '$lib/utils/index.js';
	import type { Artist } from '@soli/shared/types';

	let { data } = $props();

	const followedArtists = data.artists.filter((artist) => data.followedArtists.includes(artist.id));
	const otherArtists = data.artists.filter((artist) => !data.followedArtists.includes(artist.id));
</script>

<svelte:head>
	<title>Artists · Soli</title>
	<meta name="description" content="Browse musical artists on Soli." />
</svelte:head>

<h2>Artists</h2>

{#if followedArtists.length > 0}
	<div class="artist-card-subsection">
		<h3>Your followed artists</h3>
		{@render grid(followedArtists)}
	</div>
{/if}

{#if otherArtists.length > 0}
	<div class="artist-card-subsection">
		{#if followedArtists.length > 0}<h3>More you might like</h3>{/if}
		{@render grid(otherArtists)}
	</div>
{/if}

{#snippet grid(artists: Artist[])}
	<GridWrapper>
		{#each artists as artist}
			<CircleCard
				name={artist.name}
				image={artist.image_ipfs_cid ? makeImageLink(artist.image_ipfs_cid, 200) : undefined}
				link={`/artists/${artist.id}`}
			/>
		{/each}
	</GridWrapper>
{/snippet}

<style>
	h3 {
		margin-bottom: 0.5rem;
	}
	.artist-card-subsection {
		margin-bottom: 2rem;
	}
</style>
