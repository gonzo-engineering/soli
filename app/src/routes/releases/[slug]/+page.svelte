<script lang="ts">
	import type { Release } from '$lib/types';

	let { data }: { data: { release: Release } } = $props();

	const { name, artistID } = data.release;
</script>

<svelte:head>
	<title>{name} · Releases · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<h2>{name}</h2>
<a href={`/artists/${artistID}`}><h3>Artist</h3></a>
