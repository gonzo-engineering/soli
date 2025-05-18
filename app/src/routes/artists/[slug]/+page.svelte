<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { ArtistRaw, ReleaseHydrated } from '$lib/types';
	import { makeImageLink } from '$lib/utils';

	let { data }: { data: { artist: ArtistRaw; releases: ReleaseHydrated[] } } = $props();

	const { name, bio, website_url, image_ipfs_cid } = data.artist;

	const lps = data.releases.filter((release) => release.release_type === 'lp');
	const eps = data.releases.filter((release) => release.release_type === 'ep');
	const singles = data.releases.filter((release) => release.release_type === 'single');
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
			<img src={makeImageLink(image_ipfs_cid, 500)} alt={`Image of ${name}`} />
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
		{/if}

		{#if eps.length > 0}
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
		{/if}

		{#if singles.length > 0}
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
		@media (min-width: 600px) {
			flex-direction: row;
		}
	}
	h2,
	h3 {
		margin: 0;
		padding: 0;
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
		background-color: lightgray;
		border-radius: 10px;
		margin-bottom: 0.5rem;
		border: solid 2px lightgray;
	}
</style>
