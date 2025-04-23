<script lang="ts">
	import type { Artist } from '$lib/types';

	let { data }: { data: { artists: Artist[] } } = $props();
</script>

<svelte:head>
	<title>Artists · Soli</title>
	<meta name="description" content="Browse musical artists on Soli." />
</svelte:head>

<h2>Artists</h2>

{#each data.artists as artist}
	<div class="artist-circle">
		<a href={`/artists/${artist.id}`}><h3>{artist.name}</h3></a>
	</div>
{/each}
