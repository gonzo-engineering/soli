<script lang="ts">
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import { makeImageLink } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Soli</title>
	<meta name="description" content="Music streaming that doesn't fuck musicians." />
</svelte:head>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<ReleaseCardGrid releases={data.releases} />
</section>

<section>
	<a href="/artists"><h2>Artists</h2></a>

	<div class="artists-container">
		{#each data.artists as artist}
			<ArtistCard
				link={`/artists/${artist.id}`}
				name={artist.name}
				image={artist.image_ipfs_cid
					? makeImageLink(artist.image_ipfs_cid)
					: '/person-placeholder.png'}
			/>
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
