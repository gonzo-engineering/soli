<script lang="ts">
	import CircleCard from '$lib/components/CircleCard.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import WelcomeExplainer from '$lib/components/layout/WelcomeExplainer.svelte';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import TagsGrid from '$lib/components/tags/TagsGrid.svelte';
	import type { UserData } from '$lib/global/state.svelte';
	import { makeImageLink } from '$lib/utils';
	import type { Artist, Label } from '../../../shared/types/core';
	import type { ReleaseHydrated } from '../../../shared/types/hydrated';

	let {
		data
	}: {
		data: UserData & {
			releases: ReleaseHydrated[];
			artists: Artist[];
			labels: Label[];
		};
	} = $props();

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

{#if !data.session}
	<section>
		<WelcomeExplainer />
	</section>
{/if}

<section>
	<a href="/artists"><h2>Artists</h2></a>

	{#if followedArtists.length > 0}
		<div class="artist-card-subsection">
			<h3>Your followed artists</h3>
			<GridWrapper>
				{#each followedArtists as artist}
					<CircleCard
						name={artist.name}
						image={artist.image_ipfs_cid ? makeImageLink(artist.image_ipfs_cid, 200) : undefined}
						link={`/artists/${artist.id}`}
					/>
				{/each}
			</GridWrapper>
		</div>
	{/if}

	{#if otherArtists.length > 0}
		<div class="artist-card-subsection">
			{#if followedArtists.length > 0}<h3>More you might like</h3>{/if}
			<GridWrapper>
				{#each otherArtists as artist}
					<CircleCard
						name={artist.name}
						image={artist.image_ipfs_cid ? makeImageLink(artist.image_ipfs_cid, 200) : undefined}
						link={`/artists/${artist.id}`}
					/>
				{/each}
			</GridWrapper>
		</div>
	{/if}
</section>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<GridWrapper gridItemSize="150px" gridGap="20px">
		{#each albumsAndEPs as release}
			<ReleaseCard
				link={`/releases/${release.id}`}
				name={release.title}
				artist={release.artist.name}
				coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
			/>
		{/each}
	</GridWrapper>
</section>

<section>
	<a href="/labels"><h2>Labels</h2></a>
	<GridWrapper>
		{#each data.labels as label}
			<CircleCard
				name={label.name}
				image={label.image_cid ? makeImageLink(label.image_cid, 200) : undefined}
				link={`/labels/${label.id}`}
			/>
		{/each}
	</GridWrapper>
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
