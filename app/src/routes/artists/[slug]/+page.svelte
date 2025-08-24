<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { ArtistRaw, ReleaseHydrated } from '../../../../../shared/types';
	import { makeImageLink } from '$lib/utils';
	import { sortReleasesByDate } from '../../../../../shared/utils';

	let { data }: { data: { artist: ArtistRaw; releases: ReleaseHydrated[] } } = $props();

	const { name, bio, website_url, image_ipfs_cid } = data.artist;

	const releasesSorted = sortReleasesByDate(data.releases);

	const lps = releasesSorted.filter((release) => release.release_type === 'album');
	const eps = releasesSorted.filter((release) => release.release_type === 'ep');
	const singles = releasesSorted.filter((release) => release.release_type === 'single');
</script>

<svelte:head>
	<title>{name} · Artists · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<div class="section-link">
	> <a href="/artists">Artists</a>
</div>

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
	</div>

	<div class="artist-music">
		<h3>Music</h3>

		<!-- TODO: Sort by type (LP, EP, Single) and release date -->

		{#if lps.length > 0}
			<div class="release-type-section">
				<h4>LPs</h4>
				<ReleaseCardGrid
					releases={lps.map((lp) => {
						return {
							...lp,
							artistName: name
						};
					})}
					hideArtistName
				/>
			</div>
		{/if}

		{#if eps.length > 0}
			<div class="release-type-section">
				<h4>EPs</h4>
				<ReleaseCardGrid
					releases={eps.map((ep) => {
						return {
							...ep,
							artistName: name
						};
					})}
					hideArtistName
				/>
			</div>
		{/if}

		{#if singles.length > 0}
			<div class="release-type-section">
				<h4>Singles</h4>
				<ReleaseCardGrid
					releases={singles.map((single) => {
						return {
							...single,
							artistName: name
						};
					})}
					hideArtistName
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.section-link {
		margin-bottom: 1rem;
	}
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
	@media (min-width: 600px) {
		h3 {
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
</style>
