<script lang="ts">
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const releases = data.manifests
		.map((manifest) => {
			return manifest.releases.map((release) => {
				return {
					...release,
					artistName: manifest.artist.name
				};
			});
		})
		.flat();
</script>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<ReleaseCardGrid {releases} />
</section>

<section>
	<a href="/artists"><h2>Artists</h2></a>

	<div class="artists-container">
		{#each data.manifests as { artist }}
			<ArtistCard link={`/artists/${artist.id}`} name={artist.name} image={artist.imageLink} />
		{/each}
	</div>
</section>

<style>
	section {
		margin-bottom: 2rem;
	}
	.artists-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
