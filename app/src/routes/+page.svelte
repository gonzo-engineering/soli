<script lang="ts">
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<ReleaseCardGrid releases={data.releases} />
</section>

<section>
	<a href="/artists"><h2>Artists</h2></a>

	<div class="artists-container">
		{#each data.artists as { id, name, imageLink }}
			<ArtistCard link={`/artists/${id}`} {name} image={imageLink} />
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
