<script lang="ts">
	import ArtistCard from '$lib/components/ArtistCard.svelte';
	import type { ArtistHydrated } from '$lib/types';

	let { data }: { data: { artists: ArtistHydrated[] } } = $props();
</script>

<svelte:head>
	<title>Artists · Soli</title>
	<meta name="description" content="Browse musical artists on Soli." />
</svelte:head>

<h2>Artists</h2>

<div class="artists-container">
	{#each data.artists as { id, name }}
		<ArtistCard link={`/artists/${id}`} {name} />
	{/each}
</div>

<style>
	.artists-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
