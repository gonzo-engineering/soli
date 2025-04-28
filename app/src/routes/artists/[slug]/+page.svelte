<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { ArtistHydrated, ArtistManifest, ReleaseHydrated } from '$lib/types';

	let { data }: { data: { artistManifest: ArtistManifest } } = $props();

	const { name, description, website } = data.artistManifest.artist;

	const lps = data.artistManifest.releases.filter((release) => release.type === 'LP');
	const eps = data.artistManifest.releases.filter((release) => release.type === 'EP');
	const singles = data.artistManifest.releases.filter((release) => release.type === 'Single');
</script>

<svelte:head>
	<title>{name} · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<small>Artists</small>

<h2>{name}</h2>

{#if data.artistManifest.artist.imageLink}
	<img src={data.artistManifest.artist.imageLink} alt={`Image of ${name}`} />
{/if}

<div>{description}</div>

<a href={website}>{website.replace('https://', '').replaceAll('/', '')}</a>

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
