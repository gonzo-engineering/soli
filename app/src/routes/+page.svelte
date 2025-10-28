<script lang="ts">
	import ArtistCardGrid from '$lib/components/ArtistCardGrid.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import TagsGrid from '$lib/components/tags/TagsGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const albumsAndEPs = data.releases.filter(
		(release) => release.release_type === 'album' || release.release_type === 'ep'
	);

	const followedArtists = data.artists.filter((artist) => data.followedArtists.includes(artist.id));
	const otherArtists = data.artists.filter((artist) => !data.followedArtists.includes(artist.id));

	const genres = data.releases.flatMap((release) => release.genres || []);
	const uniqueGenres = Array.from(new Set(genres));
</script>

<svelte:head>
	<title>Soli</title>
	<meta name="description" content="Music streaming that doesn't fuck musicians." />
</svelte:head>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<ReleaseCardGrid releases={albumsAndEPs} showArtistName />
</section>

<section>
	<a href="/artists"><h2>Artists</h2></a>

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
</section>

<section>
	<a href="/genres"><h2>Genres</h2></a>
	<TagsGrid slugs={uniqueGenres} type="genres" />
</section>

<style>
	section {
		margin-bottom: 2rem;
	}
	h3 {
		margin-bottom: 0.5rem;
	}
	.artist-card-subsection {
		margin-bottom: 2rem;
	}
</style>
