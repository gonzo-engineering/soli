<script lang="ts">
	import ArtistCardGrid from '$lib/components/ArtistCardGrid.svelte';

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
		<ArtistCardGrid artists={followedArtists} />
	</div>
{/if}

{#if otherArtists.length > 0}
	<div class="artist-card-subsection">
		{#if followedArtists.length > 0}<h3>More you might like</h3>{/if}
		<ArtistCardGrid artists={otherArtists} />
	</div>
{/if}

<style>
	h3 {
		margin-bottom: 0.5rem;
	}
	.artist-card-subsection {
		margin-bottom: 2rem;
	}
</style>
