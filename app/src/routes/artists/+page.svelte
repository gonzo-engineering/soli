<script lang="ts">
	import ArtistCardGrid from '$lib/components/ArtistCardGrid.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Artists · Soli</title>
	<meta name="description" content="Browse musical artists on Soli." />
</svelte:head>

<h2>Artists</h2>

{#if data.artists.length === 0}
	<p>No artists found.</p>
{:else}
	<ArtistCardGrid artists={data.artists} />
{/if}
