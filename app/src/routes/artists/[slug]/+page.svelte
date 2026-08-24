<script lang="ts">
	import type { ArtistHydrated, Release } from '@soli/shared/types';
	import { makeImageLink } from '$lib/utils';
	import { toggleFollowedArtist } from '$lib/remote-functions/user.remote';
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import type { UserData } from '$lib/global/state.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import CircleCard from '$lib/components/CircleCard.svelte';

	let {
		data
	}: {
		data: UserData & {
			artist: ArtistHydrated;
		};
	} = $props();

	const sortReleasesByDate = (releases: Release[]) => {
		return releases.sort((a, b) => {
			return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
		});
	};

	const { name, bio, website_url, image_ipfs_cid } = $derived(data.artist);
	const releases = $derived(sortReleasesByDate(data.artist.releases));

	const filterReleasesByType = (type: 'album' | 'ep' | 'single', releases: Release[]) => {
		return releases.filter((release) => release.release_type === type);
	};

	const lps = $derived(filterReleasesByType('album', releases));
	const eps = $derived(filterReleasesByType('ep', releases));
	const singles = $derived(filterReleasesByType('single', releases));
</script>

<svelte:head>
	<title>{name} · Artists · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/artists', label: 'Artists' }]} />

<div class="container">
	<div class="artist-summary-card">
		<h2>{name}</h2>

		{#if image_ipfs_cid}
			<img class="artist-image" src={makeImageLink(image_ipfs_cid, 500)} alt={`Image of ${name}`} />
		{/if}

		<div>{bio}</div>

		{#if data.artist.website_url}
			<a href={website_url}>{website_url?.replace('https://', '').replaceAll('/', '')}</a>
		{/if}

		<hr class:hide-on-larger-screens={!data.profileData} />

		{#if data.profileData}
			<div class="follow-artist-section">
				<div>
					You are {data.followedArtists.includes(data.artist.id) ? 'following' : 'not following'} this
					artist.
				</div>
				<form {...toggleFollowedArtist}>
					<input {...toggleFollowedArtist.fields.artistID.as('hidden', data.artist.id)} />
					<input
						{...toggleFollowedArtist.fields.addOrRemove.as(
							'hidden',
							data.followedArtists.includes(data.artist.id) ? 'remove' : 'add'
						)}
					/>
					<button type="submit">
						{data.followedArtists.includes(data.artist.id) ? 'Unfollow' : 'Follow'}
					</button>
				</form>
			</div>
		{/if}
	</div>

	<div class="artist-music">
		<h3>Music</h3>

		<!-- TODO: Sort by type (LP, EP, Single) and release date -->

		{#if lps.length > 0}
			<div class="release-type-section">
				<h4>LPs</h4>
				<GridWrapper gridItemSize="150px" gridGap="20px">
					{#each lps as lp}
						<ReleaseCard
							link={`/releases/${lp.id}`}
							name={lp.title}
							coverArt={makeImageLink(lp.artwork_ipfs_cid, 200)}
							releaseDate={lp.release_date}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/if}

		{#if eps.length > 0}
			<div class="release-type-section">
				<h4>EPs</h4>
				<GridWrapper gridItemSize="150px" gridGap="20px">
					{#each eps as ep}
						<ReleaseCard
							link={`/releases/${ep.id}`}
							name={ep.title}
							coverArt={makeImageLink(ep.artwork_ipfs_cid, 200)}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/if}

		{#if singles.length > 0}
			<div class="release-type-section">
				<h4>Singles</h4>
				<GridWrapper gridItemSize="150px" gridGap="20px">
					{#each singles as single}
						<ReleaseCard
							link={`/releases/${single.id}`}
							name={single.title}
							coverArt={makeImageLink(single.artwork_ipfs_cid, 200)}
						/>
					{/each}
				</GridWrapper>
			</div>
		{/if}
	</div>

	{#if data.artist.label}
		<hr />
		<div>
			<h3>Label</h3>
			<CircleCard
				name={data.artist.label.name}
				image={data.artist.label.image_cid
					? makeImageLink(data.artist.label.image_cid, 200)
					: '/placeholder-label.png'}
				link={`/labels/${data.artist.label.id}`}
			/>
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 1100px;
		margin: 0 auto;
		@media (min-width: 600px) {
			display: grid;
			grid-template-columns: 1fr 2fr;
			gap: 2rem;
		}
	}
	h2 {
		margin: 0;
		padding: 0;
	}
	h4 {
		font-size: 1.6rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: gray;
	}
	hr {
		border: none;
		border-top: 1px solid var(--color-accent);
		margin: 1rem 0;
		opacity: 0.3;
	}
	@media (min-width: 600px) {
		h3 {
			display: none;
		}
		.hide-on-larger-screens {
			display: none;
		}
	}
	.artist-image {
		object-fit: cover;
	}
	.artist-summary-card {
		max-width: 500px;
		line-height: 1.2;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.artist-summary-card img {
		aspect-ratio: 1;
		background-color: var(--color-accent);
		border-radius: 10px;
		margin-bottom: 0.5rem;
		border: solid 2px var(--color-accent);
	}
	.release-type-section {
		margin-bottom: 1.5rem;
		width: 100%;
	}
	.follow-artist-section {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
</style>
