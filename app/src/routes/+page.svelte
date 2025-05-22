<script lang="ts">
	import ArtistCardGrid from '$lib/components/ArtistCardGrid.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const albumsAndEPs = data.releases.filter(
		(release) => release.release_type === 'album' || release.release_type === 'ep'
	);
</script>

<svelte:head>
	<title>Soli</title>
	<meta name="description" content="Music streaming that doesn't fuck musicians." />
</svelte:head>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<ReleaseCardGrid releases={albumsAndEPs} />
</section>

<section>
	<a href="/artists"><h2>Artists</h2></a>

	<ArtistCardGrid artists={data.artists} />
</section>

<style>
	section {
		margin-bottom: 2rem;
	}
</style>
