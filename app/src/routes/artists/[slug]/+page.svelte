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

<small>Artists</small>

<h2>{name}</h2>

{#if image_ipfs_cid}
	<img src={makeImageLink(image_ipfs_cid)} alt={`Image of ${name}`} />
{/if}

<div>{bio}</div>

{#if data.artist.website_url}
	<a href={website_url}>{website_url?.replace('https://', '').replaceAll('/', '')}</a>
{/if}

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
