<script lang="ts">
	import type { Artist, Release } from '$lib/types';

	let { data }: { data: { release: Release; artist: Artist } } = $props();

	const { name } = data.release;
</script>

<svelte:head>
	<title>{name} · Releases · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<h2>{name}</h2>
<div>
	By <a href={`/artists/${data.artist.id}`}>{data.artist.name}</a>
</div>
