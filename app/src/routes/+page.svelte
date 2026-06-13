<script lang="ts">
	import CircleCard from '$lib/components/CircleCard.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import FeaturedArtistCard from '$lib/components/home/FeaturedArtistCard.svelte';
	import WelcomeExplainer from '$lib/components/layout/WelcomeExplainer.svelte';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import TagsGrid from '$lib/components/tags/TagsGrid.svelte';
	import type { UserData } from '$lib/global/state.svelte';
	import { makeImageLink } from '$lib/utils';
	import type { Artist, LabelHydrated, ReleaseHydrated } from '@soli/shared/types';

	let {
		data
	}: {
		data: UserData & {
			latestReleases: {
				label: string;
				releases: ReleaseHydrated[];
			}[];
			artists: {
				featured: Artist;
				followed: Artist[];
				other: Artist[];
			};
			labels: LabelHydrated[];
			genres: string[];
		};
	} = $props();
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
			<FeaturedArtistCard artist={data.artists.featured} />
		</div>

		{#if data.artists.followed.length > 0}
			<div class="subsection">
				<h3>Your followed artists</h3>
				<GridWrapper>
					{#each data.artists.followed as artist}
						<CircleCard
							name={artist.name}
							image={artist.image_ipfs_cid ? makeImageLink(artist.image_ipfs_cid, 200) : undefined}
							link={`/artists/${artist.id}`}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/if}

		{#if data.artists.other.length > 0}
			<div class="subsection">
				{#if data.artists.followed.length > 0}<h3>More you might like</h3>{/if}
				<GridWrapper>
					{#each data.artists.other as artist}
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

		{#each data.latestReleases as { label, releases }}
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
		<TagsGrid slugs={data.genres} type="genres" />
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
