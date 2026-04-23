<script lang="ts">
	import CircleCard from '$lib/components/CircleCard.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import FeaturedArtistCard from '$lib/components/home/FeaturedArtistCard.svelte';
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

	const recentAlbums = $derived(
		data.releases.filter((release) => release.release_type === 'album').slice(0, 6)
	);
	const recentEPs = $derived(
		data.releases.filter((release) => release.release_type === 'ep').slice(0, 6)
	);
	const recentSingles = $derived(
		data.releases.filter((release) => release.release_type === 'single').slice(0, 6)
	);

	const followedArtists = $derived(
		data.artists.filter((artist) => data.followedArtists.includes(artist.id))
	);
	const otherArtists = $derived(
		data.artists.filter((artist) => !data.followedArtists.includes(artist.id))
	);

	const genres = $derived(data.releases.flatMap((release) => release.genres || []));
	const uniqueGenres = $derived(Array.from(new Set(genres)));

	const featuredArtist = $derived(otherArtists[Math.floor(Math.random() * otherArtists.length)]);

	const latestReleases = $derived([
		{
			label: 'Albums',
			releases: recentAlbums
		},
		{
			label: 'EPs',
			releases: recentEPs
		},
		{
			label: 'Singles',
			releases: recentSingles
		}
	]);
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

<div class="content">
	<section>
		<a href="/artists"><h2>Artists</h2></a>

		<div class="subsection">
			<h3>Spotlight</h3>
			<FeaturedArtistCard artist={featuredArtist} />
		</div>

		{#if followedArtists.length > 0}
			<div class="subsection">
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
			<div class="subsection">
				{#if followedArtists.length > 0}<h3>More you might like</h3>{/if}
				<GridWrapper>
					{#each otherArtists.filter((artist) => artist.id !== featuredArtist.id) as artist}
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
		<div class="section-header">
			<h2>Recent releases</h2>
			<a href="/releases">See all</a>
		</div>

		{#each latestReleases as { label, releases }}
			<div class="subsection">
				<h3>{label}</h3>
				<GridWrapper gridItemSize="150px" gridGap="20px">
					{#each releases as release}
						<ReleaseCard
							link={`/releases/${release.id}`}
							name={release.title}
							artist={release.artist.name}
							coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/each}
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
</div>

<style>
	.content {
		margin: 0 auto;
		max-width: 1200px;
	}
	section {
		margin-bottom: 2rem;
	}
	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.section-header h2 {
		margin: 0;
	}
	h3 {
		margin-bottom: 0.5rem;
	}
	.subsection {
		margin-bottom: 2rem;
	}
</style>
