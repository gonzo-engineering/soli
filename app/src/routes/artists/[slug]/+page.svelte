<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { ArtistHydrated, ReleaseHydrated } from '$lib/types';

	let { data }: { data: { artist: ArtistHydrated; releases: ReleaseHydrated[] } } = $props();

	const { name, description, website } = data.artist;

	const lps = data.releases.filter((release) => release.type === 'LP');
	const eps = data.releases.filter((release) => release.type === 'EP');
	const singles = data.releases.filter((release) => release.type === 'Single');
</script>

<svelte:head>
	<title>{name} · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<small>Artists</small>

<h2>{name}</h2>

{#if data.artist.imageLink}
	<img src={data.artist.imageLink} alt={`Image of ${name}`} />
{/if}

<div>{description}</div>

<a href={website}>{website.replace('https://', '').replaceAll('/', '')}</a>

<h3>Music</h3>

<!-- TODO: Sort by type (LP, EP, Single) and release date -->

{#if lps.length > 0}
	<h4>LPs</h4>
	<ReleaseCardGrid releases={lps} />
{/if}

{#if eps.length > 0}
	<h4>EPs</h4>
	<ReleaseCardGrid releases={eps} />
{/if}

{#if singles.length > 0}
	<h4>Singles</h4>
	<ReleaseCardGrid releases={singles} />
{/if}
